---
title:      两个字符串的“速配率”如何计算
description: 计算你和 Ta 的速配率
date:       2018-03-02 17:00:00
categories:
    - Web屠龙刀
tags:
    - PHP
toc: true
---

## 需求描述

> 给出两个人的名字，计算出他们的默契度。

有很多类似这样的“预测类”游戏。我遇到的需求是计算两个名字的“速配率”。

所谓“速配率”就是一个百分数，需求翻译一下就是：

- 输入：两个字符串
- 输出：一个百分数
- 输入两个相同的字符串，每次都需要输出相同的百分数（百分数并非随机给出，而是只随字符串变动的特定值）

## 解决思路

### 字符串到数字的转换

“将两个字符串变为一个百分数”，这样与数字相关的“字符串运算”让人摸不着头脑，但先把字符串转为数字再进行下一步就容易多了。

在这里我用了一个简单的 hash ：

```
function hashStringToInteger($string)
{
    return base_convert(md5($string), 16, 10);
}
```

将字符串通过 `md5()` 加密后再使用 `base_convert` 将 16 进制的数字转为十进制。

### 归一法

两个字符串已经转为两个十进制数了，现在要将两个数字变为百分数。百分数其实就是一个 0～1 之间的小数，可以使用归一法计算得出。

```
// 为避免两个相同字符串计算时总产生相同的结果
if ($number1 == $number2) {
    $resultInteger = ($number1 + $number2) / 2;
} else {
    $resultInteger = abs($number1 - $number2);
}

$matchingDegree = round(static::SEED / ( static::SEED + $resultInteger), 2);
```

`SEED` 的值可以根据所要结果的区间来取。

## 参考资料

- [《字符串匹配算法的分析》](https://www.cnblogs.com/adinosaur/p/6002978.html)







