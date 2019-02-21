---
title:       Redis 持久化
description: RDB 与 AOF
date:       2019-02-05 16:36:00
categories:
    - 技多不压身
tags:
    - Redis
toc: true
---

# 持久化

- Redis 是内存数据库，数据库状态都存储在内存里
- 一旦服务器进程退出，服务器中的数据库状态会消失不见
- 为了保证数据在断电后不会丢失，需要将内存中的数据持久化到硬盘上

# RDB

- RDB 文件是一个经过压缩的二进制文件
- RDB 文件保存在硬盘里
- 通过保存数据库中的键值对来记录数据库状态

## 创建

有两个 Redis 命令可以用于生成 RDB 文件：

- SAVE
- BGSAVE

创建 RDB 的实际工作由 `rdb.c/rdbSave` 函数完成，SAVE 命令和 BGSAVE 命令调用方式不同。

### SAVE

- 会阻塞 Redis 服务器进程

```
def SAVE():
    # 创建 RDB 文件
    rdbSave()
```

### BGSAVE

- 会派生出一个子进程，负责创建 RDB 文件
- 服务器进程（父进程）继续处理命令请求

```
def BGSAVE():
    # 创建子进程
    pid = fork()
    
    if pid == 0:
        # 子进程负责创建 RDB 文件
        rdbSave()
        # 完成之后向父进程发送信号
        signal_parent()
    elif pid > 0:
        # 父进程继续处理命令请求，并通过轮训等待子进程的信号
        handle_request_and_wait_signal()
    else:
        handle_fork_error()
```

## 载入

- 载入工作在服务器启动时自动执行
- 服务器在载入 RDB 文件期间，会一直处于阻塞状态，直到载入工作完成为止

## 自动间隔性保存

Redis 允许用户通过设置服务器配置的 save 选项，让服务器每隔一段时间自动执行一次 BGSAVE 命令。

### 设置保存条件

若提供如下配置：

```
save 900 1
save 300 10
```

只要满足以下条件中的一个，BGSAVE 命令就会被执行：

- 服务器在 900 秒之内，对数据库进行了至少 1 次修改
- 服务器在 300 秒之内，对数据库进行了至少 10 次修改

### saveparams

服务器程序会根据 save 选项所设置的保存条件，设置服务器状态 redisServer 结构的 `saveparams` 属性。

- `saveparams` 属性是一个数组
- 数组中的每一个元素都是一个 `saveparam` 结构
- 每个 `saveparam` 结构都保存了一个 `save` 选项设置的保存条件

```
struct saveparam {
    // 秒数
    time_t seconds;
    // 修改数
    int changes;
}
```

### dirty

`dirty` 计数器记录距离上一次成功执行 SAVE 命令或 BGSAVE 命令之后，服务器对数据库状态进行了多少次修改（包括写入、删除、更新等操作）

### lastsave

是一个 UNINX 时间戳，记录了服务器上一次成功执行 SAVE 命令或者 BGSAVE 命令的时间。

### 检查保存条件是否满足

服务器周期性操作函数 `serverCron` （该函数对正在运行的服务器进行维护）默认每隔 100 毫秒就会执行一次，其中一项工作就是检查 save 选项所设置的保存条件是否已经满足，满足的话就执行 BGSAVE 命令。

伪代码如下：

```
def serverCron():
    # ....
    # 遍历所有保存条件
    for saveparam in server.saveparams:
        # 计算距离上次执行保存操作有多少秒
        save_interval = unixtime_now() - server.lastsave
        
        # 如果数据库状态的修改次数超过条件所设置的次数
        # 如果距离上次保存的时间超过条件所设置的时间
        if server.dirty >= saveparam.changes and save_interval > saveparam.seconds:
            BGSAVE()
```

# AOF

- 通过保存 Redis 服务器所执行的写命令来记录数据库状态
- 写入 AOF 文件的所有命令都是以 Redis 的**命令请求协议格式**保存的

## AOF 持久化实现

### 命令追加

若 AOF 持久化功能处于打开状态，服务器在执行完一个命令后，会以协议格式将被执行的写命令追加到服务器状态的 `aof_buf` 缓冲区的末尾。

### 文件写入与同步

- 服务器每次结束一个事件循环之前，都会调用 `flushAppendOnlyFile` 函数
- `flushAppendOnlyFile` 函数会考虑是否需要将 `aof_buf` 缓冲区中的内容写入和保存到 AOF 文件里
- `flushAppendOnlyFile` 函数执行以下工作：
    - WRITE：根据条件，将 aof_buf 中的缓存写入到 AOF 文件
    - SAVE：根据条件，调用 fsync 或 fdatasync 函数，将 AOF 文件保存到磁盘中
- `flushAppendOnlyFile` 函数的行为由服务器配置的 `appendfsync` 选项的值来决定

`appendfsync` 选项的值具体如下：

| 选项 | 同步频率 |
| ---- | ---- |
| always | 每个写命令都同步（效率低，但最安全） |
| everysec | 每秒同步一次 |
| no | 不进行同步，何时同步由操作系统来决定 |

#### 为何需要同步？

对文件进行写入并不会马上将内容同步到磁盘上，而是先存储到缓冲区，然后由操作系统决定什么时候同步到磁盘。

如果计算机停机，则保存在缓冲区的内容将会丢失。

## 载入与数据还原

1. 创建一个不带网络连接的伪客户端
2. 从 AOF 文件中分析并读取出一条写命令
3. 使用伪客户端执行被读出的写命令
4. 一直执行步骤 2 和 3，直到 AOF 文件中的所有写命令都被处理完毕为止

## AOF 重写

- 为了解决 AOF 文件体积膨胀的问题
- 通过重写创建一个新的 AOF 文件来替代现有的 AOF 文件，新的 AOF 文件不会包含任何浪费空间的冗余命令

### 实现

- 不需要对现有的 AOF 文件进行任何操作
- 从数据库中直接读取键现在的值
- 用一条命令记录键值对，从而代替之前记录这个键值对的多条命令

### AOF 后台重写

为不阻塞父进程，Redis 将 AOF 重写程序放到子进程里执行。

在子进程执行 AOF 重写期间，服务器进程需要执行三个工作：

1. 执行客户端发来的命令
2. 将执行后的写命令追加到 AOF 缓冲区
3. 将执行后的写命令追加到 AOF 重写缓冲区

这样一来可保证：

- AOF 缓冲区的内容会被写入和同步到 AOF 文件，对现有 AOF 文件的处理工作会如常进行
- 从创建重写子进程开始，所有写命令也会被记录到 AOF 重写缓冲区里，保证重写后的 AOF 文件与当前数据库状态一致
    
# 参考资料

- 《Redis 设计与实现》



