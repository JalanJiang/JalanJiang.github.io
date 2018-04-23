---
title:       搭建 GitBook 并托管到 git pages
description: 我的第一本 Gitbook
date:       2018-04-22 15:41:00
categories:
    - 磨刀石
tags:
    - git
toc: true
---

在阅读《Linux Shell 脚本攻略（第2版）》时接触到了许多 Shell 命令，整理了一些博客。因为命令较多，整理出来的博客东一篇西一篇，时间跨度大，十分散乱。

无意中看到 [Gitbook](https://www.gitbook.com) 的安利，发现此类读书笔记用 Gitbook 进行记录与整理更为合适。

> GitBook 是一个基于 Node.js 的命令行工具，可使用 Github/Git 和 Markdown 来制作精美的电子书。

下面就聊一聊如何使用 Gitbook，并将结果展示到个人的 git pages 中。

**注：我安装的 Gitbook 版本为 3.2.3。**

## 搭建 Gitbook

网上的教程很多（例如 [Gitbook 入门教程](https://yuzeshan.gitbooks.io/gitbook-studying/content/)），这里就不多叙述了。主要说一些我踩到的坑。

### 插件安装

在 Gitbook 的根目录下创建 `book.json` 文件，写入相关插件的配置。

```
{
  ......
  
  "plugins": [
    "theme-comscore",
    "disqus"
  ],

  "pluginsConfig": {
    "fontSettings": {
      "theme": "sepia",
      "family": "serif",
      "size": 4
    },
    "disqus": {
      "shortName": "Jalan"
    },
    "theme-default": {
      "showLevel": true
    }
  },
  
  ......
  
}
```

配置好后直接在根目录下执行 `gitbook install` 就会进行相关插件的安装。有很多教程说要用 `npm` 进行安装，其实不需要。

可以在 [Gitbook 插件官网地址](https://plugins.gitbook.com/) 查找需要的插件，这里也有[常用插件](http://gitbook.zhangjikai.com/plugins.html)的详细介绍。

你也有可能遇到安装插件后插件失效的情况，例如插件 `multipart` 就是如此。由于 Gitbook 版本迭代太快，很多插件未及时维护不能适应当前版本。我们可以到插件的 git 项目中查看插件近况。

## 托管到 git pages

目前我的 git pages 下已经托管了我的个人博客，仓库名称为 `JalanJiang.github.io` （`username.github.io`），我可以通过 `http://jalanjiang.github.io` 来访问我的 git pages，因为我绑定了我的个人域名 [`http://jalan.space`](http://jalan.space)，所以直接用我的个人域名就可以进行访问了。

若要增加其他项目展示页，需要在其他项目中建立 `gh-pages` 分支。

### 为 Gitbook 项目创建新的 git 仓库

我创建了一个名为 `JalanJiang/Notes-On-Linux-Shell-Scripting-Cookbook` 的 git 仓库，把 Gitbook 项目的所有文件上传到 master 分支。

### gh-pages 分支的妙用

在我们执行 `gitbook build` 命令后，根据 Markdown 文档编译而成的前端静态文件会放置在 `_book` 目录当中。即 `_book` 就是我们需要展示的文件目录。

我们把 `_book` 目录下的文件上传到 `gh-pages` 分支当中。

```
git subtree push --prefix=_book origin gh-pages
```

上传成功后，就可以在 [`http://jalan.space/Notes-On-Linux-Shell-Scripting-Cookbook`](http://jalan.space/Notes-On-Linux-Shell-Scripting-Cookbook) 访问到这本 Gitbook 了~

#### git subtree 

用于实现一个仓库作为其他仓库的子仓库。

常用命令如下：

```
git subtree add   --prefix=<prefix> <commit>
git subtree add   --prefix=<prefix> <repository> <ref>
git subtree pull  --prefix=<prefix> <repository> <ref>
git subtree push  --prefix=<prefix> <repository> <ref>
git subtree merge --prefix=<prefix> <commit>
git subtree split --prefix=<prefix> [OPTIONS] [<commit>]
```

## 参考资料

* [如何用Github的gh-pages分支展示自己的项目](https://www.cnblogs.com/MuYunyun/p/6082359.html)
* [Gitbook 一键部署至 GitHub Pages](https://blog.csdn.net/simplehouse/article/details/78766513)
* [git subtree教程](https://segmentfault.com/a/1190000012002151)