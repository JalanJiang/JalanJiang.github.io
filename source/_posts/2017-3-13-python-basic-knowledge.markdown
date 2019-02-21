---
layout:     post
title:      "Python基础"
description:   " \"Hello, Python!\""
date:       2017-03-13 12:00:00
categories:
    - Web屠龙刀
tags:
    - Python
---

# 前言

帮女朋友研究毕设重入 `Python` 坑，在此整理一下笔记。


----------


# 正文

## 1 输入与输出

#### 主要函数

- `print()`

- `input()`

#### Code

``` python
'''
python输入与输出 基本I/O
'''

#--数据输出 print()

print('Hello Liululu~ This is Jiayang (。・`ω´・).')
# 逗号被转为空格
print('Talk', 'is', 'cheap', 'show', 'me', 'the', 'code')
# 输出数字计算结果
print(1+2)
# 格式化输出字符串（与c语言类似）
print('Hello %s. 1 + 1 = %d.'%('world', 2))

#--数据输入 input()

name = input('Please enter your name:')
print('Your name is:', name)

str = 'Hello %s'%'world'
print(str)
```


----------


## 2 列表 List 和元组 Tuple

### 2.1 List

#### List特性

 - 有序
 - 可变
 - 下标访问

#### 声明方式

``` python
listDemo = ['test', 23, True]
```

#### 主要函数

 - `len()`
 - `append()`
 - `insert()`
 - `pop()`

#### Code

``` python
# -*- coding: utf-8 -*-

'''
List数据结构－可变有序列表
'''

# 声明
foodList = ['bread', 'apple', 'rice']
# 获取List长度
foodListLength = len(foodList)
# 通过索引访问List
print(foodList[0])
print(foodList[1])
print(foodList[2])
# 倒序访问
print(foodList[-1])
print(foodList[-2])
print(foodList[-3])
# 追加元素到List末尾：append()
foodList.append('potato chips')
# 在指定位置追加元素:insert()
foodList.insert(1, 'orange')
# 删除末尾的一个元素:pop()
foodList.pop();
# 删除指定位置的元素
foodList.pop(1)
# 按索引给元素赋值
foodList[1] = 'noodles'
# List元素类型可以不同
listDemo = ['test', 124, True]
# List也可以嵌套List
listDemo2 = ['test', 123, [True, 'test']]

# 也可以这样写
listDemo3 = [listDemo2, 'listDemo3']

#print(foodList)
#print(listDemo3)
```

#### 关于列表推导式

列表推导式（list comprehension）是一种简化代码的优美方法。它利用其他列表来创建新的列表。

组成：
- 方括号
- 表达式
- for语句

创建一个包含 1 到 10 的平方的列表。

```
[x*x for x in range(10)]
```

只选取出能被 3 整除的数，可以再跟一个 if 语句。

```
[x*x for x in range(10) if x % 3 == 0]
```

也可以使用多个 for 语句。

```
[(x, y) for x in range(3) for y in range(3)]
```

### 2.2 Tuple

#### Tuple特性

 - 有序
 - **指向**无法变更
 - 通过下标获取值
 
#### 声明方式
 
``` python
 foodTuple = ('bread', 'rice', 'apple')
```

#### Code
 
``` python
 # -*- coding: utf-8 -*-

'''
Tuple-元组
'''

# 声明
foodTuple = ('bread', 'rice', 'apple')
# 定义一个空的Tuple
emptyTuple = ()
# 定义只有一个元素的Tuple，加入逗号避免混淆
oneElementTuple = (1,)

# 一个可变的Tuple：把Tuple的某元素指向一个List

changeTuple = (1, 'change', 'tuple', ['this', 'is', 'a', 'list'])

changeTuple[3][3] = 'changeList'

print(changeTuple)
```


----------

## 3 条件判断与循环

### 3.1 条件判断

#### 格式

``` python
if <条件判断1>:
    <执行1>
elif <条件判断2>:
    <执行2>
elif <条件判断3>:
    <执行3>
else:
    <执行4>
```

#### Code

``` python
# -*- coding: utf-8 -*-

age = 18
userAge = input('请输入你的年龄：')

# input()读入的数据是字串类型，需要转为int
userAgeInt = int(userAge)

if userAgeInt > 18 :
    print('你比家养哥哥老好多 ヽ(*´Д｀*)ﾉ')
elif userAgeInt == 18:
    print('你和家养哥哥一样年轻～  (/≥▽≤/) ')
else:
    print('你比家养哥哥还年轻啦 _(┐「ε:)_ ')
```

### 3.2 循环

#### for-in循环

``` python
loopList = ['one', 'two', 'three']

# for-in循环
for loopElement in loopList:
    print(loopElement)
```

#### while循环

``` python
# while循环

sum = 0
n = 100

while n > 0 :
    sum += n
    n = n-1

print('总数=', sum)
```

＊注：在循环语句中，`break` 和 `continue` 的用法和其它语言相同。


----------

## 4 字典Dict和集合Set

### 4.1 字典Dict

#### Dict特性

 - `key-value` 键值对存储
 - 通过 `key` 值访问 `value`
 - 通过 `key` 下标赋值

＊注：如果 `key` 不存在，`dict` 会报错

#### 声明方式

``` python
d = {'Michael': 95, 'Bob': 75, 'Tracy': 85}
```

#### Code

``` python
# -*- coding: utf-8 -*-
'''
字典dict
'''

# 声明 key-value键值对
dictDemo = {'one': 1, 'two': 2, 'three': 3}
# 通过key访问value
print(dictDemo['one'])
# 通过下标写入dict
dictDemo['write'] = 'write a word'

# key不存在会报错，用in判断key是否存在
key = 'one'
if key in dictDemo:
    print("The key", key, "is in dictDemo.")
else:
    print("The key", key, "isn't in dictDemo.")

# 取出value值-get()方法

oneValue = dictDemo.get('one')
# 若key不存在可以指定value值
sixValue = dictDemo.get('six', -1)

# 删除一个key
dictDemo.pop('two')

theValue = dictDemo.get('three', 22)
print('get value=', theValue)

print(dictDemo)
```

### 4.2 集合Set

#### Set特性

 - 可以看作没有 value 的 Dict
 - key 值不可重复
 - 不可放入可变对象

#### 声明

``` python

set([1, 2, 3])

```

#### Code

```python
# -*- coding: utf-8 -*-

# set:集合
# 集合的特性：无序性、互异性、确定性

# 声明 用一个list作为输入
setDemo = set([1, 2, 3])

# 添加元素到集合
setDemo.add(4)
# 可以重复添加但不会有结果
setDemo.add(3)

# 用remove删除元素
setDemo.remove(1)


setDemo2 = set([3, 4, 5, 6])

# 两个集合的运算

# 交集
s1 = setDemo & setDemo2
# 并集
s2 = setDemo | setDemo2
print(setDemo)

print('s1=', s1)
print('s2=', s2)

```


----------


# 参考资料

 《[廖雪峰的官方网站][1]》


  [1]: http://www.liaoxuefeng.com/