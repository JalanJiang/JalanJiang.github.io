---
title:       处理 js 跨域请求造成的 session 丢失
description: 处理 js 跨域引发的问题
date:       2017-11-01 21:00:00
categories:
    - Web屠龙刀
tags:
    - PHP
    - JavaScript
---

## 问题描述

近期做了一个前后端分离的项目，我开发 API 供前端调用。

在开发过程中遇到了一个问题：用户通过登录接口登录成功后，在后台记录 session 值表明用户的登录状态，但该用户请求其他接口时无法获取到该 session 值，即用户始终处于非登录状态。

## 解决方法

问题本质上是一个跨域问题，在后续的请求过程中请求头里都不带有登录时返回的 cookies，因此无法判别用户的正常登录状态。

若要在跨域情况下带上 cookies 值必须在 ajax 请求头中加上：

```
{
	crossDomain: true, 
	xhrFields: {
		withCredentials: true
	}
}
```

在服务端中支持 cookies 跨域，我的服务端使用 PHP 编写：

```
header("Access-Control-Allow-Credentials: true");
```

因配置了 `allow-credentials`,无法将 `allow-origin` 设置为 `*`。若需要配置多个 `allow-origin`，可以参考[《PHP 设置多个 Access-Control-Allow-Origin》](http://jalan.space/2017/11/01/2017-11-02-set-php-access-control-allow-origin/)。

## 参考资料

- [跨域请求设置withCredentials](http://www.cnblogs.com/zhangcybb/p/6594991.html) 
- [跨域造成session丢失](https://segmentfault.com/q/1010000002905817)
- [ajax跨域获取session的问题](https://segmentfault.com/q/1010000005636483)