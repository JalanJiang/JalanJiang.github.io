---
title:      Python高级特性
description:   代码这玩意儿，越简单越好。
date:       2017-03-14 13:00:00
categories:
    - 技多不压身
tags:
    - Python
---

> 1行代码能实现的功能，决不写5行代码。
> 请始终牢记，代码越少，开发效率越高。



## 1 切片

`Python` 提供了切片（`Slice`）操作符，简化指定索引范围的操作。

我们直接使用代码来说明一下：

``` python
# -*- coding: utf-8 -*-

'''切片'''

listDemo = []

numbers = 10


# range(numbers) 代表：从 0 到 numbers-1
for number in range(numbers):
    # print(number)
    # 构造一个列表
    listDemo.append(number)


# 取m-n
print('取出m-n')
# 0-3
print(listDemo[0:3])
print(listDemo[:3])
# 1-3
print(listDemo[1:3])

# 倒数切片
print('倒数切片')
print(listDemo[-2:])
print(listDemo[-2:-1])

# 创建一个0-99的序列
L = list(range(100))
# 取出前10个数
print('取出前10个数：', L[:10])
# 取出后10个数
print('取出后10个数：', L[-10:])
# 前11-20个数
print('取出前11-20个数：', L[10: 20])

# 前10个数每2个取一个
print('前10个数，每2个取一个：', L[:10:2])
# 所有数，每5个取一个
print('所有数，每5个取一个', L[::5])
```

另： `Tuple` 和字符串也可以使用切片操作。

----------


## 2 迭代

关键字：`for ... in ...`

在 `Python` 中，只要是可迭代对象，无论有无下标，都可以迭代。


#### 字典的迭代

`dict` 的存储不是按照 `list` 的方式顺序排列，迭代出的结果顺序很可能不一样。

``` python
# **迭代字典**

dictDemo = {'a': 'astring', 'b': 'bstring', 'c': 'cstring'}

for key in dictDemo:
    # 默认迭代结果是key
    print(key)
```

`dict` 默认迭代 `key`，若要迭代 `value` 可以借助 `.values()`：

``` python
# 如果要迭代value：
for value in dictDemo.values():
    print(value)
```

要同时迭代 `key` 和 `value`，借助 `.items()`：

``` python
# 同时迭代key和value
for key, value in dictDemo.items():
    print(key, value)
```

#### 迭代列表

`enumerate` 函数可以把一个 `list` 变成索引-元素对，这样就可以在 `for` 循环中同时迭代索引和元素本身：

``` python
# 同时迭代List的索引和元素本身

listDemo = list(range(10))
for i, value in enumerate(listDemo):
    print(i, value)
```

#### 迭代字符串

字符串也是可迭代对象，可以作用于 `for` 循环：

``` python
# **迭代字符串**
stringDemo = 'This is a string.'

for s in stringDemo:
    print(s)
```


#### 判断是否为迭代对象

通过 `collections` 模块的 `Iterable` 类型判断：

``` python
# 判断一个对象是否为可迭代对象
from collections import Iterable
print(isinstance(stringDemo, Iterable))
```

#### 在for循环中同时引入两个变量

``` python
# 在for循环中同时引入两个变量
for x,y in [(1, 3), (5, 7), (9, 10)]:
    print(x, y)
```

----------

## 3 列表生成式

``` python
# -*- coding: utf-8 -*-

'''列表生成式'''

listDemo = list(range(1, 11))
print(listDemo)

# 生成 [1*1, 2*2, ..., 10*10]的列表
listDemo2 = [x*x for x in range(1, 11)]
print(listDemo2)

# 加入if语句，筛选偶数
listDemo3 = [x*x for x in range(1, 11) if x%2 == 0]
print(listDemo3)

# 两层循环生成全排列数据
listDemo4 = [m+n for m in 'ABC' for n in 'XYZ']
print(listDemo4)

# 列出当前路径所有文件名和目录名
import os
listDemo5 = [d for d in os.listdir('.')]
print('当前路径文件＋目录：', listDemo5)

## 使用两个变量生成list
dictDemo = {'a': 'aString', 'b': 'bString', 'c': 'cString'}
listDemo6 = [k+'='+v for k, v in dictDemo.items()]
print(listDemo6)
```



#### 练习题

如果 `list` 中既包含字符串，又包含整数，由于非字符串类型没有 `lower()`方法，所以列表生成式会报错：

``` ruby
>>> L = ['Hello', 'World', 18, 'Apple', None]
>>> [s.lower() for s in L]
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "<stdin>", line 1, in <listcomp>
AttributeError: 'int' object has no attribute 'lower'
```

使用内建的 `isinstance` 函数可以判断一个变量是不是字符串：

``` ruby
>>> x = 'abc'
>>> y = 123
>>> isinstance(x, str)
True
>>> isinstance(y, str)
False
```

请修改列表生成式，通过添加 `if` 语句保证列表生成式能正确地执行：

``` python
# -*- coding: utf-8 -*-

L1 = ['Hello', 'World', 18, 'Apple', None]

L2 = [s.lower() for s in L1 if isinstance(s, str)]

# 期待输出: ['hello', 'world', 'apple']
print(L2)
```


----------



## 4 生成器

- 一边循环一边计算的机制
- 通过 `next()` 获得 `generator` 的下个返回值
- `generator` 是可迭代对象，用 `for` 循环迭代
- 遇到 `yield` 语句时返回，再次执行时从上次返回的 `yield` 语句处继续执行

#### 创建方法1

**创建方法**：把一个列表生成式的 `[]` 改成 `()`。

``` python
# 创建方法1:
generatorDemo = (x*x for x in range(1, 10))
for g in generatorDemo:
    print(g)
```

#### 创建方法2

创建方法：函数定义中包含 `yield` 关键字。

先 code 一个能打印斐波拉契数列的函数：

``` python
# 打印斐波拉契数列
def fib(max):
    a = 1
    b = 0
    n = 0
    while n < max:
         print(a)
         a, b = a+b, a
         n = n+1
    return 'done'
```
＊注：其中 `a,b = a+b,a` 为 `Python` 的元组赋值方式。

> 元组赋值语句可以得到 `Python` 中一个常用的编写代码的技巧。
> 因为语句执行时，`Python` 会建立临时的元组，来存储右侧变量原始的值，分解赋值语句也是一种交换两变量的值，却不需要自行创建临时变量的方式：右侧的元组会自动记住先前的变量的值。

然后我们把函数中 `print(a)` 改为 `yield a`，那么这个函数就不再是一个普通函数了，而是一个 `generator`：

``` python
def fib2(max):
    a = 1
    b = 0
    n = 0
    while n < max:
        # 加入yield关键字
         yield a
         a, b = a+b, a
         n = n+1
    return 'done'
```

调用函数并使用 `for ... in ...` 取出生成器的内容：

``` python
fibGenerator = fib2(6)

for f in fibGenerator:
    print(f)
```






#### 练习题：打印杨辉三角形

``` python
# 打印杨辉三角形
def triangles():
    L = [1]
    while True:
        yield L
        L.append(0)
        #print('L=', L)
        L = [L[i - 1] + L[i] for i in range(len(L))]

n = 0
for t in triangles():
    print(t)
    n = n + 1
    if n == 10:
        break
```


----------

## 5 迭代器

####  Iterable - 可迭代对象

可以直接作用于 `for` 循环的对象统称为可迭代对象。

包括：

- list
- tuple
- dict
- set
- str
- generator

#### Iterator - 迭代器

特点：

 1. 可以被 `next()` 函数调用并不断返回下一个值
 2. `Iterator` 对象表示一个数据流
 3. `Iterator` 的计算是惰性的，只有在需要返回下一个数据时它才会计算

把`list`、`dict`、`str` 等 `Iterable` 变成 `Iterator` 可以使用 `iter()` 函数：

``` ruby
>>> isinstance(iter([]), Iterator)
True
>>> isinstance(iter('abc'), Iterator)
True
```

 ----------

 
## 参考资料

 
 《[廖雪峰的官方网站][1]》


  [1]: http://www.liaoxuefeng.com/wiki/0014316089557264a6b348958f449949df42a6d3a2e542c000/0014317568446245b3e1c8837414168bcd2d485e553779e000