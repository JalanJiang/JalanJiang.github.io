---
layout:     post
title:      Python函数式编程
description:   函数就是面向过程的程序设计的基本单元。
date:       2017-03-16 13:00:00
categories:
    - Web屠龙刀
tags:
    - Python
---

> 函数式编程——Functional Programming，其思想更接近数学计算。

## 1 高阶函数

概念：让函数的参数能够接收别的函数。

``` python
# 高阶函数：把函数作为变量传入
def add(a, b, f):
    return f(a)+f(b)

print(add(-7, -5, abs))
```

#### map

`map()` 功能：

1. 将传入的函数依次作用到序列的每个元素
2. 把结果作为新的 `Iterator`（迭代器） 返回

`map()` 接收两个参数：

1. 函数
2. `Iterable` （可迭代对象）

``` python
# map的用法
# 接受两个参数：1.函数；2.可迭代对象

def f(x):
    return x*x

listDemo = [1, 2, 3, 4, 5]
result = map(f, listDemo)
print(list(result))
```

#### reduce

`reduce()` 功能：

1. `reduce` 把一个函数（这个函数必须接收两个参数）作用在一个序列[x1, x2, x3, ...]，
2. `reduce` 把结果继续和序列的下一个元素做累积计算

效果如下：

``` python
reduce(f, [x1, x2, x3, x4]) = f(f(f(x1, x2), x3), x4)
```

举两个栗子：

``` python
# 序列求和
def add(x, y):
    return x+y
print('reduce结果：', reduce(add, listDemo))
```


``` python
# 把序列[1, 2, 3, 4, 5]变成12345
def change_list(x, y):
    return x*10+y
print('序列变换结果：', reduce(change_list, listDemo))
```

#### filter

`filter()` 功能：

1. 把传入的函数依次作用于每个元素
2. 根据返回值是 `True` 还是 `False` 决定保留还是丢弃该元素

`filter()` 特性：

 1. 接收一个函数和一个序列
 2. 返回一个 `Iterator`（迭代器）

**栗子1**：利用 `filter` 在序列中保留奇数

``` python
# 在序列中保留奇数
def is_odd(x):
    return x%2 == 1

print('filter结果：', list(filter(is_odd, listDemo)))
```

**栗子2**：利用 `filter` 求素数

``` python
# 生成一个奇数序列（从3开始）
def _odd_iter():
    n = 1
    while True:
        n = n + 2
        yield n+2

# 素数筛选序列（筛选出素数）：不断从序列中划掉 n 的倍数
def _not_divisible(n):
    return lambda x: x%n > 0

# 制作一个不断返回素数的迭代器
def primes():
    yield 2
    # 初始序列
    odd = _odd_iter()
    while True:
        # 取第一个/下一个数
        number = next(odd)
        yield number
        # 对序列进行筛选
        filter(_not_divisible(number), odd)


for n in primes():
    if n < 199:
        print(n)
    else:
        break
```

**练习题**：

回数是指从左向右读和从右向左读都是一样的数，例如 `12321`，`909`。请利用`filter()` 滤掉非回数：

``` python
'''用filter判断回文数'''

def is_palindrome(n):
    str_n = str(n)
    # str_n：正向序列；str_n[::-1]：反向序列
    return str_n == str_n[::-1]


# 测试:
output = filter(is_palindrome, range(1, 1000))
print(list(output))
```





#### sorted

`sorted()` 功能：

 1. 对序列排序
 2. 接收一个 `key` 函数进行自定义排序
	 - `key` 指定的函数将作用于list的每一个元素上
	 - 对 `key` 函数返回的结果进行排序
	 
**直接排序**：

``` python
# 使用sorted对list排序
listDemo2 = [-9, 100, 9, 2, 1]
print(sorted(listDemo2))
```

**使用自定义规则排序**：

``` python
# 按绝对值大小排序
print(sorted(listDemo2, key=abs))
```

``` python
listDemo3 = ['Jalan', 'apple', 'Zend']
print(sorted(listDemo3))
# 全部转为小写再排序
print(sorted(listDemo3, key = str.lower))
``` 

**反向排序**：

传入第三个参数 `reverse=True`

``` python
print(sorted(listDemo3, key=str.lower, reverse=True))
```

**练习题**：

假设我们用一组 `tuple` 表示学生名字和成绩：

``` python
L = [('Bob', 75), ('Adam', 92), ('Bart', 66), ('Lisa', 88)]
```


请用 `sorted()` 对上述列表分别按名字排序：

``` python
# -*- coding: utf-8 -*-

L = [('Bob', 75), ('Adam', 92), ('Bart', 66), ('Lisa', 88)]

def by_name(t):
    return t[0]

L2 = sorted(L, key=by_name)
print(L2)
```

再按成绩从高到低排序：

``` python
# -*- coding: utf-8 -*-

L = [('Bob', 75), ('Adam', 92), ('Bart', 66), ('Lisa', 88)]

def by_score(t):
    return t[1]

L2 = sorted(L, key=by_score)

print(L2)
```


----------




## 2 返回函数

#### 把函数作为返回值

``` python
# 定义一个累加函数
def private_sum(*args):
    sum = 0
    for n in args:
        sum = sum + n
    return sum


# 定义一个能返回一个累加函数的函数
def return_private_sum(*args):
    def private_sum():
        sum = 0
        for n in args:
            sum = sum + n
        return sum
    # 返回累加函数
    return private_sum()

our_sum = return_private_sum(1, 2, 3)
# 调用 our_sum 时才真正计算求和结果
print(our_sum)
```

在这个例子中：

- 在函数 `return_private_sum` 中又定义了函数 `private_sum`
- 内部函数 `private_sum` 可以引用外部函数 `return_private_sum` 的参数和局部变量
- 当 `return_private_sum` 返回函数 `private_sum` 时，相关参数和变量都保存在返回的函数中。这种称为“**闭包**（`Closure`）”
- 调用 `return_private_sum()` 时，每次调用都会返回一个新的函数，即使传入相同的参数


**返回一个函数时，牢记该函数并未执行！！！**

#### 闭包

**当一个函数返回了一个函数后，其内部的局部变量还被新函数引用。**

举个栗子：

``` python
def count():
    fs = []
    for i in range(1, 4):
        def f():
             return i*i
        fs.append(f)
    return fs

f1, f2, f3 = count()
```

运行结果：

``` ruby
>>> f1()
9
>>> f2()
9
>>> f3()
9
```

运行结果都是9，原因：

- 返回的函数引用了变量 `i`
- 返回的函数并非立刻执行
- 等到 3 个函数都返回时，它们所引用的变量i已经变成了 3 ，因此最终结果为 9

返回闭包时牢记的一点：返回函数**不要引用任何循环变量**，或者后续会发生变化的变量。

改进方法：

 - 再创建一个函数
 - 用该函数的参数绑定循环变量当前的值
 - 无论该循环变量后续如何更改，已绑定到函数参数的值不变
 
``` python
 def count():
 	# 再创建一个函数f
    def f(j):
        def g():
            return j*j
        return g
    fs = []
    for i in range(1, 4):
        fs.append(f(i)) # f(i)立刻被执行，因此i的当前值被传入f()
    return fs
```

运行结果：

``` ruby
>>> f1, f2, f3 = count()
>>> f1()
1
>>> f2()
4
>>> f3()
9
```


----------


## 3 匿名函数

关键字：`lambda`

格式例如：`lambda x: x * x`，即代表如下函数：

``` python
def f(x):
    return x * x
```

 - 冒号前面的x表示函数参数
 - 就是只能有一个表达式
 - 不用写 `return`

匿名函数的优点：

 - 函数没有名字，不必担心函数名冲突
 - 匿名函数也是一个函数对象，也可以把匿名函数赋值给一个变量，再利用变量来调用该函数

``` python
f = lambda x: x * x
```

把匿名函数作为返回值：

``` python
def build(x, y):
    return lambda: x * x + y * y
```


----------

## 4 装饰器

装饰器（`Decorator`）：在代码运行期间动态增加功能。

本质上，`decorator` 就是一个返回函数的高阶函数。

特点：

 - 接收一个函数作为参数
 - 返回一个函数

#### 两层嵌套

定义一个 `Decorator`：

``` python
# 定义一个可以打印日志的函数
# 接收一个函数并返回一个函数
def log(func):
    # wrapper可以接受任何参数的调用
    # wrapper先打印日志，再调用原始函数
    def wrapper(*args, **kw):
        # 取出函数名
        print('call %s():' % func.__name__)
        # 调用传入的函数
        return func(*args, **kw)
    # 返回内部定义的函数
    return wrapper
```

借助 `Python` 的 `@` 语法，把 `decorator` 置于函数的定义处：

``` python
@log
def now():
    print('现在的时间：2017-03-16')
	
# 执行 now 函数
now = now()
now
```

相当于执行了语句：

``` python
now = log(now)
```

#### 三层嵌套

如果 `decorator` 本身需要传入参数，那就需要编写一个返回 `decorator` 的高阶函数：

``` python
def log(text):
    def decorator(func):
        def wrapper(*args, **kw):
            print('%s %s():' % (text, func.__name__))
            return func(*args, **kw)
        return wrapper
    return decorator
```

用法：

``` python
@log('execute')
def now():
    print('2015-3-25')
```

执行结果：

``` ruby
>>> now()
execute now():
2015-3-25
```

相当于执行了语句：

``` ruby
>>> now = log('execute')(now)
```

- 首先执行 `log('execute')`
- 返回 `decorator` 函数 
- 再调用返回的函数，参数是 `now` 函数
- 返回值最终是 `wrapper` 函数








#### 复制原始函数属性

因为返回的那个 `wrapper()` 函数名字就是 '`wrapper`'，所以，需要把原始函数的 `__name__` 等属性复制到 `wrapper()` 函数中，否则，有些依赖函数签名的代码执行就会出错。

关键字：`functools.wraps`


二层嵌套写法：

``` python
# 导入functools模块
import functools

def log(func):
    @functools.wraps(func)
    def wrapper(*args, **kw):
        print('call %s():' % func.__name__)
        return func(*args, **kw)
    return wrapper
```


三层嵌套写法：

``` python
import functools

def log(text):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kw):
            print('%s %s():' % (text, func.__name__))
            return func(*args, **kw)
        return wrapper
    return decorator
```


----------


## 5 偏函数

偏函数（`Partial function`）作用 ：

- 把一个函数的某些参数给固定住（也就是设置默认值）
- 返回一个新的函数

栗子：

``` ruby
>>> import functools
>>> int2 = functools.partial(int, base=2)
>>> int2('1000000')
64
>>> int2('1010101')
85
```

新的 `int2` 函数，把 `int` 函数的 `base` 参数重新设定默认值为 2。


----------


## 参考资料

《[廖雪峰的官方网站][1]》


  [1]: http://www.liaoxuefeng.com/wiki/0014316089557264a6b348958f449949df42a6d3a2e542c000/0014317848428125ae6aa24068b4c50a7e71501ab275d52000