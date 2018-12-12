---
title:      Peewee 使用手册翻译与个人解读
description: 一个简单、轻巧的 Python ORM
date:       2018-01-20 15:58:00
categories:
    - Web屠龙刀
tags:
    - Python
toc: true
---

![](/img/in-post/python-peewee/peewee-logo.png)

**持续更新中……**

# Peewee 简介

Peewee 是一个简单、轻巧的 Python [ORM](https://zh.wikipedia.org/wiki/%E5%AF%B9%E8%B1%A1%E5%85%B3%E7%B3%BB%E6%98%A0%E5%B0%84)。它概念简单富有表现力（expressive），这一特性使它简单易学、易于使用。

Peewee具有以下特性：

- 轻巧且富有表现力的 [ORM](https://zh.wikipedia.org/wiki/%E5%AF%B9%E8%B1%A1%E5%85%B3%E7%B3%BB%E6%98%A0%E5%B0%84)
- 使用 Python 编写，支持 Python2.6+ 和 Python3.2+ 版本
- 支持数据库包括：sqlite，mysql，postgresql
- 包含许多扩展
    - [postgres hstore/json/arrays](http://docs.peewee-orm.com/en/latest/peewee/playhouse.html#postgres-ext)
    - [sqlite full-text-search](http://docs.peewee-orm.com/en/latest/peewee/playhouse.html#sqlite-ext)
    - [schema migrations](http://docs.peewee-orm.com/en/latest/peewee/playhouse.html#migrate)

Peewee 源码放置在 [Github](https://github.com/coleifer/peewee)。

----

# 安装与测试

## 借助 git 完成安装

Peewee 项目的 git 地址为：https://github.com/coleifer/peewee ，我们可以使用 git 完成 Peewee 的安装。

```
git clone https://github.com/coleifer/peewee.git
cd peewee
python setup.py install
```

如果你想在 git 检出（checkout）中建立 SQLite 扩展，可以执行如下命令：

```
# Build the sqlite extension and place the shared library alongside the other modules.
python setup.py build_sqlite_ext -i
```

> **在一些系统中，你可能需要使用 `sudo python setup.py install` 来安装 peewee。**

### 个人解读

也可以使用 pip 完成安装：

```
pip install peewee
```

## 测试

你可以通过执行测试代码来验证 peewee 是否安装成功。

```
python setup.py test

# Or use the test runner:
python runtests.py
```

你可以通过执行 `runtest.py` 脚本来测试特殊的特性或数据库驱动。但必须使用 SQLite ，且未执行 `playhouse` 扩展。查看可用的测试程序选项：

```
python runtests.py --help
```

## 可选相关性

----

# 快速开始

这篇文档简短、高层次的概述了 Peewee 的主要特点。涵盖：

- 定义模型
- 存储数据
- 检索数据

## 定义模型（Model Definition）

模型（Model classed）、字段（fields）和模型实例（model instances）映射到数据库的概念：

Thing | Corresponds to…
------|----------------
Model class | Database table
Field instance | Column on a table
Model instance | Row in a database table

当我们开始一个项目时，我们最好从数据模型着手，先定义一个或多个模型类。

```
from peewee import *

db = SqliteDatabase('people.db')

class Person(Model):
    name = CharField()
    birthday = DateField()
    is_relative = BooleanField()

    class Meta:
        database = db # This model uses the "people.db" database.
```

为了存储各种类型的数据，数据库拥有许多的字段类型。Peewee 能够处理 Python 数据类型与数据库数据类型之间的转换，所以当你在代码中使用 Python 数据类型时不必有任何的担心。

当我们使用[外键（Foreign key）](https://en.wikipedia.org/wiki/Foreign_key)建立模型之间的关系时，事情就变得有趣了。

我们可以使用 Peewee 轻松完成这一操作：

```
class Pet(Model):
    owner = ForeignKeyField(Person, related_name='pets')
    name = CharField()
    animal_type = CharField()

    class Meta:
        database = db # this model uses the "people.db" database
```

现在我们拥有了自己的模型，让我们连接到数据库。虽然没有必要显式地打开连接，但这是一个很好的做法，因为它会立即显示数据库连接的任何错误，而不是在执行第一个查询之后再显示错误信息。完成操作后关闭连接也是很好的做法——例如，Web应用程序在接收请求时打开连接，并在发送响应时关闭连接。

```
>>> db.connect()
```

首先，我们将在数据库中创建存储数据的表。这将创建具有适当列、索引、序列和外键约束的表：

```
>>> db.create_tables([Person, Pet])
```

### 个人解读

#### 定义模型

```
class Meta:
        database = db # this model uses the "people.db" database
```

定义模型时每一个 Model 后都要加入 `class Meta` 略显繁琐了。可以按如下方式进行定义。

```
class BaseModel(Model):
    class Meta:
        database = db

class Person(BaseModel):
    name = CharField()
    birthday = DateField()
    is_relative = BooleanField()

class Pet(BaseModel):
    owner = ForeignKeyField(Person, related_name='pets')
    name = CharField()
    animal_type = CharField()
```

#### 外键关联

我们在文档中看到 Person、Pet 两张数据表的模型定义，实际创建后这两张数据表的结构是这样的：

**Peron**

Column | Datatype | PrimaryKey |
------ | -------- | ---------- |
id | INT(11) | true（自增）
name | VARCHAR(255) | false
birthday | DATE | false
is_relative | TINYINT(1) | false

**Pet**

Column | Datatype | PrimaryKey |
------ | -------- | ---------- |
id | INT(11) | true（自增）
owner_id | INT(11) | false（外键）
name | VARCHAR(255) | false
animal_type | VARCHAR(255) | false

观察到，Pet 模型定义中 `owner = ForeignKeyField(Person, related_name='pets')` 一句所生成的字段名称为 `owner_id` 而非 `owner`。

之前在这里踩过坑，手动建表的外键字段命名为 `region_id`，再使用 Peewee 模型定义中直接使用了 `region_id`，从而导致一系列操作的失败。**当我们使用 `ForeignKeyField` 建立模型间的外键关联时，会在字段后补上 `_id`。**

----

# 参考资料

- [Peewee 官方手册](http://docs.peewee-orm.com/en/latest/index.html)












