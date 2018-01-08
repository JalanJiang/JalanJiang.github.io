---
title:       PHP 中使用 Redis 保存 Session 姿势与错误排查
description: PHP 分布式中使用 Redis 实现 Session
date:       2017-11-29 10:00:00
categories:
    - Web屠龙刀
tags:
    - PHP
---

如果项目同时运行在 n 台服务器上，我们就无法使用常规的 Session 记录方式来记录用户的会话了。否则用户在服务器1上完成登录，我们下次在服务器2上访问其他模块就无法获取到该用户的信息。

这时，我们就需要用 Redis 来保存 Session。

## 保存姿势

### 前期准备

- 安装 redis
- PHP 安装 redis 扩展

测试 PHP 是否调通 redis 方法：

```
<?php
    $redis = new Redis();
    $redis->connect('127.0.0.1', 6379);
    $count = $redis->exists('count') ? $redis->get('count') : 1;
    echo $count;
    $redis->set('count', ++$count);
```

刷新页面，若看到数字不停增加，则说明 redis 环境正常。

### 配置 PHP

#### 方法1：修改 php.ini

修改 php.ini 文件：

```
session.save_handler = redis
session.save_path = "tcp://127.0.0.1:6379"
```

若 redis 有密钥，加上 auth 配置：

```
session.save_path = "tcp://127.0.0.1:6379?auth=password"
```

修改后重启服务。

#### 方法2：修改 php-fpm.conf

php-fpm 的配置文件 `/etc/php-fpm.conf` 或 `/etc/php-fpm.d/*.conf`中，也有 session 的配置项。

此处 session 配置的优先级要高于 php.ini，会覆盖 php.ini 中的配置。

```
php_value[session.save_handler] = redis
php_value[session.save_path] = "tcp://127.0.0.1:6379"
```

**如果你需要使用 php.ini 中的配置，则需要将这两行用 `;` 进行注释。**

配置后需重启 php-fpm。


#### 方法3：PHP 代码配置

当然，我们也可以选择不修改配置文件，直接在 PHP 代码中做配置。

```
ini_set('session.save_handler', 'redis');
ini_set('session.save_path', 'tcp://127.0.0.1:6379');
```

选择上述的任一方法进行配置后，我们再使用 `$_SESSION` 就会将数据存储在 redis 中。

## 相关错误排查

### 1. Connection Closed

redis 连接超时报错。可能有以下几点原因：

1. redis 本身问题

超时连接不上有可能是 redis 本身的问题，可以尝试使用 redis-cli 命令对 redis 进行连接测试。

```
redis-cli -h 127.0.0.1 -p 6379 -a "password"
```

连接后使用 PING 命令检测 redis 实例是否存活，若存活则会回复 PONG。

2. 超时问题

若 redis 连接无误那多半是超时问题，可以将 timeout 的配置稍作延长。

### 2. Fail Auth

redis 密钥错误报错。

这里遇到了一个坑，`tcp://127.0.0.1:6379?auth=password` 配置中若 `password` 含有特殊字符 `&`，密钥将被截断，无法进行正常匹配。

## 参考资料

- [Redis 保存 PHP Session方法](https://www.awaimai.com/1871.html)
- [redis cli命令](https://www.cnblogs.com/kongzhongqijing/p/6867960.html)

