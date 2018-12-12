---
title:       Linux常用命令之 —— xargs
description: find 是 Unix/Linux 命令行工具箱中最棒的工具之一
date:       2018-03-27 20:56:00
categories:
    - Web屠龙刀
tags:
    - Shell
toc: true
---

将标准输入数据转换成命令行参数。

```
command | xargs
```

## 多行输入转单行输出

```
➜ cat example.txt
1 2 3 4 5 6
7 8 9 10
11 12

➜ cat example.txt | xargs
1 2 3 4 5 6 7 8 9 10 11 12
```

## 单行输入转多行输出

`-n` 指定每行 n 个参数。

```
➜ cat example.txt | xargs -n 3
1 2 3
4 5 6
7 8 9
10 11 12
```

## 指定定界符

`-d` 选择为输入指定一个定制的定界符。

```
echo "splitXsplitXsplitXsplitXsplit" | xargs -d X
split split split split split
```

## 格式化参数 & 传递给命令

```
command | xargs command
```

### 指定替换字符

使用 `-I` 指定替换字符串。

```
cat args.txt | xargs -I {} ./echo.sh -p {} -l
```

`-I {}` 制定了替换字符串，对于每一个命令参数，字符串 `{}` 都会被从 `stdin` 读取到的参数替换掉。

## 结合 find

错误方法：

```
find . -type f -name "*.txt" -print | xargs rm -f
```

修改后：

```
# 把 \0 作为定界符
find . -type f -name "*.txt" -print0 | xargs -0 rm -f
```

## 结合 while 语句和子 shell

```
cat files.txt | (while read arg; do cat $arg; done)
# 等同于
cat files.txt | xargs -I {} cat {}
```