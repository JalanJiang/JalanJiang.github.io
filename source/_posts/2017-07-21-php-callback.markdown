---
title:      PHP中的回调、匿名函数与闭包
description: 深入PHP面向对象模式高级特性
date:       2017-07-21 16:17:00
categories:
    - Web屠龙刀
tags:
    - PHP
---

# 前言

最近在看《深入 PHP 面向对象模式与实践》，看到了不常用到的回调函数知识点，不是特别熟悉，在此做一次学习笔记。

# 正文

## 名词解释

- 回调函数：把函数作为参数传入进另一个函数中使用
- 匿名函数：没有一个确定函数名的函数
- 闭包：即 PHP 中的闭包，匿名函数在 PHP 中也叫作闭包函数

## 举第1个栗子

```
class Product
{
    public $name;
    public $price;

    function __construct($name, $price)
    {
        $this->name = $name;
        $this->price = $price;
    }
}

class ProcessSale
{
    private $callbacks;

    function registerCallback($callback)
    {
        if(!is_callable($callback)) {
            throw new Exception("callback not callable");
        }
        $this->callbacks[] = $callback;
    }

    function sale($product)
    {
        print "($product->name):pricessing. \n";
        foreach($this->callbacks as $callback) {
            call_user_func($callback, $product);
        }
    }
}

$logger = function($product) {
    print "logging(($product->name))\n";
};

$processor = new ProcessSale();
$processor->registerCallback($logger);

$processor->sale(new Product("shoes", 6));
$processor->sale(new Product("coffee", 6));
```

- 使用内联方式使用 function 关键字创造匿名函数
- 传入的函数被 `call_user_func()` 调用

运行结果：

```
(shoes):pricessing.
logging((shoes))

(coffee):pricessing.
logging((coffee))
```

## 举第2个栗子

传入非匿名函数作为回调。

```
class Mailer
{
    function doMail($product)
    {
        print " mailing ({$product->name}) \n";
    }
}

$processor = new ProcessSale();
$processor->registerCallback(array(new Mailer(), "doMail"));

$processor->sale(new Product("shoes", 6));
$processor->sale(new Product("coffee", 6));
```

- 传递一个数组：第一个元素是 `$mailer` 对象，第二个元素是字符串（与想要调用的方法名称匹配）
- `is_callable()` 能检测这类数组

运行结果：

```
(shoes):pricessing.
mailing (shoes)

(coffee):pricessing.
mailing (coffee)
```

## 举第3个栗子

让方法返回匿名函数。

```
class Totalizer
{
    static function warnAccount()
    {
        return function($product) {
            if($product->price > 5) {
                print "reached high price: ($product->price) \n";
            }
        };
    }
}

$processor = new ProcessSale();
$processor->registerCallback(array(Totalizer::warnAccount()));

$processor->sale(new Product("shoes", 6));
$processor->sale(new Product("coffee", 6));
```

## 举第4个栗子

使用 use 子句，让匿名函数追踪来自其父作用域的变量。

```
class Totalizer
{
    static function warnAccount($amt)
    {
        $count = 0;
        return function($product) use ($amt, &$count) {
            $count += $product->price;
            print "count: $count";
            if($count > $amt) {
                print "high price reached: ($count)";
            }
        };
    }
}

$processor = new ProcessSale();
$processor->registerCallback(Totalizer::warnAccount(8));

$processor->sale(new Product("shoes", 6));
print "\n";
$processor->sale(new Product("coffee", 6));
```

- `$amt`是`warnAmount()`的实参
- `&$count`：该变量可以用匿名函数中的引用而不是值来访问
- 回调跟踪了两次调用之间的`$count`
- 匿名函数引用了它在父作用域中声明的变量（匿名函数还记得它被创建时所在的作用域）

运行结果：

```
(shoes):pricessing.
count: 6

(coffee):pricessing.
count: 12
high price reached: (12)
```

# 参考资料

《[PHP中的回调函数和匿名函数][1]》

[1]: http://www.cnblogs.com/zhenbianshu/p/6063340.html
