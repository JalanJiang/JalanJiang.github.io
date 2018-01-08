---
layout:     post
title:      "Python 爬虫之初体验：urllib 与 BeautifulSoup 的配合"
description:   "初见网络爬虫"
date:       2018-01-07 12:00:00
categories:
    - Web屠龙刀
tags:
    - Python
    - 网络爬虫
toc: true
---

# urllib

urllib 是 Python 的标准库（不需要额外安装就可引入），包含功能：

- 网络请求数据
- 处理 cookie
- 改变请求头
- 改变用户代理
- ……

```
from urllib.request import urlopen

url = "https://en.wikipedia.org/wiki/Kevin_Bacon"
# urlopen 用来打开并读取一个从网络获取的远程对象
html = urlopen(url)
```

# BeautifulSoup

BeautifulSoup 不是 Python 标准库，需要单独安装：

```
pip install beautifulsoup4
```

它通过定位 HTML 标签来格式化和组织复杂的网络信息，用 Python 对象来展现 XML 结构信息。（就是用来解析爬取到的数据的）

```
from urllib.request import urlopen
from bs4 import BeautifulSoup
import re

url = "https://en.wikipedia.org/wiki/Kevin_Bacon"#维基百科
html = urlopen(url)
bsObj = BeautifulSoup(html, "lxml") #需设置默认解析器为lxml
bsObj.find("div", {"id": "bodyContent"}).findAll("a", {"href": re.compile("^(/wiki/)((?!:).)*$")})
 ……
```

## find() 与 findAll()

```
findAll(tag, attributes, recursive, text, limit, keywords)

find(tag, attributes, recursive, text, keywords)
```

### tag

传入单个标签名称 或 多个标签组成的 list。

```
.findAll("a")

.findAll({"h1","h2","h3","h4","h5","h6"})
```

### attributes

用 Python 字典封装若干属性及对应的属性值。

```
.findAll("span", {"class": {"green". "red"}})
```

### recursive

递归参数，是一个 bool 变量。默认为 True。

- True：检查标签的所有子标签
- False：只查找文档的一级标签

### text

文本参数。使用标签的文本内容进行匹配，而非用标签匹配。

```
.findAll(text = "test")
```

### limit

范围限制参数，设置后只返回前 x 项结果。

### keyword

可以选择具有指定属性的标签。

```
.findAll(id = "test")
```

效果与下面这种书写方式相同。

```
.findAll("", {"id": "test"})
```

## 产生的对象

- BeautifulSoup对象

```
html = urlopen(url)
bsObj = BeautifulSoup(html, "lxml") #需设置默认解析器为lxml
```

- 标签 Tag 对象
	- 通过 `find()` 和 `findAll()` 产生
	- 直接调用子标签获取的一列对象或单个对象 `bsObj.div.h1`
- NavigableString 对象（不常用）
	- 用于表示标签里的文字
- Comment 对象（不常用）
	- 用来查找 HTML 文档的注释标签 `<!-- 注释内容 -->`

# 一段简单的爬虫

不断爬取 wiki 页面内的站内链接。

```
#!/usr/bin/python
# -*- coding:utf-8 -*-

from urllib.request import urlopen
from bs4 import BeautifulSoup
import re

url = "https://en.wikipedia.org/wiki/Kevin_Bacon"#维基百科
html = urlopen(url)
bsObj = BeautifulSoup(html, "lxml") #需设置默认解析器为lxml

#声明一个集合放置新页面
pages = set()
def getLinks(articleUrl):
    html = urlopen("http://en.wikipedia.org" + articleUrl)
    bsObj = BeautifulSoup(html, 'lxml')

    try:
        print(bsObj.h1.get_text())
        print(bsObj.find(id="mw-content-text").findAll("p")[0])
        print(bsObj.find(id="ca-edit").find("span").find("a").attrs['href'])
    except AttributeError:
        print("页面缺少属性")

    for link in bsObj.find("div", {"id": "bodyContent"}).findAll("a", {"href": re.compile("^(/wiki/)((?!:).)*$")}):
        if 'href' in link.attrs:
            if link.attrs['href'] not in pages:#遇到新页面
                newPage = link.attrs['href']
                print("--------------------\n"+newPage)
                pages.add(newPage)
                getLinks(newPage)

links = getLinks("/wiki/Kevin_Bacon")
```

# 踩坑记录

## 无法加载 BeautifulSoup

在初次使用 BeautifulSoup ，运行文件时报错如下：

```
ImportError: cannot import name BeautifulSoup
```

系统提示无法引入 BeautifulSoup 库，一开始以为是未安装 bs4 或路径有误。最后发现问题在于我将该脚本命名为了 `bs4.py`。

在执行文件的当前目录下，若有一个名为 `bs4.py` 的文件，Python 运行当前文件时会在该文件目录下进行搜索，先导入该 `bs4.py` 文件。而 `bs4.py` 文件肯定不存在 BeautifulSoup ，所以不断报错。

注：**切勿在当前搜索路径中，将文件命名为已有库、模块相同的名字**

# 参考资料

- [《Python网络数据采集》](https://book.douban.com/subject/26740503/)
