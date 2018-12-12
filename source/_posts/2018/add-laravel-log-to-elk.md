---
title: 格式化 Laravel 与 Apache 日志
description: 为了 ELK ！
date:       2018-09-27 22:14:00
categories:
    - Web屠龙刀
tags:
    - MySQL
toc: true
---

为了方便 ELK 日志收集，需要将访问日志与业务日志转化为 JSON 格式。

因业务使用 Apache 与 Laravel 框架，部署环境为 Docker 容器，现说明如何格式化二者日志并输出到标准输出流中。

## 什么是 ELK

ELK 其实并不是一款软件，而是一整套解决方案，是三个软件产品的首字母缩写：

- Elasticsearch：实时的分布式搜索和分析引擎
- Logstash：具有实时渠道能力的数据收集引擎
- Kibana：基于 Apache 开源协议，为 Elasticsearch 提供分析和可视化的 Web 平台

这三款软件都是开源软件，通常是配合使用，而且又先后归于 Elastic.co 公司名下，故被简称为 ELK 协议栈。

## Apache

在配置中使用 `LogFormat` 定义日志格式，并在格式末尾为该格式命名：

```
LogFormat "{ \"@timestamp\":\"%{%Y-%m-%dT%H:%M:%S.000000Z}t\", \"request_time\":\"%T\", \"remote_addr\":\"%h\", \"local_addr\":\"%a\", \"host\":\"%V\", \"request\":\"%U\", \"query\":\"%q\", \"method\":\"%m\", \"status\":\"%>s\", \"user-agent\":\"%{User-agent}i\", \"referer\":\"%{Referer}i\", \"tag\":\"apache'\" }" apachejson
```

将刚配置的日志格式应用于 access.log：

```
CustomLog ${APACHE_LOG_DIR}/access.log apachejson
```

Apache `access.log` 参数具体含义见：[Apache 官方文档](https://httpd.apache.org/docs/2.4/logs.html)。

## Laravel

Laravel 框架使用的是强大的日志系统 `monolog`。

### monolog 三大概念

#### handler 

`handler` 是日志处理器。

- 存放 `handler` 的数据结构是一个栈
- 一个日志实例可以有多个 `handler`
- 通过 Logger 实例的 `pushHandler` 方法压入一个 `handler`
- 如果你设置了多个 `handler`，当你新增一条日志的时候，他会从栈顶开始往下传播，关心这个级别日志的 `handler` 将会处理这条日志
- 所有的 `handler` 都会继承 `AbstractProcessingHandler` 这个抽象类

#### formatter 

`formatter` 用于设置日志格式。

每个 `handler` 可以单独设置记录的日志格式，`AbstractHandler` 抽象类中有一个 `setFormatter` 方法，该参数接受一个 `FormatterInterface` 类型的参数.

#### processor 

`processor` 又称日志加工程序，用于给日志添加额外信息。

### 手把手设置日志

在 `/bootstrap/app.php` 中创建一个 `handle`，并为他设置 `formatter`：

```php
$app->configureMonologUsing(function ($monolog) {
    $logLevel = \Monolog\Logger::DEBUG;
    $logStreamHandler = new \Monolog\Handler\StreamHandler('php://stdout', $logLevel); //该 handler 输出数据到标准输出流 stdout 中
    $formatter = new \App\Components\Log\JsonFormatter();
    $logStreamHandler->setFormatter($formatter);

    $monolog->pushHandler($logStreamHandler);
});
```

`JsonFormatter.php` 如下：

```php
<?php

namespace App\Components\Log;

use Monolog\Formatter\JsonFormatter as BaseJsonFormatter;
use Monolog\Logger;

class JsonFormatter extends BaseJsonFormatter
{
    public function format(array $record)
    {
        $record = $this->normalize($record);
        
        /*
         * 改变格式，自由发挥
         */

        $json = $this->toJson($record, true) . ($this->appendNewline ? "\n" : '');

        return $json;
    }
}
```

## 参考资料

- [集中式日志系统 ELK 协议栈详解](https://www.ibm.com/developerworks/cn/opensource/os-cn-elk/index.html)
- [[Request] Docker-friendly logging](https://github.com/laravel/ideas/issues/126)
- [Apache Module mod_log_config](https://httpd.apache.org/docs/2.4/mod/mod_log_config.html#formats)

