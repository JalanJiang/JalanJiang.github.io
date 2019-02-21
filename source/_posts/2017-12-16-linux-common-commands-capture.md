---
title:       Linux常用命令之撷取
description: 将一段数据经过分析后，取出我们所想要的内容
date:       2017-12-16 15:56:00
categories:
    - Web屠龙刀
tags:
    - Shell
toc: true
---

撷取命令：

- 将一段数据经过分析后，取出我们所想要的
- “一行一行”分析，而不是整篇分析

## cut

```
cut -d'分隔字符' -f fields <==用于有特定分隔字符

cut -c 字符区间            <==用于排列整齐的信息
```

### 选项与参数：

- -d: 接分隔字符，与 -f 一起使用
- -f：根据 -d 的分隔字符将一段信息分成数段，用 -f 取出第几段的意思
- -c：以字符（characters）的单位取出固定字符区间

### 使用场景：

- 对同一行里面的数据进行分解
- 常用场景：日志切割

### 栗子一

用 `:` 分隔 `$PATH` ，并取出第 5 个。

```
➜  / echo $PATH
/usr/local/bin:/usr/bin:/bin:/usr/local/sbin:/usr/sbin:/sbin

➜  / echo $PATH | cut -d ":" -f 5
/usr/sbin
```

### 栗子二

取出 `export` 12字符以后的所有字符串。

```
➜  / export
Apple_PubSub_Socket_Render=/private/tmp/com.apple.launchd.5Ri9k5vYvp/Render
HOME=/Users/zj-db0908
LANG=zh_CN.UTF-8
LC_CTYPE=zh_CN.UTF-8
LESS=-R
LOGNAME=zj-db0908
LSCOLORS=Gxfxcxdxbxegedabagacad
PAGER=less
PATH=/usr/local/bin:/usr/bin:/bin:/usr/local/sbin:/usr/sbin:/sbin
PWD=/
SHELL=/bin/zsh
SHLVL=1
SSH_AUTH_SOCK=/private/tmp/com.apple.launchd.VGTFxfFRYS/Listeners
TERM=xterm-256color
TERM_PROGRAM=Apple_Terminal
TERM_PROGRAM_VERSION=388.1.1
TERM_SESSION_ID=0DAFA448-F866-460B-899F-39B5FF44A228
TMPDIR=/var/folders/rv/j43c3v_d2wb51r4w8t1y61h80000gn/T/
USER=zj-db0908
XPC_FLAGS=0x0
XPC_SERVICE_NAME=0
ZSH=/Users/zj-db0908/.oh-my-zsh
__CF_USER_TEXT_ENCODING=0x1F5:0x19:0x34

➜  / export | cut -c 12-
b_Socket_Render=/private/tmp/com.apple.launchd.5Ri9k5vYvp/Render
/zj-db0908
UTF-8
_CN.UTF-8

db0908
fxcxdxbxegedabagacad

ocal/bin:/usr/bin:/bin:/usr/local/sbin:/usr/sbin:/sbin

zsh

CK=/private/tmp/com.apple.launchd.VGTFxfFRYS/Listeners
256color
M=Apple_Terminal
M_VERSION=388.1.1
N_ID=0DAFA448-F866-460B-899F-39B5FF44A228
/folders/rv/j43c3v_d2wb51r4w8t1y61h80000gn/T/
908
x0
_NAME=0
zj-db0908/.oh-my-zsh
EXT_ENCODING=0x1F5:0x19:0x34
```

- `12-` 表示12之后的所有字符
- 第 12-20 的字符可以表示为 `cut -c 12-20`

### 栗子三

获取登录信息，筛选出用户名。

```
➜  / last
zj-db0908  ttys008                   Thu Dec 14 17:13   still logged in
zj-db0908  ttys007                   Thu Dec 14 15:48   still logged in
zj-db0908  ttys001                   Thu Dec 14 13:50   still logged in

➜  / last | cut -d ' ' -f 1
zj-db0908
zj-db0908
zj-db0908
```

## grep

```
grep [-acinv] [--color=auto] '搜寻字符串' filename
```

### 选项与参数

- -a：将 binary 文件以 text 文件的方式搜寻数据
- -c：计算找到“搜寻字符串”的次数
- -i：忽略大小写的不同（大小写视为相同）
- -n：顺便输出行号
- -v：反向选择（显示出没有“搜寻字符串”的那行）
- -E：使用正则表达式
- -o：仅输出匹配到的文本——|
- -b：打印模式匹配所位于的字符或字节偏移
- -l/-L：在多个文件中寻找匹配
- 指定或排除文件
    - --include：指定包含文件
    - --exclude：排除文件
    - --exclude-dir：排除文件夹
- 打印上下文
    - -A：文本前 x 行
    - -B：文本后 x 行
- -color=auto

### 使用场景

- 取出符合查找条件的一行信息

### 搜索包含特定模式的文本行

```
grep pattern filename
grep pattern file1 file2 file3 ...
```

取出出现 `root` 的一行。

```
➜  / last | grep "root"

root      console                   Mon Oct  2 13:29 - shutdown  (00:02)
root      console                   Tue Aug 29 10:47 - shutdown  (00:00)
root      console                   Thu Jun 15 13:31 - 13:31  (00:00)
root      console                   Tue Jun  6 12:10 - 12:10  (00:00)
```

取出未出现 `root` 的一行。

```
➜  / last | grep -v "root"

zj-db0908  ttys008                   Thu Dec 14 17:13   still logged in
zj-db0908  ttys007                   Thu Dec 14 15:48   still logged in
zj-db0908  ttys001                   Thu Dec 14 13:50   still logged in

```

### 正则匹配

```
grep -E "[a-z]+" filename
egrep "[a-z]+" filename
```

### 搜索多个文件

```
#输出有匹配结果的文件列表
grep -l linux file1 file2 file3
```

`-L` 与 `-l` 相反，会返回一个不匹配文本的文件列表。

### 递归搜索文件

```
grep "text" . -R -n
```

### 多 pattern 匹配

使用 `-e` 指定多个匹配样式。

```
grep -e pattern1 -e pattern2
```

提供一个样式文件，在样式文件中指定多个样式。

```
grep -f path_file
```

path_file 文件内容（一行一个匹配样式）：

```
hello
world
```

### 与 cut 配合使用

取出带 `root` 的信息进行分隔，并只取出分隔结果的第一栏。

```
➜  / last | grep "root" | cut -d " " -f 1

root
root
root
root
```

### 关键词上色

取出 `/etc/asl.conf` 文件中带 `Faci` 的行，并对关键词上色。

```
➜  / grep --color=auto "Faci" /etc/asl.conf

? [= Facility authpriv] access 0 80
? [= Facility remoteauth] [<= Level critical] access 0 80
? [= Facility internal] ignore
? [= Facility auth] [<= Level info] file system.log
? [= Facility authpriv] [<= Level info] file system.log
# Facility com.apple.alf.logging gets saved in appfirewall.log
? [= Facility com.apple.alf.logging] file appfirewall.log file_max=5M all_max=50M
```
