---
title:       B-Tree 与 B+Tree
description: MySQL 索引复盘
date:       2019-01-05 10:38:00
categories:
    - Web屠龙刀
tags:
    - MySQL 
toc: true
---

最近在看 MySQL 的相关书籍，在此复盘一下索引相关的数据结构 B-Tree 和 B+Tree。

## 诞生原因

二叉查找树的时间复杂度已经是 O(logN) 了，为什么还要使用 B-Tree 和 B+Tree 呢？

### 磁盘 IO 问题

平衡二叉树由于树深度过高而造成磁盘 IO 读写过于频繁，从而效率低下。为了减少磁盘 IO 的次数：

- 每个节点存储多个元素
- 摒弃二叉树，采用多叉树

从而诞生了多路查找树。

### 不平衡问题

二叉查找树存在的极端情况：所有节点都位于同一侧。

这种情况下查找效率就十分低下了，因此需要对二叉树左右子树的高度进行平衡化处理，于是就有了平衡二叉树（Balanced Binary Tree）。

平衡的概念：

- 各个分支的高度是均匀的
- 左右子树的高度之差绝对值小于 1

## B-Tree

![B-Tree](/img/in-post/b-tree.png)

### 特征

m 阶 B-Tree 特征：

- 每个节点最多可以拥有 m 棵子树
- 根节点：至少有 2 个节点
- 非根非叶节点：至少有 `ceil(m/2)` 个子树
- 非叶节点中的信息：`[n, A0, K1, A1, K2, A2, ..., Kn, An]`
    - n：节点中保存的关键字个数（`ceil(m/2) - 1 <= n <= m-1`）
    - K：关键字，有序，`Kn < k(n+1)`
    - A：指向子树根节点的指针
- 从根到叶子的每一条路径都有相同的长度（叶子节点都在相同层）

## B+Tree

![B+Tree](/img/in-post/b+tree.png)

### 特征

- 有 k 个子树的中间节点包含有 k 个元素（B-Tree 中是 k-1 个元素）
- 非叶子节点中每个元素不保存数据，仅用来索引。节点中仅含有其子树（根节点）中的最大（或最小）关键字
- 所有叶子节点中包含了全部元素的信息（无论查找成功与否，每次查找都走了一条从根到叶子节点的路径）
- 树的所有叶结点构成一个有序链表，可以按照关键码排序的次序遍历全部记录

### 优势

- 单一节点存储更多元素，磁盘 IO 次数更少
- 所有查询都要查找到叶子节点，查询性能稳定
- 所有叶子节点形成有序链表，便于范围查找（B-Tree 的范围查找需要通过中序遍历实现）

### 联合索引

MySQL 中的索引可以以一定顺序引用多个列，这种索引叫做复合（联合）索引，一般的，一个联合索引是一个有序元组 `<a1, a2, …, an>`，其中各个元素均为数据表的一列。

联合索引对多个值进行排序的依据是 `CREATE TABLE` 语句中定义索引时列的顺序。

#### 举个栗子

建表：

```sql
CREATE TABLE `student` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `cid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `name_cid_INX` (`name`,`cid`),
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8
```

这里使用了联合索引，索引列的顺序为 `<name, cid>`。所以现根据 `name` 排序，再根据 `cid` 排序。排序后的数据可能是这样的：

| name | cid |
| ---- | ---- |
| a | 6 |
| c | 4 |
| c | 5 |
| h | 1 |
| z | 9 |

由排序结果可以观察出：

- `name` 一定是有序的，`cid` 是无序的（**直接使用第二个cid字段进行条件判断是用不到索引的**）
- 若要 `cid` 有序，`name` 需等值匹配（**要想使用第二个索引，必须先使用第一个索引的原因**）

这样看来，一系列多列索引的有效查询条件就很好解释了。

#### 联合索引的有效查询条件

- 全值匹配：和索引中的所有列进行匹配
- 匹配最左前缀：只使用索引第一列
- 匹配列前缀：可以只匹配某一列的值的开头部分
- 匹配范围值：只匹配第一列的范围值
- 精确匹配某一列并范围匹配另一列：前缀精确匹配，后续跟一列范围匹配

##### 灵魂拷问

如果使用 `cid=1 AND name='小红'` 顺序设置 `WHERE` 是否还会使用索引呢？

**答案是会的**。

MySQL 查询优化器会判断纠正这条 SQL 语句该以什么样的顺序执行效率最高，最后才生成真正的执行计划。所以 `WHERE` 中 `AND` 条件的先后顺序对如何选择索引是无关的，优化器会去分析判断选用哪个索引。

## 搜索时间复杂度

### 二叉搜索树

一个有 n 个节点的二叉树，它的最小深度为 `log(n)`（log 底为2），最大深度为 `n`（所有节点都在树的同一边）。

二叉搜索树的深度越小，那么搜索所需要的运算时间越小。一个深度为 `log(n)` 的二叉搜索树，搜索算法的时间复杂度也是 `O(log n)`。

### 平衡二叉树

同样，一棵平衡二叉树的搜索时间复杂度为 `O(log n)`，n 是节点数，底数是树的分叉数。

![平衡二叉树高度计算](https://images2015.cnblogs.com/blog/303980/201703/303980-20170331183940836-1426600354.png)

## 在 MySQL 中的使用

### InnoDB 索引机制

创建表：

```
CREATE TABLE `zodiac` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` char(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `index_name` (`name`)
); 

insert zodiac(id,name) values(1,'鼠'); &nbsp;
insert zodiac(id,name) values(2,'牛'); &nbsp;
insert zodiac(id,name) values(3,'虎'); &nbsp;
insert zodiac(id,name) values(4,'兔'); &nbsp;
insert zodiac(id,name) values(5,'龙'); &nbsp;
insert zodiac(id,name) values(6,'蛇'); &nbsp;
insert zodiac(id,name) values(7,'马'); &nbsp;
insert zodiac(id,name) values(8,'羊'); &nbsp;
insert zodiac(id,name) values(9,'猴');
insert zodiac(id,name) values(10,'鸡'); &nbsp;
insert zodiac(id,name) values(11,'狗'); &nbsp;
insert zodiac(id,name) values(12,'猪');
```

![InnoDB 主索引](/img/in-post/innodb-index.png)

- B+Tree 每个节点的关键字是表的主键
- 叶子页（leaf page）包含了数据记录，非叶子节点只包含主键
    - "聚簇"：表示数据行和相邻的键值紧凑地存储在一起，因为索引和数据是保存在同一棵B树之中，从聚簇索引中获取数据通常比在非聚簇索引中要来得快
- InnoDB 的数据文件是依靠主键组织起来的，在 InnoDB 下创建表必须指定主键，如果没有显式指定，依然会对该表隐式地定义一个主键作为聚簇索引

### MyISAM 索引机制

![InnoDB 主索引](/img/in-post/mysiam-index.png)

- B+Tree 叶子节点中包含的是数据记录的地址（可以理解为"行号"）

### 两者差异对比

![差异对比](/img/in-post/innodb-mysiam-compare.png)

## 参考资料

- 《高性能 MySQL》
- [简单剖析B树（B-Tree）与Ｂ+树](https://blog.csdn.net/z_ryan/article/details/79685072)
- [MySQL和B树的那些事](https://www.cnblogs.com/xiaoxi/p/6868087.html)
- [【经典数据结构】B树与B+树](https://www.cnblogs.com/vincently/p/4526560.html)
- [mysql索引最左匹配原则的理解?](https://www.zhihu.com/question/36996520)

