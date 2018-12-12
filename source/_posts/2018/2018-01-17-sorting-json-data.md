---
title:      json_encode 无序问题
description: 将 PHP 数组传递给 JavaScript 后如何保持键的顺序
date:       2018-01-17 15:58:00
categories:
    - Web屠龙刀
tags:
    - PHP
---

## 问题描述

最近在项目中碰到一个问题：将 PHP 数组按某字段排列后使用 `json_encode` 对其进行序列化，再写入 redis 后发现 json 数据并未按照 PHP 数组的顺序排列。

于是查了下资料才发现 —— **json是无序的**。

> JavaScript 或者说 json 标准中的 Object 是不保证顺序的，json 库任意改变 key 都是符合标准的行为，任何特定实现中对 key 顺序的处理（保留／排序／乱序）都不应当被依赖。

## 解决方法

想要在 JavaScript 中保持 PHP 数组的键值顺序，就要将 PHP 键值对包装成数组的形式：

```
// original array:
array(
    3 => 'b',
    0 => 'a'
)

// must be converted to:
array(
    array(3, 'b'),
    array(0, 'a')
)
```

对于 JavaScript 来说，`array(0 => 'a', 3 => 'b')` 与 `array(3 => 'b', 0 => 'a')` 是无区别的，所以我们将他们分别改写成：

```
array(array(0, 'a'), array(3, 'b'))
```

```
array(array(3, 'b'), array(0, 'a'))
```

## 参考资料

- [json_encode not preserving order](https://stackoverflow.com/questions/20912492/json-encode-not-preserving-order)
- [php关联数组排序后，用json_encode输出给前端，为什么顺序会发生变化？](https://segmentfault.com/q/1010000007450464)


