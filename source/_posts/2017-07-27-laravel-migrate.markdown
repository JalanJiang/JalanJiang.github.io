---
title:       在诗意框架中使用Migration
description: 跪倒在南方盛夏的艳阳下。
date:       2017-07-26 20:17:00
categories:
    - Web屠龙刀
tags:
    - Laravel
---

在之前的项目中我都是手动创建数据表的，但在诗意框架 Laravel 里，我们能使用 Migration 更优雅地操作数据库。

## 创建 migration 文件

使用 Migration 的第一步是在 Laravel 项目中创建一个 migration 文件。执行如下命令：

```
php artisan make:migration create_student_table --create=student
```

执行成功后会得到一个位于 Laravel 项目 `/database/migrations/` 文件夹下的 php 文件，文件内容如下：

```
<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class MakeStudentTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('student', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('student');
    }
}

```

## 文件修改

生成的 migration 文件中包含两个方法：`up()` 和 `down()`。

当用户执行 `php artisan migrate` 时会执行 `up()` 方法，该方法会创建一个符合方法描述的数据表。

当用户执行 `php artisan migrate:rollback` 时会执行 `down()` 方法，将会对数据库的操作进行回滚。

在此我们修改一下刚生成的 migration 文件，为 `up()` 方法新增几个字段：

```
public function up()
    {
        Schema::create('student', function (Blueprint $table) {
            // 自增id
            $table->increments('id');
            $table->string('name');
            $table->integer('age');
            $table->timestamps();
        });
    }
```

- `increments()` 创建自增主键
- `string()` 创建字符串字段
- `integer()` 创建整型字段
- `timestamps` 自动创建 `create_at` 和 `update_at` 两个字段

## 创建数据表

执行 `php artisan migrate` 命令，student 数据表就创建成功了。

![student表结构](/img/in-post/laravel/student_table.png)

## Migration 的优势

- 便于团队协同开发，直接使用 `php artisan migrate` 就可以得出数据表
- 可以使用 roolback 纠正操作失误

## 参考资料

- 《[Laravel 5系列教程四：数据库和Eloquent][1]》

[1]: https://segmentfault.com/a/1190000003106128#articleHeader2

