---
title:      PHP环境下处理并发访问问题之——Redis锁
description: 加锁的要领
date:       2018-03-19 17:00:00
categories:
    - Web屠龙刀
tags:
    - PHP
toc: true
---

## 并发访问场景可能产生的问题

对于某些数据而言，用户的并发访问将导致数据出错。例如银行账户的金额。

假设现在某张银行卡账户余额为 1000RMB，此时用户A请求消费 500RMB：

```
银行余额 = 1000RMB - 500RMB = 500RMB
```

但与此同时，用户B也发起了一个消费请求，请求消费 300RMB，在用户A的消费请求处理前，B读到的账户余额仍是 1000RMB。因此在处理B的消费请求后：

```
账户余额 = 1000RMB - 300RMB = 700RMB
```

原本在两次消费过后，银行账户余额应为 `1000RMB - 500RMB - 300RMB = 200RMB`，但在用户B请求过后账户却还有 `700RMB`。

因此，对于此类会影响数据准确性的并发请求，应当要进行加锁限制。

## 为什么使用 Redis 构造锁

PHP 构造锁的方法有很多，有文件锁、SQL锁、Redis/Memcache锁。

但由于采用分布式设计，业务代码同时在多台服务器上运行，无法使用文件实现锁的功能。又考虑到 SQL 锁的资源消耗，最终选择使用 Redis 来构造锁。

## 构造锁时需要注意的问题

1. 预防处理持有锁在执行操作的时候进程奔溃，导致死锁，其他进程一直得不到此锁（加锁后未解锁）
2. 持有锁进程因为操作时间长而导致锁自动释放，但本身进程并不知道，最后错误的释放其他进程的锁（误删他锁）
3. 一个进程锁过期后，其他多个进程同时尝试获取锁，并且都成功获得锁

## 实现思路

1. 加锁 —— 使用 `setnx()` 操作
    - 加锁时同时设置过期时间，防止死锁
    - 加锁时同时设置锁标志作为 `value` 值，防止误删他锁
2. 解锁 —— 使用 `del()` 操作
    - 判断锁标志再执行解锁操作，防止误删他锁

## Talk is cheap

最后 Show 一下 Code。

```
class RedisLock extends Redis
{
    /**
     * Redis锁前缀
     */
    const PREFIX = 'TEST_LOCK';

    /**
     * @var \Redis
     */
    private $_redis;

    /**
     * 构造函数
     * RedisLock constructor.
     */
    public function __construct()
    {
        $this->_redis = self::getConnection();
    }

    /**
     * 加锁
     * @param $lockName
     * @param int $timeout
     * @return bool|string
     */
    public function lock($lockName, $timeout = 5)
    {
        $lockName = self::getKey($lockName);
        $identifier = uniqid(); //获取锁唯一标示符
        $timeout    = ceil($timeout);
        $end = time() + $timeout;

        while (time() < $end) { //循环获取锁
            if ($this->_redis->setnx($lockName, $identifier)) { //查看localName是否被上锁
                $this->_redis->expire($lockName, $timeout); //设置锁的过期时间，防止死锁
                return $identifier; //返回唯一标志符
            } elseif ($this->_redis->ttl($lockName) === -1) { //返回lockName剩余生存时间
                $this->_redis->expire($lockName, $timeout);
            }
            usleep(0.001);
        }

        return false;
    }

    /**
     * 释放锁
     * @param $lockName
     * @param $identifier
     * @return bool
     */
    public function unlock($lockName, $identifier)
    {
        $lockName = self::getKey($lockName);
        if ($this->_redis->get($lockName) == $identifier) { //判断是否被修改
            $this->_redis->multi();
            $this->_redis->del($lockName); //锁没有被修改，释放自己的锁
            $this->_redis->exec();
            return true;
        } else {
            return false; //锁被修改，不能释放他人锁
        }
    }
}
```

## 参考资料

- [《php结合redis实现高并发下的抢购、秒杀功能》](http://blog.csdn.net/nuli888/article/details/51865401)
- [《Redis构建分布式锁》](http://www.jb51.net/article/109704.htm)
- [《PHP并发加锁》](http://blog.csdn.net/clevercode/article/details/52493568)
- [分布式锁看这篇就够了](http://www.54tianzhisheng.cn/2018/04/24/Distributed_lock/)