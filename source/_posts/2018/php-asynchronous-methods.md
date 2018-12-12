---
title:       PHP 异步处理方法
description: 先返回结果给用户再去处理长长的任务吧
date:       2018-06-19 13:51:00
categories:
    - Web屠龙刀
tags:
    - PHP
toc: true
---

## 主动断开与客户端的连接

方法缺点：

- PHP FastCGI 进程数有限，正在处理异步操作的php-cgi进程，无法处理新请求
- 并发访问量较大，php-cgi进程数用满，新访问请求，将没有php-cgi去处理。Nginx服务器会出现： 502 Bad Gateway

### fastCGI

在使用 fastCGI 和 PHP_FPM 时直接使用 `fastcgi_finish_request()` 方法。

```
// your code here

fastcgi_finish_request();

// run other process without the client attached.
```

### php_mode

Apache 一般使用的是这种模式。

```php
ob_end_clean();
header("Connection: close");
ob_start();

// your code here

$size = ob_get_length();
header("Content-Length: ". $size);
// send info immediately and close connection
ob_end_flush();
flush();

// run other process without the client attached.
```

## 消息队列

1. 把要延迟处理的数据放入消息队列中
2. 返回结果给客户端
3. 使用定时任务拿取消息队列中的数据进行处理

### 概念

- 拥有**队列结构**的中间件
- 消息放入不需要立即处理
- 会有另一个程序来**按顺序**处理这些数据

### 缺点

- 并发量大
- 耗时长

![](/img/in-post/php-asynchronous-methods/queue.png)

### 应用场景

- 数据冗余
- 系统解耦
    - 入队系统与出队系统分隔开，互不干扰
- 流量削峰
- 异步通信
- 扩展性
    - 入队列的信息可以供给其他多个业务使用
- 排序保证

### 队列实现方法

1. 数据库（例如 MySQL）
    - 可靠性高、实现容易
    - 速度慢
2. 缓存（例如 Redis）
    - 速度快
    - 单个消息过大时效率低
3. 消息系统（例如 rabbitMq）
    - 专业性强、可靠
    - 学习成本高
    
### 消息处理触发机制

1. 死循环
    - 易实现，但难维护
2. 定时任务
    - 可均分压力，有处理上限
    - 需要注意时间间隔，不要等上一个任务没有完成，下一个任务就开始了
3. 守护进程（类似 php-fpm / php-cg）

## 参考资料

- [PHP 在 Nginx 下主动断开连接 Connection Close 与 ignore_user_abort 后台运行](https://blog.csdn.net/zhouzme/article/details/46886811)
- [close a connection early](https://stackoverflow.com/questions/138374/close-a-connection-early)
- [php主动断开与浏览器的连接Connection: Close](https://www.chinaphpcoder.com/php/close-connection)
- [PHP如何在请求完毕后继续处理耗时任务](https://blog.csdn.net/udefined/article/details/23676447)
- [PHP mod_fcgi with fastcgi_finish_request()](https://stackoverflow.com/questions/12982964/php-mod-fcgi-with-fastcgi-finish-request)
- [PHP消息队列实现及应用](https://www.cnblogs.com/dump/p/8243868.html)