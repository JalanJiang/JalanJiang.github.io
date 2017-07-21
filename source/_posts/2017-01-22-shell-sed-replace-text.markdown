---
layout:     post
title:      Shell脚本之——文本文件中的替换操作
description:  Learning Stream EDitor.
date:       2017-01-22 21:25:00
categories:
    - Web屠龙刀
tags:
    - Shell
---

# 前言

执行文本替换程序是 `sed`——流编辑器（`Stream Editor`），它以批处理的方式来编辑文件。

虽然`sed`的命令很多，能做许多复杂的工作，但它最常用的还是处理输入流的文本替换，通常是作为管道的一部分。因此，在本篇正文中主要介绍`sed`的替换命令。

# 正文

## 1 基本语法

```
 sed [ -n ] 'editing command' [ file ... ]
 sed [ -n ] -e 'editing command' ... [ file ... ]
 sed [ -n ] -f script-file ... [ file ... ]
```

```
sed [-nefri] ‘command’ 输入文本
```

## 2 主要选项

### 2.1 常用选项

- -n：使用安静（silent）模式。在一般sed的用法中，所有来自stdin的资料一般都会被列出到屏幕，但如果加上-n参数后，则只有经过sed特殊处理的那一行（或者command）才会被列出来。(即只打印匹配行)
- -e：允许多点编辑
- -f：直接将sed的动作写在一个档案内，-f filename 则可以执行filename内的sed动作
- -r：sed 的动作支援的是延伸型正规表示法的语法。(预设是基础正规表示法语法)
- -i：直接修改读取的档案内容，而不是由屏幕输出

### 2.2 常用Command

- a\：新增。a 的后面可以接字串，而这些字串会在新的一行出现(目前的下一行)
- c\：取代。c 的后面可以接字串，这些字串可以取代 n1,n2 之间的行
- d ：删除。因为是删除啊，所以d后面通常不接任何东西
- i\：插入。i 的后面可以接字串，而这些字串会在新的一行出现(目前的上一行)
- p ：列印。亦即将某个选择的资料印出。通常 p 会与参数 `sed -n` 一起运作
- s ：取代。可以直接进行取代的工作。通常这个 s 的动作可以搭配正规表示法。例如：`1,20s/old/new/g`

## 3 替换命令

在`sed`中使用`s`命令进行替换操作。

### 3.1 实例1：基本用法 

``` powershell
# 删除第一个冒号之后的所有字符（用空白符替换冒号）
# 排序列表并删除重复部分
sed 's/:.*//'' /etc/passwd | sort -u
```
在这里，`/`字符扮演定界符（`delimiter`）的角色，从而分隔正则表达式与替代文本（`replacement text`），以及可选用的标志。

除了斜杆以外还可以使用其他任意字符作为定界符。

### 3.2 实例2：全局替换——/g

在`s`命令里以`g`结尾表示全局性（`global`），即替代文本取代正则表达式中每一个匹配。如果不设置`g`，只会取代第一个匹配。

``` powershell
# 输入样本
echo Tolstoy reads well. Tolstoy writes well. > example.txt
# 没有设置g
sed 's/Tolstoy/Camus/' < example.txt
# 输出数据为：Camus reads well. Tolstoy writes well.

# 设置了g
sed 's/Tolstoy/Camus/g' < example.txt
# 输出数据：Camus reads well. Camus writes well.
```

### 3.3 实例3：指定替代第n个匹配

在结尾指定数字，指示第`n`个匹配出现才要被取代。

``` powershell
# 仅替代第2个匹配
sed 's/Tolstoy/Camus/2' < example.txt
```

### 3.4 实例4：给予sed多个命令

通过`-e`给予`sed`多个命令。每一个编辑命令都使用一个`-e`选项。

``` powershell
sed -e 's/foo/bar/g' -e 's/chicken/cowg' myfile.xml > myfile2.xml
```

### 3.5 实例5：将编译命令放入脚本

如果有很多要编辑的项目，可以将编辑命令全放进一个脚本里，再使用`sed`搭配`-f`：

``` powershell
$ cat fixup.sed
s/foo/bar/g
s/chicken/cow/g
s/draft animal/horse/g
...
$ sed -f fixup.sed myfile.xml > myfile2.xml
```

### 3.6 实例6：从此替换整个文本——&

&在替代文本里表示的意思是：从此点开始替代成匹配于正则表达式点整个文本。

``` powershell
mv atlga.xml atlga.xml.old
sed 's/Atlanta/&, the capital of the South/' < atlga.xml.old > atlga.xml
```
因此，若要在替代文本中使用`&`字符的字面意义，需要使用反斜杆对它进行转义：

``` powershell
sed 's/\\/\&bsol;/g'
```
### 3.7 实例7：打印与否——/p

`-n`选项修改了`sed`的默认行为。当使用`-n`选项时，`sed`将不会在操作完成后打印模式空间的最后内容。反之，若在脚本中使用`p`，则会明白地将此行显示出来。

``` powershell
sed -n '/<HTML>/p' *.html  # 仅显示<HTML>这行
```


## 4 删除命令

假设文件名为ab.

```
sed '1d' ab             #删除第一行
sed '$d' ab             #删除最后一行
sed '1,2d' ab           #删除第一行到第二行
sed '2,$d' ab           #删除第二行到最后一行
```

以上删除操作即删除相应行后，其他行信息被打印，但源文件的信息不变。

删除后写入另一文件：

```
sed '1d' ab > ab_test
```

删除所有包含`writing`的行：

```
sed '/writing/d' sed_test
```

## 5 打印命令

打印所有行以及匹配到`This`的行：

```
sed '/This/p' sed_test
```

若需只打印匹配到的信息，加入`-n`：

```
sed -n '/This/p' sed_test
```

打印出1-2行：

```
sed '1,2p' sed_test
```



## 6 关于空间模式

`sed`读取每个文件，一次读一行，将读取的行放到内存的一个区域——称之为模式空间（`pattern space`）。

这就像程序语言里的变量一样：内存的一个区域在编辑命令的提示下可以修改，所有编辑上的操作都会应用到模式空间的内容。

当所有操作完成后，`sed`会将模式空间的最后内容打印到标准输出，再回到开始处，读取另一个输入行。


# 参考资料

 1. 《Shell脚本学习指南》；
 2. 《[linux shell之sed][1]》
 3. 《[流编辑器sed][2]》


  [1]: http://blog.csdn.net/wl_fln/article/details/7281986

  [2]: http://www.cnblogs.com/mchina/archive/2012/06/30/2570523.html

