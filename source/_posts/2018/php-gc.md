---
title:       PHP 垃圾回收机制
description: 传说中的……GC？
date:       2018-12-23 22:38:00
categories:
    - Web屠龙刀
tags:
    - PHP
toc: true
---

## PHP 变量与内存对象

垃圾回收是对**变量**及所关联**内存对象**的操作。

PHP 变量分为两类：

- 标量类型：布尔型、整型、浮点型、字符串
- 复杂类型：数组、对象、资源
- NULL（特殊，不划分为任何类型）

所有上述类型均用 `zval` 的结构表示。

### 源码 Zend/zend.h

5 个字段存储 8 种类型。

#### _zvalue_value

用于表示 PHP 中所有变量的值。

```c
typedef union _zvalue_value {  
    long lval;                  /* long value */ 
    double dval;                /* double value */ 
    struct {  
        char *val;  
        int len;  
    } str;  
    HashTable *ht;              /* hash table value */ 
    zend_object_value obj;  
} zvalue_value;  
```

- lval：存储布尔型、整型、资源
- dval：存储浮点型
- str：存储字符串
- ht：存储数组（PHP 中的数组是哈希表）
- obj：存储对象
- 所有字段设置为0：NULL

#### _zval_struct

由 `_zval_struct` 中的 `type` 决定 `_zvalue_value` 究竟是哪种类型。

```c
struct _zval_struct {  
    /* Variable information */ 
    zvalue_value value;       
    /* value */ 
    zend_uint refcount__gc;  
    zend_uchar type;    /* active type */ 
    zend_uchar is_ref__gc;  
}; 
```

- `refcount__gc` 表示当前有几个变量在引用此 `zval`
- `is_ref__gc` 表示当前 `zval` 是否被 按引用 引用

## PHP5.2

PHP5.2 中的垃圾回收算法是：Reference Counting，即"引用计数"。

### 算法原理

- 为每个内存对象分配一个计数器
- 当一个内存对象建立时计数器初始化为 1
- 以后每有一个新变量引用此内存对象，则计数器加1
- 每当减少一个引用此内存对象的变量则计数器减 1
- 当垃圾回收机制运作的时候，将所有计数器为0的内存对象销毁并回收其占用的内存

内存对象即 `zval`，计数器是 `refcount__gc`。

### 代码模拟

```php
<?php
    $name = "江五渣一点也不酷";
    xdebug_debug_zval('name'); //name:(refcount=1, is_ref=0),string '江五渣一点也不酷' (length=24)
```

#### 赋值

```php
<?php
    $name = "江五渣一点也不酷";
    $temp_name = $name;
    xdebug_debug_zval('name'); //name:(refcount=2, is_ref=0),string '江五渣一点也不酷' (length=24)
```

#### 引用赋值

```php
<?php
    $name = "江五渣一点也不酷";
    $temp_name = &$name;
    xdebug_debug_zval('name'); //name:(refcount=2, is_ref=1),string '江五渣一点也不酷' (length=24)
```

#### 数组型变量

```php
<?php
    $name = ['a'=>'江五渣', 'b'=>'菜菜哒'];
    xdebug_debug_zval('name');
    //name:
    //(refcount=1, is_ref=0),
    //array (size=2)
      //'a' => (refcount=1, is_ref=0),string '江五渣' (length=9)
      //'b' => (refcount=1, is_ref=0),string '菜菜哒' (length=9)
```

![复合类型图示](http://php.net/manual/zh/images/12f37b1c6963c1c5c18f30495416a197-simple-array.png)

#### 销毁变量

```php
<?php
    $name = "江五渣的不开心";
    $temp_name = $name;
    xdebug_debug_zval('name'); //name:(refcount=2, is_ref=0),string '江五渣的不开心' (length=21)
    unset($temp_name);
    xdebug_debug_zval('name'); //name:(refcount=1, is_ref=0),string '江五渣的不开心' (length=21)
```

*注： `unset` 并非一定会释放内存，当有两个变量指向的时候，并非会释放变量占用的内存，只是 `refcount` 减 1。

### 缺陷

存在内存泄漏问题。

看一段代码：

```php
<?php  
$a = array();  
$a[] = & $a;  
unset($a);  
```

- 建立了数组 a
- 让 a 的第一个元素按引用指向 a，此时 `a.zval.refcount = 2`
- 销毁变量 a，此时 `a.zval.refcount = 1`，但没有办法对其进行操作，形成了一个循环自引用

![循环自引用](http://images.51cto.com/files/uploadimg/20110228/1350200.jpg)

## PHP5.3

PHP5.3 的垃圾回收算法依然以引用计数为基础，但不再用简单的计数作为回收准则，而是使用了一种同步回收算法：[Concurrent Cycle Collection in Reference Counted Systems](http://researcher.watson.ibm.com/researcher/files/us-bacon/Bacon01Concurrent.pdf)。

### 原理

一个 `zval` 如果有引用，要么被全局符号表中的符号引用，要么被其它表示复杂类型的 `zval` 中的符号引用。因此在 `zval` 中存在一些可能根(`root`)。

- PHP 会分配一个固定大小的“根缓冲区”，这个缓冲区用于存放固定数量的 `zval`，这个数量默认是 10,000
- 对每个根缓冲区中的根 `zval` 按照深度优先遍历算法遍历所有能遍历到的 `zval`，并将每个 `zval` 的 `refcount` 减 1（同时为了避免对同一 `zval` 多次减 1(因为可能不同的根能遍历到同一个 `zval`)，每次对某个 `zval` 减 1 后就对其标记为“已减”）
- 再次对每个缓冲区中的根 `zval` 深度优先遍历
    - `zval` 的 `refcount` 不为0，对其加 1
- 清空根缓冲区中的所有根，然后销毁所有 `refcount` 为 0 的 `zval`，并收回其内存

总结：对此 `zval` 中的每个元素进行一次 `refcount` 减 1 操作，操作完成之后，如果 `zval` 的 `refcount=0`，那么这个 `zval` 就是一个辣鸡。

### 图解

![引用计数系统中的同步周期回收](http://php.net/manual/zh/images/12f37b1c6963c1c5c18f30495416a197-gc-algorithm.png)

A. 节点被放入缓冲区 `root`，标记为紫色
B. 缓冲区满后，以深度优先对每个节点所包含的 `zval` 做减 1 操作。操作过的节点标记为灰色（避免重复操作）
C. 再次深度优先判断每个节点包含的 `zval` 值。`refcount=0` ：标记为白色（垃圾），`refcount>0`：对非垃圾还原操作，`zval + 1` ，标记为黑色
D. 再次遍历，将白色节点 `zval` 释放


### 算法特点

- 不是每次 `refcount` 减少时都进入回收周期，只有根缓冲区满额后在开始垃圾回收
- 可以解决循环引用问题
- 可以总将内存泄露保持在一个阈值以下

## 参考资料

- [PHP 垃圾回收机制 官方文档](http://www.php.net/manual/zh/features.gc.php)
- [一看就懂系列之 由浅入深聊一聊php的垃圾回收机制](https://blog.csdn.net/u011957758/article/details/76864400)
- [PHP垃圾回收深入理解](https://www.cnblogs.com/lovehappying/p/3679356.html)
- [php内存管理机制、垃圾回收机制](https://www.cnblogs.com/xinghun/p/5660051.html)
- [PHP5和PHP7的垃圾回收机制有什么不同](PHP5和PHP7的垃圾回收机制有什么不同)
- [深入理解PHP7内核之zval](http://www.laruence.com/2018/04/08/3170.html)