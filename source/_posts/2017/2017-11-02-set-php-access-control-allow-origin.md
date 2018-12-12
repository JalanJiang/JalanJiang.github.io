---
title:       PHP 设置多个 Access-Control-Allow-Origin
description: 如何允许指定、多个域名的跨域请求
date:       2017-11-01 21:00:00
categories:
    - Web屠龙刀
tags:
    - PHP
---

### 允许所有跨域请求

在 PHP 跨域设置中，我们会使用 `header("Access-Control-Allow-Origin:*")` 放行所有域名的跨域请求。

### 允许单一域名跨域

允许所有域名的跨域请求往往是不安全的，我们有时需要仅允许某个域名的跨域请求。单一域名可以这样设置：

```
header("Access-Control-Allow-Origin:http://127.0.0.1");
```

### 允许多个指定域名跨域

那么设置多个指定的 `Access-Control-Allow-Origin` 该如何 Code 呢？

```
$origin = isset($_SERVER['HTTP_ORIGIN'])? $_SERVER['HTTP_ORIGIN'] : '';

$allowOrigin = array(
	'http://xxx.xxx1.com',
	'http://xxx.xxx2.com',
	'http://xxx.xxx3.com',
	'http://xxx.xxx4.com'
);

if (in_array($origin, $allowOrigin)) {
	header("Access-Control-Allow-Origin:".$origin);
}
```

我们先通过 `$_SERVER['HTTP_ORIGIN']` 获取请求的 Origin 信息，然后判断该请求来源域名是否在我们允许跨域的域名列表中，若该域名存在列表中，则设置：

```
header("Access-Control-Allow-Origin:".$origin);
```


