---
title:       Linux的硬链接与软链接
description: Linux下创建链接命令
date:       2017-12-26 15:22:00
categories:
    - Web屠龙刀
tags:
    - Shell
toc: true
---

# 硬链接（hard link）

一个 `inode` 对应多个文件名，可以理解为**一个文件拥有两个文件名**。

特点：

- 文件有相同的 inode 和 data block
- 不可跨文件系统
- 只能对已存在的文件进行创建
- 不能对目录进行创建
- 删除一个硬链接文件并不影响其他拥有相同 inode 的文件

# 软链接（soft link || symbolic link）

系统创建一个链接文件，**该文件指向它所要指向的文件**。

特点：

- 拥有自己的文件属性及权限等
- 可跨文件系统
- 可对不存在等我文件或目录创建软链接
- 可对文件和目录进行创建
- 删除软链接不影响被指向的文件，但删除被指向的文件，则相关软链接被成为死链接（dangling link）

![链接示意图](/img/in-post/linux-hard-link-and-soft-link/link.jpg)


# 相关命令

## 创建链接

```
ln [option] source_file dist_file
```

### 相关参数

- -f：建立时，将同档案名删除
- -i：删除前进行询问

### 栗子

建立文件 abc 的软链接。

```
ln -s abc cde
```

建立文件 abc 的硬链接。

```
ln abc cde
```

## 查找

### ls

查看文件链接情况。

```
ls -li
```

### find

列出目录下所有软链接文件。

```
find / -type l -ls
```

查找拥有和 xx 文件相同 inode 的所有硬链接。

```
find / -samefile /home/harris/debug/test3/old.file
```

查找 inode 为 xxx 的文件。

```
find / -inum 660650
```

# 参考资料

- [理解 Linux 的硬链接与软链接](https://www.ibm.com/developerworks/cn/linux/l-cn-hardandsymb-links/)
- [linux下创建和删除软、硬链接](https://www.cnblogs.com/xiaochaohuashengmi/archive/2011/10/05/2199534.html)
- [Linux ln命令 - 建立文件/目录链接](http://www.linuxidc.com/Linux/2014-12/111056.htm)