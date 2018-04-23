---
title:       Linux常用命令汇总
description: Linux常用命令与线上实践
date:       2017-12-16 15:22:00
categories:
    - Web屠龙刀
tags:
    - Shell
---

## 管道

### 管线命令 pipe

- 使用场景：想获取的输出需要经过几道手续才能得到
- 定界符：`|`
- 注意：
	- 仅会处理 `standard input` ，对 `standard error output` 没有处理能力
	- 管线后：必须跟着可接受 `standard input` 数据的命令（例如 less, more, head, tail）

栗子：

列出 `/Users/www` 目录下的所有文件，并进行分页显示。

```
ls -al /Users/www | less
```


## 文件目录

- cd：切换用户当前工作目录
    - `cd`：命令后不指定目录，切换到当前用户的 `home` 目录
    - `cd ~`：同 `cd`
    - `cd -`：退回切换前的目录
    - `cd ..`：返回上一级目录
- pwd：显示用户当前工作目录
- ls:查看文件与目录
    - `ls`：查看目录中的文件
    - `ls -l`：显示文件和目录的详细资料（长数据串形式列出）
    - `ls -a`：显示隐藏文件
    - `ls -R`：递归列出
    - `ls -d`：仅列出目录
- rm
    - `rm -f file1`：删除一个叫做 'file1' 的文件'
    - `rmdir dir1`：删除一个叫做 'dir1' 的目录'
    - `rm -rf dir1`：删除一个叫做 'dir1' 的目录并同时删除其内容
    - `rm -rf dir1 dir2`：同时删除两个目录及它们的内容
- cp
    - `cp file1 file2`：复制一个文件
    - `cp dir/* .`：复制一个目录下的所有文件到当前工作目录
    - `cp -a /tmp/dir1 .`：复制一个目录到当前工作目录
    - `cp -a dir1 dir2`：复制一个目录
- mv
- chmod
- chown
- touch
- mkdir

## 磁盘空间

- [du](/2017/12/20/2017-12-16-linux-common-disk/)
- [df](/2017/12/20/2017-12-16-linux-common-disk/)

## 查看

- [wc](/2017/12/16/2017-12-16-linux-common-commands-sort/)
- head
- tail
- less
- [cat](/2018/03/21/2018-03-21-linux-common-commands-cat/)
- ps
- top
- ping
- curl
- tcpdump

## 过滤查询

- [find](/2018/03/21/2018-03-21-linux-common-commands-find/)
- [xargs](/2018/03/21/2018-03-26-linux-common-commands-xargs/)
- [grep](/2017/12/16/2017-12-16-linux-common-commands-capture/)
- [cut](/2017/12/16/2017-12-16-linux-common-commands-capture/)
- awk
- [sed](/2017/01/22/2017-01-22-shell-sed-replace-text/)
- [sort](/2017/12/16/2017-12-16-linux-common-commands-sort/)
- [uniq](/2017/12/16/2017-12-16-linux-common-commands-sort/)

## 编辑

- vim

# 参考资料

- [初窥Linux 之 我最常用的20条命令](http://blog.csdn.net/ljianhui/article/details/11100625/)
- [Linux常用命令大全](https://www.cnblogs.com/fnlingnzb-learner/p/5831284.html)

