---
title:       mysqldump 与 1044 问题
description: 又是权限的锅
date:       2018-07-10 16:18:00
categories:
    - Web屠龙刀
tags:
    - MySQL
toc: true
---

## mysqldump 简单用法

mysqldump常用于MySQL数据库逻辑备份。

### 整库备份

```sql
mysqldump -h host -P port -u root -p  --all-databases > [dump file]
```

### 指定数据库备份

```sql
mysqldump -h host -P port -u root -p [database name] > [dump file]
```

### 仅备份表结构

```sql
mysqldump -h host -P port -u root -p --no-data --databases [database name1] [database name2] [database name3] > [dump file]
```

## 1044错误

错误提示如下：

```sql
mysqldump: Got error: 1044: Access denied for user 'test'@'%' to database 'test_db' when using LOCK TABLES
```

产生错误原因：备份数据库时使用的用户没有 `locak table` 权限。

`mysqldump` 在转储表之前会发出锁表命令，由此来保证备份吼的数据一致性。

### 解决方法1

换一个有 `locak table` 权限的用户呗。

### 解决方法2

使用 `--skip-lock-tables` 跳过锁表操作。

```sql
mysqldump -h host -P port -u user -p [database name] --skip-lock-tables > [dump file]
```

## 参考资料

- [Run MySQLDump without Locking Tables](https://stackoverflow.com/questions/104612/run-mysqldump-without-locking-tables)


