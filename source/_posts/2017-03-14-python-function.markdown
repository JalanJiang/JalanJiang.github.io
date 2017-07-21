---
layout:     post
title:      Python函数
description:   借助抽象，我们才能在更高的层次上思考问题。
date:       2017-03-14 12:00:00
categories:
    - 技多不压身
tags:
    - Python
---

> 借助抽象，我们才能不关心底层的具体计算过程，而直接在更高的层次上思考问题。
> 
> 写计算机程序也是一样，函数就是最基本的一种代码抽象的方式。


----------


## 1 函数的定义

关键字：`def`

``` python

def function_name(paramer1, paramer2, ...):
    # 缩进书写函数体
    
    # 若不函数执行完毕也没有return语句时，自动return None（可以简写成return）
    return 
```

#### 空函数

定义一个啥也不做的函数。

``` python
# 定义一个空函数
def empty_function():
    # 例如：还没想好代码怎么写，可以先用pass标记成空函数，先让代码运行起来。pass用作占位符
    pass
```

#### 参数检查

如果有必要，可以对函数的参数类型做检查。

若传入参数类型有误，则抛出一个错误。

``` python
# 参数检查-isinstance()
def my_abs(x):
    if not isinstance(x, (int, float)):
        # 若 x 不是整型或浮点型，抛出错误
        raise TypeError('参数类型有误')
    if x >= 0:
        return x
    else:
        return -x
```

#### 返回多个值

看似返回了多个值，其实只返回了单一值：元组。

``` python
# 返回多个值－其实返回的是一个tuple
def return_more(x):
    return x+1, x-1
```


----------


## 2 函数的参数

#### 默认参数

默认参数的**坑**：

定义一个接收 `List` 的函数，添加一个元素 `END` 后返回 `List`。

``` python
def add_end(L=[]):
    L.append('END')
    return L
```

当你使用默认参数调用时，一开始结果也是对的。但是，再次调用  `add_end()` 时，结果就不对了。函数似乎每次都“记住了”上次添加了 '`END`' 后的 `List` 。

``` ruby
>>> add_end()
['END', 'END']
>>> add_end()
['END', 'END', 'END']
```

`Python` 函数在定义的时候，默认参数 `L` 的值就被计算出来了，即 `[]`，因为默认参数 `L` 也是一个变量，它指向对象 `[]`，每次调用该函数，如果改变了 `L` 的内容，则下次调用时，默认参数的内容就变了，不再是函数定义时的 `[]` 了。

所以，定义默认参数要牢记一点：**默认参数必须指向不变对象**！

用不变对象 `None` 修改上诉例子：

``` python
def add_end(L=None):
    if L is None:
        L = []
    L.append('END')
    return L
```


#### 可变参数

**关键字**： `*`

- 可以传入多个或0个参数
- 可变参数在函数调用时自动组装为一个 `tuple`

``` python
# 传入多个参数
def more_parameter(*numbers):
    sum = 0;
    for number in numbers:
        sum += number
    print('sum=%d'%sum)
    
numberList = [2, 3, 4]
# *numberList 表示把 numberList 作为可变参数传入
more_parameter(*numberList)
```

#### 关键字参数

**关键字**： `**`

- 关键字参数允许传入0个或任意个含参数名的参数
- 这些关键字参数在函数内部自动组装为一个 `dict`

``` python
# 关键字参数
def key_parameter(name, **kv):
    print('name:', name, 'other:', kv)
    
# 创建一个字典
dicDemo = {'address': 'fzu', 'job': 'coder'}
key_parameter('jalan', **dicDemo)
```




#### 命名关键字参数

**关键字参数的检查：**

使用 `if-in` 检查传入的关键字参数中是否存在某个参数：

``` python
# 检查关键字参数
def check_key_parameter(**kv):
    if 'name' in kv:
        print('存在 name 参数')

    if 'address' in kv:
        print('存在 address 参数')

    if 'gender' in kv:
        print('存在 gender 参数')
        
dicDemo = {'address': 'fzu', 'job': 'coder', 'name22': 'testName'}
check_key_parameter(**dicDemo)
```

 **限制关键字名字：**

- 必须传入参数名，否则会报错
- 使用特殊分隔符：`*`

使用特殊分隔符`*`，`*`后面的参数被视为命名关键字参数：

``` python
# 只接收 address 和 job作为关键字参数
def limit_key_parameter_name(name, *, address, job):
    print(name, address, job)
```

如果缺少`*`，`Python` 解释器将无法识别位置参数和命名关键字参数：

``` python
def person(name, age, city, job):
    # 缺少 *，city和job被视为位置参数
    pass
```

如果函数定义中已经有了一个可变参数，后面跟着的命名关键字参数就不再需要一个特殊分隔符`*`了：

```python
# 如果已跟着可变参数，关键字参数前不需要加*
def limit_key_parameter_name_2(name, *arg, address, job):
    print(name, arg, address, job)
```







#### 参数组合

`Python` 参数定义的顺序：

1. 必选参数
2. 默认参数
3. 可变参数
4. 命名关键字参数
5. 关键字参数

定义两个函数：

``` python
def f1(a, b, c=0, *args, **kw):
    print('a =', a, 'b =', b, 'c =', c, 'args =', args, 'kw =', kw)

def f2(a, b, c=0, *, d, **kw):
    print('a =', a, 'b =', b, 'c =', c, 'd =', d, 'kw =', kw)
```

`Python` 解释器自动按照参数位置和参数名把对应的参数传进去：

``` nix
>>> f1(1, 2)
a = 1 b = 2 c = 0 args = () kw = {}
>>> f1(1, 2, c=3)
a = 1 b = 2 c = 3 args = () kw = {}
>>> f1(1, 2, 3, 'a', 'b')
a = 1 b = 2 c = 3 args = ('a', 'b') kw = {}
>>> f1(1, 2, 3, 'a', 'b', x=99)
a = 1 b = 2 c = 3 args = ('a', 'b') kw = {'x': 99}
>>> f2(1, 2, d=99, ext=None)
a = 1 b = 2 c = 0 d = 99 kw = {'ext': None}
```

对于任意函数，都可以通过类似`func(*args, **kw)`的形式调用它，无论它的参数是如何定义的：

``` nix
>>> args = (1, 2, 3, 4)
>>> kw = {'d': 99, 'x': '#'}
>>> f1(*args, **kw)
a = 1 b = 2 c = 3 args = (4,) kw = {'d': 99, 'x': '#'}
>>> args = (1, 2, 3)
>>> kw = {'d': 88, 'x': '#'}
>>> f2(*args, **kw)
a = 1 b = 2 c = 3 d = 88 kw = {'x': '#'}
```



----------

## 3 递归函数

定义：一个函数在内部调用自身本身

使用递归实现一个 `n!` 运算：

``` python
# 递归函数－实现阶乘
def fact(n):
    if n == 1:
        return 1
    return n*fact(n-1)
```

#### 尾递归优化

使用递归函数要**防止栈溢出**。

> 在计算机中，函数调用是通过栈（`stack`）这种数据结构实现的，每当进入一个函数调用，栈就会加一层栈帧，每当函数返回，栈就会减一层栈帧。由于栈的大小不是无限的，所以，递归调用的次数过多，会导致栈溢出。

解决递归调用栈溢出的方法是通过尾递归优化。

> 编译器或者解释器就可以把尾递归做优化，使递归本身无论调用多少次，都只占用一个栈帧，不会出现栈溢出的情况。

尾递归是指：

 - 在函数返回的时候，调用自身本身
 - `return` 语句不能包含表达式
 
 将上述 `n!` 运算改为尾递归：
 
``` python
 # 尾递归优化
def fact2(n, p):
    return fact_iter(n, p)

def fact_iter(number, product):
    if number == 1:
        return product
    return fact_iter(number - 1, number*product)
```

尾递归调用时，如果做了优化，栈不会增长，因此，无论多少次调用也不会导致栈溢出。

遗憾的是，大多数编程语言没有针对尾递归做优化，`Python` 解释器也没有做优化，所以，即使把上面的 `fact(n)` 函数改成尾递归方式，也会导致栈溢出。

 


----------


## 参考资料

《[廖雪峰的官方网站][1]》


  [1]: http://www.liaoxuefeng.com/wiki/0014316089557264a6b348958f449949df42a6d3a2e542c000/00143167832686474803d3d2b7d4d6499cfd093dc47efcd000