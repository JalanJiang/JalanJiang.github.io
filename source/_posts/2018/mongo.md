---
title:       mongoDB 与 Laravel 中的 mongoDB
description: 芒果滴哔——
date:       2018-12-12 23:37:00
categories:
    - Web屠龙刀
tags:
    - php
    - mongodb
toc: true
---

## mongoDB 是个什么鬼

- 基于分布式文件存储的数据库
- 面向文档存储
- 旨在为 WEB 应用提供可扩展的高性能数据存储解决方案

### 基本概念

#### 数据库

- 单个实例可以容纳多个独立数据库
- 每个数据库有自己的集合和权限

显示所有 db 的列表：

```
> show dbs
```

指定连接数据库：

```
> use local
```

#### 文档

- 一组键值（key-value）对（BSON）
- 不需要相同的字段
- 相同的字段不需要相同的数据类型

```
{"site":"www.baidu.com"}
```

#### 集合

- 相当于 RDBMS 中的表格
- 没有固定的结构
- 通常一个集合内的数据有一定的关联性

```
{"site":"www.baidu.com"}
{"site":"www.google.com","name":"Google"}
```

## 在 Laravel 中的使用

> A MongoDB based Eloquent model and Query builder for Laravel (Moloquent) 

我们使用 `jenssegers/laravel-mongodb`，git 地址：https://jenssegers.com。

`README.md` 写的相当详细了。

### 查询 JSON 结构数据

document 结构：

```json
﻿{
    "_id" : ObjectId("5c11df1024215d00175e6b62"),
    "languages" : {
        "zh-Hans" : {
            "language_code" : "zh-Hans",
            "name" : "1"
        },
        "tw-Hant" : {
            "language_code" : "tw-Hant",
            "name" : "2"
        },
        "en" : {
            "language_code" : "en",
            "name" : "2"
        },
        "ja" : {
            "language_code" : "ja",
            "name" : null
        },
        "ko" : {
            "language_code" : "ko",
            "name" : null
        },
        "th" : {
            "language_code" : "th",
            "name" : null
        },
        "id" : {
            "language_code" : "id",
            "name" : null
        },
        "de" : {
            "language_code" : "de",
            "name" : null
        },
        "es" : {
            "language_code" : "es",
            "name" : null
        },
        "fr" : {
            "language_code" : "fr",
            "name" : null
        },
        "it" : {
            "language_code" : "it",
            "name" : null
        },
        "pt" : {
            "language_code" : "pt",
            "name" : null
        },
        "vi" : {
            "language_code" : "vi",
            "name" : null
        }
    }
}
```

查询语句：

```php
$db = new DB();
$db->where('languages.en.name', 'like', '%' . $name . '%');
```

## 参考资料

- [MongoDB 教程](http://www.runoob.com/mongodb/mongodb-tutorial.html)
- [PHP Homestead 虚拟化安装与 MongoDB 扩展安装](https://www.jianshu.com/p/9d9bd51d31b6)