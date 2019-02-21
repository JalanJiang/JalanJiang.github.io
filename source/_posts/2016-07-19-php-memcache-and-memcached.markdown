---
layout:     post
title:      PHP下的Memcache和Memcached
description:   加d还是不加d？
date:       2016-07-19 21:15:00
categories:
    - Web屠龙刀
tags:
    - PHP
---

# 前言

之前在校内做的一些项目都比较小，没有用到缓存的必要性。在春招时候的一些面试中，也被问到了关于`Redis`和`Memcache`的问题。实习中将接触到的项目不比以前，对于缓存的使用也应当尽早上手。

----------

# 正文

----------

## 什么是MemCache？

`memcache`是一套**分布式的高速缓存系统**，由`LiveJournal`的`Brad Fitzpatrick`开发，但目前被许多网站使用以提升网站的访问速度，尤其对于一些**大型的、需要频繁访问数据库的网站**访问速度提升效果十分显著。这是一套开放源代码软件，以`BSD license`授权发布。[\[百度百科\]](http://baike.baidu.com/link?url=xKRkQSLCr0gH2U3RbFmhnAc9IkHqr0etC0TBxqZznQg1LCqVaDwYNSbaXGusMxq5GL5PpEy3_ttWA-Y0SaeVEq)

其项目的主程序文件为：`memcached.exe`

----------

## 什么是MemCached？

`Memcached`是一个高性能的**分布式内存对象缓存系统**，用于动态`Web`应用以减轻数据库负载。它通过在内存中缓存数据和对象来减少读取数据库的次数，从而提高动态、数据库驱动网站的速度。`Memcached`基于一个存储键/值对的`hashmap`。其守护进程（`daemon`）是用C写的，但是客户端可以用任何语言来编写，并通过`memcached`协议与守护进程通信。[百度百科](http://baike.baidu.com/link?url=Jc7R_03L4oWzrZy3MAABnEuUKReWCsS3BrhgFSdDo5liJlcEGBoJ9A-lPVktnb1grDWuHkKgV_1zOEzgEl_xuq)

----------

## PHP下的Memcache和Memcached

`PECL`（The PHP Extension Community Library）下有两种扩展：

 1. Memcache
    - 完全在PHP框架内开发
    - 是原生版本
 2. Memcached
    - 建立在libmemcached基础上
    - 功能更齐全

----------

## Memcache扩展和Memcached扩展的区别

<table>
    <tr>
        <td>区别</td>
        <td>Memcache</td>
        <td>Memcached</td>
    </tr>
    <tr>
        <td>PHP手册</td>
        <td><a href="http://cn2.php.net/manual/en/book.memcache.php">《PHP手册：Memcache》</a></td>
        <td><a href="http://cn2.php.net/manual/en/book.memcached.php">《PHP手册：Memcached》</a></td>
    </tr>
    <tr>
        <td>开发</td>
        <td>原生版本，完全在PHP框架内开发</td>
        <td>建立在libmemcached基础上开发</td>
    </tr>
    <tr>
        <td>OO接口</td>
        <td>支持</td>
        <td>支持</td>
    </tr>
    <tr>
        <td>非OO接口</td>
        <td>支持</td>
        <td>不支持</td>
    </tr>
    <tr>
        <td>Binary Protocol</td>
        <td>不支持</td>
        <td>支持</td>
    </tr>
    <tr>
        <td>一致性hash算法</td>
        <td>支持</td>
        <td>支持</td>
    </tr>
    <tr>
        <td>\</td>
        <td>\</td>
        <td>1.flag不在操作的时候设置，有统一的setOption()；<br>2.实现了更多的 memcached 协议；<br>3.让人更放心</td>
    </tr>
</table>

----------

## 自己造的工具类轮子

- PHP下的Memcache：[memcache.php](https://github.com/JalanJiang/php_tools/blob/master/memcache.php)

----------

# 参考资料

 - [《PHP_Memcache函数详解》](http://www.cnblogs.com/xiaochaohuashengmi/archive/2011/04/19/2021605.html)
 - [《PHP手册：Memcache》](http://www.php.net/memcache)
 - [《小白谈memcache和memcached的区别》](http://www.cnblogs.com/scotoma/archive/2011/02/15/1955573.html)
 - [《memcache与memcached的区别》](http://www.cnblogs.com/52php/p/5666504.html)
 - [《用 Memcache 守护程序把数据缓存到内存中》](http://www.ibm.com/developerworks/cn/opensource/os-php-fastapps3/)
 - [《遍历memcache中已缓存的key》](http://www.cnblogs.com/ainiaa/archive/2011/03/11/1981108.html)

