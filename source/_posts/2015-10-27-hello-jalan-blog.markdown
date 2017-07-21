---
title:      Hello, Jalan's Blog
description:   如何使用 jekyll+github 搭建博客
date:       2015-10-27 19:25:00
categories:
    - 磨刀石
tags:
    - jekyll
---
# 导语

首先，感谢 [Hux-黄玄](http://huangxuan.me/)。

因为在知乎上看到Hux十分cool的jekyll博客，才打算自己着手搭建一个。从暑假庸碌至今，也终于写下了第一篇博文。

转眼已是大三汪，希望日后能用Blog更好地完个人知识梳理。

下面一起来看看jekyll博客搭建的方法吧~

# 正文

### 1.安装ruby

下载RubyInstallers并进行安装，安装时记得*add to path*
![install-ruby](/img/in-post/hello-jalan-blog/install-ruby.png)
安装完成后打开cmd窗口，输入：

```
ruby -v
```

可以查看是否安装成功。

### 2.安装development kit

下载和Ruby对应版本的DEVELOPMENT KIT并进行安装。安装结束后打开安装目录，目录如下：
![install-development-kit](/img/in-post/hello-jalan-blog/install-development-kit.png)
在该安装目录下执行：

```
ruby dk.rb
``

然后按照提示分别运行以下两条语句来增强ruby：

```
ruby dk.rb init
```

``
ruby dk.rb install
```

### 3.安装jekyll
在安装jekyll前先确保gem已正确安装
![install-jekyll-one](/img/in-post/hello-jalan-blog/install-jekyll-one.png)
确保gem安装后，开始安装jekyll gem
在命令行执行：

``
gem install jekyll
```

我在这一步的安装过程中遇到了错误：
![install-jekyll-one](/img/in-post/hello-jalan-blog/install-jekyll-two.png)

又需要镜像啦。该错误的解决方法是修改gem源地址（万恶墙）,在命令行输入：

```
gem source -r http://rubygems.org/
```

```
gem source -a http://ruby.taobao.org/
```

我们把它改成淘宝镜像就可以啦~
![install-jekyll-one](/img/in-post/hello-jalan-blog/install-jekyll-three.png)

### 4.安装pygments（可暂时不装）
pygments是python的组件。我们有部分组件依赖python，建议装上pygments。当然也可以不安装，不安装代码就无着色。


### 5.启动jekyll
执行：

```
jekyll new myblog
```

该命令会在当前目录下创建一个*myblog*目录，目录下是该网站的所有文件。

进入该目录：

```
cd myblog
```

在该目录下执行：

```
jekyll serve --watch
```

我在执行该语句是发生了如下错误：
![install-jekyll-one](/img/in-post/hello-jalan-blog/begin-jekyll.png)

这是因为在_post文件夹中使用了一个语法高亮插件。若要网站正常运行，需要删除_post文件夹中的文件。

还有一个解决办法是修改*_config.yml*中：

```
pyments:true
```

将"true"改为"false"。

但可能因为版本不同，我在我的*_config.yml*中没有找到这条语句。

# 结语

在使用jekyll+github建站的过程中学到了很多，jekyll/markdown/git……然而对于这些知识，我也只是进行了初浅的了解，还有许多明白得不透彻的地方。

我把在此过程中学习的内容总结在此博文中，今后也将继续坚持进行个人知识管理。也请大家监督我~


