---
layout:     post
title:      【问题解决】PHP执行Python脚本引入 import cv2 报错
description:  关于PHP、Python与OpenCV
date:       2017-07-17 15:25:00
categories:
    - 跨过这道坎
tags:
    - PHP
    - Python
---

## 错误描述

```
Array
(
    [0] => Traceback (most recent call last):
    [1] =>   File "/www/privdata/oa.manage.meitu.com/watermark.py", line 9, in <module>
    [2] =>     import cv2
    [3] =>   File "/usr/lib/python2.7/site-packages/cv2/__init__.py", line 5, in <module>
    [4] =>     os.environ["PATH"] += os.pathsep + os.path.dirname(os.path.realpath(__file__))
    [5] =>   File "/usr/lib/python2.7/UserDict.py", line 23, in __getitem__
    [6] =>     raise KeyError(key)
    [7] => KeyError: 'PATH'
)
```

原因：`os.environ["PATH"]` 不存在。

又是一个很奇怪的报错问题，Python 脚本可以在命令行中正常被调用，但在 PHP 中被调用时会报 KeyError: 'PATH' 的错误。

在 Python 中直接输出 `os.environ["PATH"]` 也是有结果的：

```
>>> import os
>>> print os.environ["PATH"]
/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin:/root/bin:/usr/local/ruby/bin:/root/bin
```

## 解决方法

最后想出的解决方法是在 Python 中直接给 `os.environ["PATH"]` 再次赋值：

```
os.environ["PATH"] = "/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin:/root/bin:/usr/local/ruby/bin:/root/bin"
```

## 总结

这个方法是个无奈之举，毕竟没有找出错误的根本所在。`os.environ["PATH"]` 输出的是系统的环境变量，在 PHP 中所调用的 Python 无法获取该值，也许和 Web 环境有关。