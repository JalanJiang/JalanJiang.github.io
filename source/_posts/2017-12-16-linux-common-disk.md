---
title:       Linux常用命令之磁盘空间
description: du 命令与 df 命令的区别
date:       2017-12-20 20:00:00
categories:
    - Web屠龙刀
tags:
    - Shell
toc: true
---

`du`：查看目录大小
`df`：查看磁盘使用情况

## du

显示每个文件和目录的磁盘使用空间。

```
du [选项][文件]
```

### 选项与参数

- -a或-all：显示目录中个别文件的大小。
- -b或-bytes：显示目录或文件大小时，以byte为单位。
- -c或--total：除了显示个别目录或文件的大小外，同时也显示所有目录或文件的总和。
- -k或--kilobytes：以KB(1024bytes)为单位输出。
- -m或--megabytes：以MB为单位输出。
- -s或--summarize：仅显示总计，只列出最后加总的值。
- -h或--human-readable：以K，M，G为单位，提高信息的可读性。
- -x或--one-file-xystem：以一开始处理时的文件系统为准，若遇上其它不同的文件系统目录则略过。
- -L<符号链接>或--dereference<符号链接> 显示选项中所指定符号链接的源文件大小。
- -S或--separate-dirs：显示个别目录的大小时，并不含其子目录的大小。
- -X<文件>或--exclude-from=<文件>：在<文件>指定目录或文件。
- --exclude=<目录或文件>：略过指定的目录或文件。
- -D或--dereference-args：显示指定符号链接的源文件大小。
- -H或--si：与-h参数相同，但是K，M，G是以1000为换算单位。
- -l或--count-links：重复计算硬件链接的文件。

### 栗子一

显示目录所占空间。

```
➜  [curl] du

88	./vendor/composer
16	./vendor/php-curl-class/php-curl-class/.github
8	./vendor/php-curl-class/php-curl-class/docs
560	./vendor/php-curl-class/php-curl-class/examples
40	./vendor/php-curl-class/php-curl-class/scripts
160	./vendor/php-curl-class/php-curl-class/src/Curl
160	./vendor/php-curl-class/php-curl-class/src
584	./vendor/php-curl-class/php-curl-class/tests/PHPCurlClass
640	./vendor/php-curl-class/php-curl-class/tests
288	./vendor/php-curl-class/php-curl-class/www/img
328	./vendor/php-curl-class/php-curl-class/www
1816	./vendor/php-curl-class/php-curl-class
1816	./vendor/php-curl-class
1912	./vendor
1992	.
```

只显示当前目录下子目录的大小和当前目录的大小总和。1992为当前目录的大小总和。

显示文件+目录。

```
➜  [curl] du -a

8	./composer.json
8	./composer.lock
8	./index.php
16	./test.jpeg
32	./test1.jpg
8	./vendor/autoload.php
8	./vendor/composer/autoload_classmap.php
8	./vendor/composer/autoload_namespaces.php
8	./vendor/composer/autoload_psr4.php
8	./vendor/composer/autoload_real.php
8	./vendor/composer/autoload_static.php
32	./vendor/composer/ClassLoader.php
8	./vendor/composer/installed.json
8	./vendor/composer/LICENSE
88	./vendor/composer
………………………………………………………………………………
1912	./vendor
8	./weixin.php
1992	.
```

### 栗子二

显示指定文件或目录所占空间

```
➜  [curl] du index.php

8	index.php
```

`du` 命令后可跟（多个）文件名、（多个）文件夹名。

### 栗子三

只显示总和大小。

```
➜  [curl] du -s

1992	.
```

并增强可读性。

```
➜  [curl] du -hs

996K	.
```

### 栗子四

按空间大小排序。

```
➜  [curl] du | sort -nr | more
1992    .
1912    ./vendor
1816    ./vendor/php-curl-class/php-curl-class
1816    ./vendor/php-curl-class
640     ./vendor/php-curl-class/php-curl-class/tests
584     ./vendor/php-curl-class/php-curl-class/tests/PHPCurlClass
560     ./vendor/php-curl-class/php-curl-class/examples
328     ./vendor/php-curl-class/php-curl-class/www
288     ./vendor/php-curl-class/php-curl-class/www/img
160     ./vendor/php-curl-class/php-curl-class/src/Curl
160     ./vendor/php-curl-class/php-curl-class/src
88      ./vendor/composer
40      ./vendor/php-curl-class/php-curl-class/scripts
16      ./vendor/php-curl-class/php-curl-class/.github
8       ./vendor/php-curl-class/php-curl-class/docs
```

## df

检查linux服务器的文件系统的磁盘空间占用情况，可以获取硬盘被占用了多少空间，目前还剩下多少空间等信息。

```
df [选项] [文件]
```

### 选项与参数

必要参数：

- -a 全部文件系统列表
- -h 方便阅读方式显示
- -H 等于“-h”，但是计算式，1K=1000，而不是1K=1024
- -i 显示inode信息
- -k 区块为1024字节
- -l 只显示本地文件系统
- -m 区块为1048576字节
- --no-sync 忽略 sync 命令
- -P 输出格式为POSIX
- --sync 在取得磁盘信息前，先执行sync命令
- -T 文件系统类型

选择参数：

- --block-size=<区块大小> 指定区块大小
- -t<文件系统类型> 只显示选定文件系统的磁盘信息
- -x<文件系统类型> 不显示选定文件系统的磁盘信息
- --help 显示帮助信息
- --version 显示版本信息

### 栗子一

显示磁盘使用情况。

```
➜  hexo-blog git:(hexo) ✗ df

Filesystem                             512-blocks      Used Available Capacity iused      ifree %iused  Mounted on
/dev/disk1                              487662600 442159384  44991216    91% 2063908 4292903371    0%   /
devfs                                         390       390         0   100%     676          0  100%   /dev
map -hosts                                      0         0         0   100%       0          0  100%   /net
map auto_home                                   0         0         0   100%       0          0  100%   /home
/Users/zj-db0908/Downloads/Postman.app  487662600 424199248  62951352    88% 2037977 4292929302    0%   /private/var/folders/rv/j43c3v_d2wb51r4w8t1y61h80000gn/T/AppTranslocation/6FDC6726-A781-4388-B23C-1AB94288EC12
```

### 栗子二

显示指定类型磁盘。

```
➜  hexo-blog git:(hexo) ✗ df -T devfs

Filesystem 512-blocks Used Available Capacity iused ifree %iused  Mounted on
devfs             390  390         0   100%     676     0  100%   /dev
```

### 栗子三

以易读方式展示。

```
➜  hexo-blog git:(hexo) ✗ df -h

Filesystem                               Size   Used  Avail Capacity iused      ifree %iused  Mounted on
/dev/disk1                              233Gi  211Gi   21Gi    91% 2063910 4292903369    0%   /
devfs                                   195Ki  195Ki    0Bi   100%     676          0  100%   /dev
map -hosts                                0Bi    0Bi    0Bi   100%       0          0  100%   /net
map auto_home                             0Bi    0Bi    0Bi   100%       0          0  100%   /home
/Users/zj-db0908/Downloads/Postman.app  233Gi  202Gi   30Gi    88% 2037977 4292929302    0%   /private/var/folders/rv/j43c3v_d2wb51r4w8t1y61h80000gn/T/AppTranslocation/6FDC6726-A781-4388-B23C-1AB94288EC12
```

仅显示本地文件系统情况。

```
➜  hexo-blog git:(hexo) ✗ df -lh
Filesystem   Size   Used  Avail Capacity iused      ifree %iused  Mounted on
/dev/disk1  233Gi  211Gi   21Gi    91% 2063911 4292903368    0%   /
```

## 参考资料

- [Linux du命令和df命令区别](http://blog.csdn.net/wisgood/article/details/17316663)









