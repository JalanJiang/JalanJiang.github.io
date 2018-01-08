---
layout:     post
title:      "Django 环境配置踩坑记之 mysql 驱动安装"
description:   "一起 Django 吧"
date:       2018-01-05 12:00:00
categories:
    - Web屠龙刀
tags:
    - Python
---

步骤一，安装 mysql 驱动。

```
brew install mysql-connector-c
```

步骤二，安装 mysqlclient。

```
pip install mysqlclient
```

然而在这里报错了，下面是具体的报错信息。

```
➜  pip3 install mysqlclient
Collecting mysqlclient
  Using cached mysqlclient-1.3.12.tar.gz
    Complete output from command python setup.py egg_info:
    Traceback (most recent call last):
      File "<string>", line 1, in <module>
      File "/private/var/folders/rv/j43c3v_d2wb51r4w8t1y61h80000gn/T/pip-build-qw9bwfek/mysqlclient/setup.py", line 17, in <module>
        metadata, options = get_config()
      File "/private/var/folders/rv/j43c3v_d2wb51r4w8t1y61h80000gn/T/pip-build-qw9bwfek/mysqlclient/setup_posix.py", line 54, in get_config
        libraries = [dequote(i[2:]) for i in libs if i.startswith('-l')]
      File "/private/var/folders/rv/j43c3v_d2wb51r4w8t1y61h80000gn/T/pip-build-qw9bwfek/mysqlclient/setup_posix.py", line 54, in <listcomp>
        libraries = [dequote(i[2:]) for i in libs if i.startswith('-l')]
      File "/private/var/folders/rv/j43c3v_d2wb51r4w8t1y61h80000gn/T/pip-build-qw9bwfek/mysqlclient/setup_posix.py", line 12, in dequote
        if s[0] in "\"'" and s[0] == s[-1]:
    IndexError: string index out of range

    ----------------------------------------
Command "python setup.py egg_info" failed with error code 1 in /private/var/folders/rv/j43c3v_d2wb51r4w8t1y61h80000gn/T/pip-build-qw9bwfek/mysqlclient/
```

据说这个错误是由 mysql 的 bug 引起的，在 《[一场由mysql官方引发的python血案](https://www.easegamer.com/?p=545)》 这篇文章中有了详细说明，在这里就不多说了。

下面说一下解决方法。

1. 找到 mysql_config 文件，我的文件路径在 `/usr/local/Cellar/mysql-connector-c/6.1.11/bin/mysql_config`，如果你的文件不在这个路径下，也可以使用 `sudo find / -name "mysql_config"` 进行一次磁盘全面搜索。
2. 修改前对文件进行备份
```
cp  mysql_config mysql_config.backup
```
3. 修改配置文件，在 114 行处左右，将 `libs="$libs -l "` 替换为 `libs="$libs -lmysqlclient -lssl -lcrypto"`
4. 保存文件，重新执行 `pip install mysqlclient`，安装成功

验证是否安装成功。

```
➜  python3
Python 3.6.4 (default, Dec 25 2017, 14:57:46)
[GCC 4.2.1 Compatible Apple LLVM 9.0.0 (clang-900.0.39.2)] on darwin
Type "help", "copyright", "credits" or "license" for more information.
>>> import MySQLdb
```