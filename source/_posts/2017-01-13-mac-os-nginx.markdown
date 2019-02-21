---
title:      Mac下Nginx的安装和配置
description:   耶！第一台Mac！
date:       2017-01-12 20:25:00
categories:
    - 磨刀石
tags:
    - PHP
    - Nginx
---

#  前言

之前我的`PHP`开发都在`WAMP`环境下完成，由于这次工作环境变更为`Mac OS`，公司使用的服务器又是`Nginx`，于是打算把自己的开发环境变为`NMP`。了解和学习`Nginx`，首先从搭建环境开始。

# 正文


## 安装Homebrew

[`Homebrew`][1]是`Mac OS`下的套件管理器。


  获取`Homebrew`十分简单，只需要如下一行代码即可：
  

``` nginx
  /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

`Homebrew`常用的命令有：

``` vim
# 搜索软件
brew search wget 
# 安装软件
brew install wget
# 卸载软件
brew remove wget
```

## 安装Nginx

安装`Homebrew`成功后，可使用`Homebrew`进行`Nginx`的安装：

``` nginx
brew install nginx
```

安装成功后，可以通过 `nginx -v` 来查看`nginx`的版本。

![查看nginx版本][2]

## 配置Nginx

进入`/usr/local/etc/nginx/`文件夹，打开`nginx.conf`文件：

``` stata
cd /usr/local/etc/nginx/
sudo vim nginx.conf
```

对 `/usr/local/etc/nginx/nginx.conf`文件进行配置：

``` nginx
# 在配置文件的顶级main部分，代表worker角色的工作进程的个数
worker_processes  1;

# 错误日志
error_log       /usr/local/var/log/nginx/error.log warn;

# 进程文件
pid        /usr/local/var/run/nginx.pid;

events {
    # 写在events部分。每一个worker进程能并发处理（发起）的最大连接数
    worker_connections  256;
}

http {
    # 文件扩展名与文件类型映射表
    include       mime.types;
	
	# 设定默认文件类型
    default_type  application/octet-stream;

    # 为Nginx服务器设置详细的日志格式
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';
    
	#access log 记录了哪些用户，哪些页面以及用户浏览器、ip和其他的访问信息
	# access log 路径
    access_log      /usr/local/var/log/nginx/access.log main;
	
	# 如果port_in_redirect为off时，那么始终按照默认的80端口；如果该指令打开，那么将会返回当前正在监听的端口。
    port_in_redirect off;
	
	# 开启高效文件传输模式，sendfile指令指定nginx是否调用sendfile函数来输出文件，对于普通应用设为 on，如果用来进行下载等应用磁盘IO重负载应用，可设置为off，以平衡磁盘与网络I/O处理速度，降低系统的负载。注意：如果图片显示不正常把这个改成off。
    sendfile        on;
	# 配置信息文件夹
    include /usr/local/etc/nginx/conf.d/*.conf;

}
```

我们把对`server`的配置统一放置在`/usr/local/etc/nginx/conf.d/`文件夹中。

首先先在`/usr/local/etc/nginx/`文件夹下创建`conf.d`文件夹：

``` stata
cd /usr/local/etc/nginx/
sudo mkdir conf.d
```

再在文件夹`conf.d`创建默认配置文件`default.conf`：

``` stata
cd conf.d
sudo vim default.conf
```

对`default.conf`进行配置：

``` nginx
# 虚拟主机配置
server {
    # 监听端口
    listen       80;
	# 域名设定，可以有多个
    server_name  localhost;

    root /Users/www/test/; # 该项要修改为你准备存放相关网页的路径

    location / {
	    # 定义路径下默认访问的文件名
        index index.php;
		# 打开目录浏览功能，可以列出整个目录
        autoindex on;
    }

    #proxy the php scripts to php-fpm
    location ~ \.php$ {
		# fastcgi配置
        include /usr/local/etc/nginx/fastcgi.conf;
		# 指定是否传递4xx和5xx错误信息到客户端
        fastcgi_intercept_errors on;
		# 指定FastCGI服务器监听端口与地址，可以是本机或者其它
        fastcgi_pass   127.0.0.1:9000;
    }

}
```

`Nginx`默认监听的端口是8080，在这里我把它改成监听80端口。配置的虚拟主机指向`/Users/www/test/`目录，我在这个目录下新建了一个`PHP`文件，用来测试`Nginx`是否已配置成功。

``` vim
cd /Users/www/test/
sudo vim index.php
```

`index.php`内容：

``` php
<?php
echo 'hello meitu!';
?>
```

配置结束后重启`Nginx`：

``` bash
sudo nginx
sudo nginx -s reload
```

访问刚刚所配置的`localhost`域名：

![enter description here][3]

访问到`index.php`文件，配置成功啦。

# 参考文章

[《Mac OSX 10.9搭建nginx+mysql+php-fpm环境》][4]

[《 Nginx中的server_name_in_redirect和port_in_redirect指令》][5]

[《（总结）Nginx配置文件nginx.conf中文详解》][6]

[《Nginx怎么打开目录浏览功能(autoindex)》][7]


  [1]: http://brew.sh/index_zh-cn.html
  [2]: /img/in-post/mac-os-nginx/nginx-v.jpg
  [3]: /img/in-post/mac-os-nginx/view-localhost.jpg
  [4]: https://my.oschina.net/chen0dgax/blog/190161
  [5]: http://blog.csdn.net/weiyuefei/article/details/38556593
  [6]: http://www.ha97.com/5194.html
  [7]: http://www.php100.com/html/program/nginx/2013/0905/5550.html