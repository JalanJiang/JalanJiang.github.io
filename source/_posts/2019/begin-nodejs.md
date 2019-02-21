---
title:       NodeJS 入门笔记
description: PHP 才不是最好的语言呢哼
date:       2019-01-16 23:33:00
categories:
    - Web屠龙刀
tags:
    - NodeJS
toc: true
---

打算用 NodeJS 来撸一个小应用，走起！

## 简介

Node.js 就是运行在服务端的 JavaScript。

- 基于 Chrome V8 引擎的 JavaScript 运行环境
- 事件驱动
- 非阻塞式 I/O 的模型

### 安装

macOS：

1. [官网](https://nodejs.org/en/download/) 下载包安装
2. `brew install node`

`node -v` 查看是否安装成功。

## Hello, world

创建一个 `hello.js`：

```javascript
console.log("Hello, world!");
```

在终端运行：

```
> node hello.js
```

## Restify

Restify 是一个基于 NodeJS 的 REST 应用框架，支持服务器端和客户端。Restify 比起 Express 更专注于 REST 服务。

### 安装

```
sudo npm install restify
```

### 创建服务

创建 `app.js`

```javascript
var restify = require('restify');

// 定义响应方法
function respond(req, res, next) {
    res.send('hello' + req.params.name);
}

// 创建服务
var server = restify.createServer();
server.get('/hello/:name', respond);
server.head('/hello/:name', respond);

// 监听 3900 接口
server.listen(3900, function(){
    console.log('%s listening at %s', server.name, server.url);
});
```

运行应用

```
▶ node app.js
restify listening at http://[::]:3900
```

访问接口

```
▶ curl 127.0.0.1:3900/hello/world
"hello world"
```

## jwt

Github：[jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)

### 踩坑

`sign` 方法报错：

```
Error: Expected "payload" to be a plain object.
```

原因：直接将 mongoDB 查询结果对象 mongoosejs Object 作为参数传递，mongoosejs Object 并非序列化参数，需要使用 `toJSON()` 进行转换。

```javascript
// 生成 token 并设置用户 token 缓存
function setToken(user) {
    // token 生成
    var accessToken = jwt.sign(user.toJSON(), config.secret, {
        expiresIn: 1200
    });
    return accessToken;
}
```

## 参考资料

- [restify构建REST服务](http://blog.fens.me/nodejs-restify/)
- [Node.js 教程](http://www.runoob.com/nodejs/nodejs-tutorial.html)
- [1](https://www.ibm.com/developerworks/cn/web/wa-lo-use-restify-develop-rest-api/index.html?ca=drs-&utm_source=tuicool&utm_medium=referral)