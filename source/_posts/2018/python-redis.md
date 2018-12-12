---
title:       Python 操作 Redis
description: import redis
date:       2018-11-07 00:45:00
categories:
    - Web屠龙刀
tags:
    - python
toc: true
---

## 安装与引入

redis 安装：

```
pip install redis
```

引入：

```
import redis
```

## 连接池

redis-py 使用 connection pool 来管理对一个 redis server 的所有连接，避免每次建立、释放连接的开销。默认，每个 Redis 实例都会维护一个自己的连接池。

可以直接建立一个连接池，然后作为参数 `r`，这样就可以实现多个 Redis 实例共享一个连接池。

```python
pool = redis.ConnectionPool(host=self.host, port=self.port, db=0)
r = redis.StrictRedis(connection_pool=pool)
```

## 基本命令

### 获取所有 key

```python
r.keys()
```

### get

```python
value = self.r.get(key)
```

## Demo

```python
#!/usr/bin/python
import redis

class SendRedisData(object):

    def __init__(self, num, step):
        self.host = "xxx.xxx.xxx.xxx"
        self.port = "6379"
        self.r = self.connect_redis()

    def connect_redis(self):
        pool = redis.ConnectionPool(host=self.host, port=self.port, db=0)
        r = redis.StrictRedis(connection_pool=pool)
        return r

    def get_all_keys(self):
        keys = self.r.keys()
        for key in keys:
            print(self.get_value(key)) #获取每个 key 对应的 value 值
        
    def get_value(self, key):
        return self.r.get(key)


if __name__ == '__main__':
    s = SendRedisData(num, step)
    s.get_all_keys()
```
