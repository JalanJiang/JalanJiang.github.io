---
title:       让 Linux 进程在后台运行
description: 远离烦乱的终端信息
date:       2018-11-01 23:20:00
categories:
    - 技多不压身
tags:
    - Linux
---



## &

在命令后加上 `&` 实现后台运行。

```
sh test.sh &
```

将所有标准输出与错误输出都重定向到某文件中：

```
command > out.file 2>&1 &
```

## nohup

使用 `&` 命令后作业将被提交到后台运行，但一旦把控制台关掉（`exit` 退出后），作业就会停止运行。而 `nohup` 可以在推出账户后继续运行进程。

`nohup` 即不挂起的意思（no hang up）。

```
nohup command &
```

作业的输出都将被重定向到一个名为 `nohup.out` 文件中。

注：使用 `nohup` 后需要使用 `exit` 正常推出当前账户，此啊能保证命令一直在后台运行。

## 进程

### jobs -l

仅可查看当前终端生效的进程。

### ps -ef

```
ps -aux | grep chat.js
```

- a:显示所有程序 
- u:以用户为主的格式来显示 
- x:显示所有程序，不以终端机来区分

### 端口占用情况

查看使用端口的进程：

```
lsof -i:8090
```

查看其占用端口：

```
netstat -ap | grep 8090
```

### 终止进程

```
kill -9 pid
```