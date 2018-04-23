---
title:       Linux常用命令之 —— 文件查找与文件列表
description: find 是 Unix/Linux 命令行工具箱中最棒的工具之一
date:       2018-03-21 15:56:00
categories:
    - Web屠龙刀
tags:
    - Shell
toc: true
---

## 列出当前目录与子目录的所有文件与文件夹

```
find base_path
```

`base_path` 可以是任意位置，`find` 会从该位置开始向下查找。

```
# 打印未见和目录的列表
find . -print
```

- `.` 指当前目录
- `..` 指父级目录
- `-print` 指明打印出匹配文件的文件名（路径），并使用 `\n` 作为分隔
- `-print0` 指明使用 `\0` 作为匹配的文件名之间的定界符

## 根据文件名或正则进行搜索

### -name

```
find /home -name "*.txt" -print
```

- `-name`：指定了文件名所必须匹配的字符串
- `-iname`：忽略文件名大小写

匹配多个条件中的一个可以加入 OR 条件。

```
find . \( -name "*.txt" -o -name "*.pdf" \) -print
```

### -path

将文件路径作为一个整体进行匹配。

```
find /home/users -path "*/slynux/*" -print
```

### -regex

`-regex` 与 `-path` 类似，`-regex` 是基于正则表达式来匹配文件路径的。

```
find . -regex ".*\(\.py\|\.sh\)$"
```

`-iregex` 则忽略大小写。

## 否定参数

使用 `!` 否定参数的含义。

```
find . ! -name "*.txt" -print
```

## 基于目录深度搜索

- `-maxdepth`：指定搜索的最大深度
- `-mindepth`：指定搜索的最小深度

```
# 最大搜索深度为1层（在当前目录搜索）
find . -maxdepth 1 -name "f*" -print
```

```
# 最小深度为2层，从第2个子目录开始搜索
find . -mindepth 2 -name "f*" -print
```

## 根据文件类型搜索

```
# 搜索目录文件
find . -type d -print
```

文件类型 | 类型参数
---|---
普通文件 | f
符号链接 | l
目录 | d
字符设备 | c
块设备 | b
套接字 | s
FIFO | p

## 根据文件时间进行搜索

Unix/Linux 文件系统中每个文件都有三种时间戳。如下所示：

- 访问时间 `-atime`：用户最近一次访问文件的时间
- 修改时间 `-mtime`：文件内容最后一次被修改的时间
- 变化时间 `-ctime`：文件元数据（例如权限或所有权）最后一次改变的时间

将 `-atime` `-mtime` `-ctime` 作为 `find` 的时间选项，用整数值指定，单位是天。

```
find . -type f -atime -7 -print #最近7天被访问过的所有文件
find . -type f -atime 7 -print #恰好在7天前被访问的所有文件
find . -type f 0atime +7 -print #打印出访问时间超过7天的所有文件
```

`-amin` `-mmin` `-cmin` 的参数以分钟作为计量单位。

```
find . -type f -amin +7 -print #访问时间超过7分钟的所有文件
```

`-newer` 可以指定一个用于比较时间戳的参考文件。

```
# 找出比 file.txt 修改时间更近的所有文件
find . type -f -newer file.txt -print
```

## 基于文件大小搜索

```
# 找出大于2k的文件
find . -type f -size +2k
```

其他文件大小单元：

- b 块（512字节）
- c 字节
- w 字
- k 1024字节
- M 1024K字节
- G 1024M字节

## 删除匹配的文件

```
find . type -f -name "*.swp" -delete
```

## 基于文件权限和所有权的匹配

```
# 打印出权限为664的文件
find . type -f -perm 664 -print
```

## 利用 find 执行命令或动作

`find` 命令可以借助选项 `-exec` 与其他命名进行结合。

```
find . -type f -user root -exec chown slynux {} \;
```

`{}`：与 `-exec` 搭配使用的特殊字符，对于一个匹配的文件，`{}` 都会被替换成相应的文件名。上述操作的替换结果为：

```
chown slynux file1
chown slynux file2
```

## 让 find 跳过特定目录

```
find deve;/source_path \( -name ".git" -prune \) -o \( -type -f -print \)
```

`\( -name ".git" -prune \)` 用于排除（放在第一个语句块中）。`\( -type -f -print \)` 指明需要执行的动作（放在第二个语句块中）。

## 参考资料

- 《Linux Shell 脚本攻略（第2版）》