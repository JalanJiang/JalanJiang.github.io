---
title:       Redis 字典与 rehash
description: 字典的实现
date:       2019-02-01 14:35:00
categories:
    - 技多不压身
tags:
    - Redis
toc: true
---

## 字典的实现

Redis 的字典使用哈希表作为底层实现。

### 哈希表

哈希表由 `dict.h/dictht` 结构定义

```
typedef struct dictht {

    // 哈希表数组
    dictEntry **table;

    // 哈希表大小
    unsigned long size;

    // 哈希表大小掩码，用于计算索引值
    // 总是等于 size - 1
    unsigned long sizemask;

    // 该哈希表已有节点的数量
    unsigned long used;

} dictht;
```

- table：数组，数组中的每个元素是一个指向 `dictEntry` 结构的指针
- dictEntry：每个 `dictEntry` 结构保存着一个键值对
- size：记录哈希表的大小
- used：哈希表目前已有节点
- sizemask：属性值总等于 `size - 1`，用于和哈希值一起决定一个键应该被放到 `table` 数组的哪个索引上

![一个空的哈希表](/img/in-post/redis/empty-hash-table.png)

### 哈希表节点

哈希表节点使用 `dictEntry` 结构表示， 每个 `dictEntry` 结构都保存着一个键值对：

```
typedef struct dictEntry {

    // 键
    void *key;

    // 值
    union {
        void *val;
        uint64_t u64;
        int64_t s64;
    } v;

    // 指向下个哈希表节点，形成链表
    struct dictEntry *next;

} dictEntry;
```

- key：键
- v：值，可以是指针、`uint64_t` 整数或 `int64_t` 整数
- next：指向下一个哈希表节点的指针

![哈希表节点](/img/in-post/redis/dict-entry.png)

### 字典

字典由 `dict.h/dict` 结构表示：

```
typedef struct dict {

    // 类型特定函数
    dictType *type;

    // 私有数据
    void *privdata;

    // 哈希表
    dictht ht[2];

    // rehash 索引
    // 当 rehash 不在进行时，值为 -1
    int rehashidx; /* rehashing not in progress if rehashidx == -1 */

} dict;
```

- type：一个指向 `dictType` 结构的指针
    - dictType：保存了一簇用于操作特定类型键值对的函数
- privdata：保存了需要传给那些类型特定函数的可选参数
- ht：包含两个项的数组
    - ht[0]：字典只使用 `ht[0]`
    - ht[1]：用于 rehash
- rehashidx：记录了 rehash 目前的进度

```
typedef struct dictType {

    // 计算哈希值的函数
    unsigned int (*hashFunction)(const void *key);

    // 复制键的函数
    void *(*keyDup)(void *privdata, const void *key);

    // 复制值的函数
    void *(*valDup)(void *privdata, const void *obj);

    // 对比键的函数
    int (*keyCompare)(void *privdata, const void *key1, const void *key2);

    // 销毁键的函数
    void (*keyDestructor)(void *privdata, void *key);

    // 销毁值的函数
    void (*valDestructor)(void *privdata, void *obj);

} dictType;
```

![字典](/img/in-post/redis/dict.png)

## rehash

### 目的

- 对哈希表的大小进行扩展或收缩
- 让哈希表的负载因子（load factor）维持在一个合理的范围内

### 负载因子

```
# 负载因子 = 哈希表已保存节点数量 / 哈希表大小
load_factor = ht[0].used / ht[0].size
```

### 步骤

1. 为字典的 `ht[1]` 哈希表分配空间
    - 扩展：`ht[1]` 的大小为第一个大于等于 `ht[0].used * 2` 的 `2^n` （2 的 n 次方幂）
    - 收缩：`ht[1]` 的大小为第一个大于等于 `ht[0].used` 的 `2^n`
2. 将保存在 `ht[0]` 中的所有键值对 rehash 到 `ht[1]` 上面
3. 释放 `ht[0]`，将 `ht[1]` 设置为 `ht[0]`，并在 `ht[1]` 新创建一个空白哈希表

## 渐进式 rehash

rehash 动作并不是一次性、集中式地完成的， 而是分多次、渐进式地完成。

因为如果键值的数目过多，一次性将这些键值对全部 rehash 到 `ht[1]` 的话， 庞大的计算量可能会导致服务器在一段时间内停止服务。


### 步骤

1. 为 `ht[1]` 分配空间
2. 在字典中维持一个索引计数器变量 `rehashidx` ， 并将它的值设置为 0 ， 表示 rehash 工作正式开始
3. 开始 rehash
    - 字典的删除（delete）、查找（find）、更新（update）等操作会在两个哈希表上进行
    - 新添加到字典的键值对则会一律会被保存到 `ht[1]` 里面
    - 字典执行添加、删除、查找或者更新操作时，程序除了执行指定的操作以外， 还会顺带将 `ht[0]` 哈希表在 rehashidx 索引上的所有键值对 rehash 到 `ht[1]`
    - 操作完成后，将 `rehashidx` 属性的值 `+1`
4. `ht[0]` 的所有键值对都会被 rehash 至 `ht[1]`，这时程序将 `rehashidx` 属性的值设为 -1 ， 表示 rehash 操作已完成

### 优点

- 分而治之，将 rehash 键值对所需的计算工作均滩到对字典的每个添加、删除、查找和更新操作上
- 避免集中式 rehash 而带来的庞大计算量

## 参考资料

- [美团针对Redis Rehash机制的探索和实践](https://tech.meituan.com/2018/07/27/redis-rehash-practice-optimization.html)
- 《Redis 设计与实现》