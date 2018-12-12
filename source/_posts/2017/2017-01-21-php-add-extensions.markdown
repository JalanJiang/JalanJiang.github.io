---
title:      OS X 10.11下PHP扩展的添加
description: 磨刀不误砍柴工。
date:       2017-01-21 15:58:00
categories:
    - 磨刀石
tags:
    - PHP
---

# 前言

在`PHP`编程中要使用到`Socket`通信，但本地`PHP`环境中的`Socket`扩展尚未安装。

在安装的过程中我也遇到了一些列问题，借此机会稍做记录，也方便之后查找。

开发环境：`OS X 10.11` ＋ `NPM`。

# 正文

## 1 打开Socket扩展，发现报错

使用`Socket`之前，需要打开`PHP`中的`Socket`扩展。即：在`php.ini`文件，去掉这行代码前的注释：

``` ini
extension=php_sockets.dll
```

修改`php.ini`文件后再加载配置，却发现报错：

``` groovy
[20-Jan-2017 17:46:03] NOTICE: PHP message: PHP Warning:  PHP Startup: Unable to load dynamic library '/usr/lib/php/extensions/no-debug-non-zts-20121212/php_sockets.dll' - dlopen(/usr/lib/php/extensions/no-debug-non-zts-20121212/php_sockets.dll, 9): image not found in Unknown on line 0
```

这说明我的本地环境还未安装`Socket`扩展。

## 2 在PHP源代码包中寻找Socket扩展

我的源代码包目录在`/usr/include/php/`，先进入该目录：

``` elixir
$ cd /usr/include/php/
```

再进入`ext`目录：

``` elixir
$ cd ext
```

查看`ext`目录下的文件，找到`sockets`文件夹，进入该文件夹：

``` elixir
$ cd sockets
```

然而我本地的源码包`Socket`扩展貌似不全，只有包含一个`php_sockets.h`头文件。无奈之下，只好前往[php.net][1]下载一个与我本地`PHP`版本相同的源码包进行安装。

## 3 寻找phpize

`phpize`工具一般在`PHP`安装目录下，如果找不到也可以使用`find`命令来寻找：

``` elixir
$ sudo find / -iname "phpize"
```

我的`phpize`所在位置为：`/usr/bin/phpize`。

## 4 执行phpize工具

进入所下载的`PHP`源码包的`/ext/sockets/`目录，执行`phpize`工具：

``` elixir
$ /usr/bin/phpize
```

我本地执行`phpize`后报错如下：

> Cannot find autoconf. Please check your autoconf installation

这是因为`autoconf`尚未安装，可以借助`Homebrew`安装`autoconf`：


``` elixir
$ brew install autoconf
```

如果还为安装`Homebrew`可以借助如下命令安装：

``` julia
$ ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"
```

执行`phpize`工具成功后，在目录下会生成对应的`configure`文件。

## 5 通过configure进行配置

成功生成`configure`文件后，可通过`configure`进行配置。执行如下命令：

``` elixir
$ ./configure --prefix=/usr/local/php --with-php-config=/usr/bin/php-config --enable-sockets
```

`--with-php-config`所跟随的参数是本地`php-config`所在位置。

再执行：

``` go
$ make && make install
```

我执行该命令并未成功，发生报错：

> cp: /usr/lib/php/extensions/no-debug-non-zts-20121212/#INST@3994#:Operation not permitted

这是因为`Mac`的`OS X 10.11`版本使用`Rootless`机制，降低了`root`用户的权限，致使系统文件夹不可操作。可以参照《[苹果OSX 10.11关闭rootless内核保护教程 Mac关闭rootless教程][2]》将`Rootless`暂时关闭。

然而缺少的扩展千千万，每次都需要选择关闭`Rootless`，太过于麻烦。于是我选择抛弃`OS X`自带的`PHP`，使用`Homebrew`安装自己所需的`PHP`版本。

## 6 使用Homebrew安装PHP

在`OS X`下安装`Homebrew`的方法已在《[Mac下Nginx的安装和配置][3]》中提到，不再重复赘述。

关于`Homebrew`安装`PHP`在《[全新安装Mac OSX 开发者环境 同时使用homebrew搭建 PHP，Nginx ，MySQL，Redis，Memcache ... ... (LNMP开发环境)][4]》这篇文章页描述得十分清楚了，我在此记录一下我在安装的过程中踩的一些坑。

### 6.1 环境变量的变更

由于`OS X`中自带了`PHP`，所以我们用`Homebrew`安装了其它`PHP`版本后需要修改系统的环境变量，指定`PHP`的解析路径，由此来替代系统中自带的`PHP`。

因为对`OS X`系统还较为生疏，在查找资料的过程中有教程指引需要在`~/.bashrc`文件中添加一行：`export PATH="$(brew --prefix php56)/bin:$PATH"`。

根据该教程修改`PATH`后，`source`了一下`~/.bashrc`，再重新打开`php-fpm`，然而解析出的`PHP`依然是系统自带的版本。

发生这一错误是有两个原因：

 1. `export PATH="$(brew --prefix php56)/bin:$PATH"`仅指定了`PHP`的解析路径，由于我们大开的是`php-fpm`，需再添加一句`export PATH="$(brew --prefix php55)/sbin:$PATH"`来指定对应的`php-fpm`的解析路径；
 2. 因为我的系统中已经存在`~/.bash_profile`文件，所以将不再读取`~/.bashrc`文件，因此所有在`~/.bashrc`添加的配置信息都是无效的；
 
#### Mac OS X 环境变量文件加载顺序

`Mac`系统的环境变量，加载顺序为：

`/etc/profile` > `/etc/paths` > `~/.bash_profile` > `~/.bash_login` > `~/.profile` > `~/.bashrc`

若`~/.bash_profile`文件存在，则不再读取后面几个文件。


### 6.2 是否需要动态修改扩展配置？

在修改`php.ini`中的扩展配置前，先使用`php -m`命令`Show compiled in modules`。若列表中包含了所要添加的扩展名称，就无需在`php.ini`中打开扩展了。


# 参考资料

1. [《PHP安装扩展make install报错》][5]
2. [《mac下phpize报错Cannot find autoconf. Please check your autoconf installation解决方法》][6]
3. [《 CentOS 配置PHP支持socket扩展》][7]
4. 《[苹果OSX 10.11关闭rootless内核保护教程 Mac关闭rootless教程][8]》


  [1]: http://www.php.net/releases/
  [2]: http://www.pc6.com/edu/86809.html
  [3]: http://jalan.space/2017/01/12/mac-os-nginx/#homebrew
  [4]: https://segmentfault.com/a/1190000000606752
  [5]: https://segmentfault.com/q/1010000005643816/a-1020000005646074
  [6]: http://www.phperz.com/article/15/0102/42077.html
  [7]: http://blog.csdn.net/mecho/article/details/9046589
  [8]: http://www.pc6.com/edu/86809.html