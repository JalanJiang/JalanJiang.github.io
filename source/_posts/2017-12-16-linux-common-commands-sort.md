---
title:       Linux常用命令之排序
description: 排序与统计
date:       2017-12-16 16:54:00
categories:
    - Web屠龙刀
tags:
    - Shell
toc: true
---

## sort

```
sort [-fbMnrtuk] [file or stdin]
```

### 选项与参数：

- -f：忽略大小写差异（A与a视为相同编码）
- -b：忽略前端空格
- -r：反向排序
- -u：去重，相同数据仅出现一行代表（unique）
- -t：分隔符（默认以 [tab] 键分隔）
- -k：以哪个区间（field）排序（与 `-t` 连用）
- 排序类型相关
    - -n：使用纯数字进行排序（默认文字形态排序）
    - -M：以月份名称排序（Jan、DEC排序）

### 使用场景

- 排序
- 按不同数据型态排序

### 栗子

将个人账号进行排序。

```
➜  / cat /etc/passwd | sort

_amavisd:*:83:83:AMaViS Daemon:/var/virusmails:/usr/bin/false
_appleevents:*:55:55:AppleEvents Daemon:/var/empty:/usr/bin/false
_applepay:*:260:260:applepay Account:/var/db/applepay:/usr/bin/false
```

用 `:` 分隔，并按照第三拦进行排序。

```wtmp 与第一行的空白都是 last 的默认字符，那两个可以忽略的
➜  / cat /etc/passwd | sort -t ":" -k 3

nobody:*:-2:-2:Unprivileged User:/var/empty:/usr/bin/false
root:*:0:0:System Administrator:/var/root:/bin/sh
_taskgated:*:13:13:Task Gate Daemon:/var/empty:/usr/bin/false
```

以纯数字排序。

```
nobody:*:-2:-2:Unprivileged User:/var/empty:/usr/bin/false

root:*:0:0:System Administrator:/var/root:/bin/sh
daemon:*:1:1:System Services:/var/root:/usr/bin/false
_uucp:*:4:4:Unix to Unix Copy Protocol:/var/spool/uucp:/usr/sbin/uucico
```

仅取账号，加以排序。

```
➜  / cat /etc/passwd | cut -d ":" -f 1 | sort

_amavisd
_appleevents
_applepay
```

## uniq

```
uniq [-ic]
```

### 选项与参数

- -i：忽略大小写
- -c：进行计数

### 使用场景

排序后将重复的数据仅列出一个显示。

### 栗子一

使用 last 将账号列出，仅取出账号栏，进行排序后仅取出一位。

```
➜  / last | cut -d ' ' -f 1 | sort | uniq


_mbsetupuser
reboot
root
shutdown
wtmp
zj-db0908
```

### 栗子二

计算每个用户的登录次数。

```
last | cut -d ' ' -f 1 | sort | uniq -c

   1
   3 _mbsetupuser
  38 reboot
   4 root
  30 shutdown
   1 wtmp
 340 zj-db0908
```

注：wtmp 与第一行的空白都是 last 的默认字符，可以忽略

## wc

```
wc [-lwm]
```

### 选项与参数

- -l：仅列出行
- -w：仅列出多少字（英文单字）
- -m：仅列出多少字符
- 不加参数：列出行、字与字符数

### 使用场景

计算文件的行数、字数、字符数。

### 栗子

计算账号文件中有多少个账号。

```
➜  / cat /etc/passwd | wc -l
     103
```








