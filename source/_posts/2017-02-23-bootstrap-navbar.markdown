---
title:      Bootstrap之导航条总结
description:   Bootstrap组件之Navbar。
date:       2017-02-22 12:00:00
categories:
    - Web屠龙刀
tags:
    - Bootstrap
---

## 1 导航

Bootstrap 中的导航组件都依赖同一个 `.nav` 类，状态类也是共用的。

### 类名总结

 - 标签页：`.nav-tabs`
 - 胶囊式标签页：`.nav-pills`
 - 禁用链接：`.disabled`

### Demo展示

[Bootstrap导航Demo][1]

### Code

``` html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- 页面编码方式 -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width = device-width; initial-scale=1">

    <link href="/css/bootstrap.min.css" rel="stylesheet">

    <!-- Jquery -->
    <script src="/js/jquery.js"></script>
    <script src="/js/bootstrap.js"></script>
    <title>Bootstrap导航条</title>
</head>
<body>

<div class="container-fluid">
    <!-- 标签页 -->
    <ul class="nav nav-tabs">
        <li class="active"><a href="#">标签页</a></li>
        <li><a href="#">First</a></li>
        <li><a href="#">Second</a></li>
    </ul>

    <br>

    <!-- 胶囊式标签页 -->
    <ul class="nav nav-pills">
        <li class="active"><a href="#">胶囊式标签页</a></li>
        <li><a href="#">First</a></li>
        <li><a href="#">Second</a></li>
    </ul>

    <br>
    <!-- 标签页－下拉菜单 -->
    <ul class="nav nav-tabs">
        <li class="active"><a href="#">下拉菜单</a></li>
        <!-- 下拉列表 -->
        <li role="presentation" class="dropdown">
            <a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
                Dropdown <span class="caret"></span>
            </a>
            <ul class="dropdown-menu">
                <li><a href="#">下拉项目1</a></li>
                <li><a href="#">下拉项目2</a></li>
                <li><a href="#">下拉项目3</a></li>
            </ul>
        </li>
        <li><a href="#">Second</a></li>
    </ul>

    <br>

    <!-- 胶囊式标签页－下拉菜单 -->
    <ul class="nav nav-pills">
        <li class="active"><a href="#">胶囊式标签页</a></li>

        <li role="presentation" class="dropdown">
            <a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
                Dropdown <span class="caret"></span>
            </a>
            <ul class="dropdown-menu">
                <li><a href="#">胶囊下拉项目1</a></li>
                <li><a href="#">胶囊下拉项目2</a></li>
                <li><a href="#">胶囊下拉项目3</a></li>
            </ul>
        </li>

        <li><a href="#">First</a></li>
        <li><a href="#">Second</a></li>
    </ul>

</div>

</body>
</html>
```


## 2 导航条

### 设置导航条

 - 方法一：使用`<nav>`元素

``` html
<nav class="navbar navbar-default">
	<!-- 导航栏详细内容 -->
</nav>
```
 - 方法二：使用`<div>`元素，并设置`role="navigation"`属性

``` html
<div role="navigation">
	<!-- 导航栏详细内容 -->
</div>
```

### 类名总结

#### 元素

 - 表单：`.navbar-form`
 - 按钮：`.navbar-btn`
 - 文本：`.navbar-text`
 - 非导航链接：`.navbar-link`

#### 组件排列

 - 左对齐：`.navbar-left`
 - 右对齐：`.navbar-right`

#### 导航固定

 - 固定在顶部：`.navbar-fixed-top`
 - 固定在底部：`.navbar-fixed-bottom`
 - 静止在顶部：`.navbar-static-top`

#### 其它

 - 反色导航条：`.navbar-inverse`

### Demo展示

[Bootstrap导航条demo][2]

### Code

``` html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- 页面编码方式 -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width = device-width; initial-scale=1">

    <link href="../css/bootstrap.min.css" rel="stylesheet">

    <!-- Jquery -->
    <script src="../js/jquery.js"></script>
    <script src="../js/bootstrap.js"></script>
    <title>Bootstrap导航条</title>
</head>
<body>
<nav class="navbar navbar-default navbar-fixed-top navbar-inverse">
    <div class="container-fluid">
        <div class="navbar-header">
            <a class="navbar-brand" href="#">Bootstrap</a>
        </div>

        <div>
            <ul class="nav navbar-nav">
                <li class="active"><a href="#">起步</a></li>
                <li><a href="#">全局css样式</a></li>
                <li><a href="#">网站实例</a></li>
                <!-- 二级导航 -->
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                        下拉菜单
                        <b class="caret"></b>
                    </a>
                    <!-- 下拉列表 -->
                    <ul class="dropdown-menu">
                        <li><a href="#">jmeter</a></li>
                        <li><a href="#">EJB</a></li>
                        <li><a href="#">Jasper Report</a></li>
                        <li class="divider"></li>
                        <li><a href="#">分离的链接</a></li>
                        <li class="divider"></li>
                        <li><a href="#">另一个分离的链接</a></li>
                    </ul>
                </li>
            </ul>

            <p class="navbar-text">导航中的文本和<a class="navbar-link" href="#">链接</a></p>

            <!-- 搜索框 -->
            <form class="navbar-form navbar-left">
                <div class="form-group">
                    <input type="text" class="form-control" placeholder="Search">
                </div>
                <button type="submit" class="btn btn-default">搜索</button>
            </form>

            <ul class="nav navbar-nav navbar-right">
                <li><a href="#">右侧导航</a></li>
                <li><a href="#">右侧导航</a></li>
            </ul>
        </div>


    </div>

</nav>
</body>
</html>
```
## 3 路径导航

在一个带有层次的导航结构中标明当前页面的位置。

### Code

``` html
<ol class="breadcrumb">
  <li><a href="#">Home</a></li>
  <li><a href="#">Library</a></li>
  <li class="active">Data</li>
</ol>
```


## 参考资料

 1. [Bootstrap官方文档][3]


  [1]: /demo/bootstrap/nav/bootstrap-nav-demo.html
  [2]: /demo/bootstrap/nav/bootstrap-navbar-demo.html
  [3]: http://v3.bootcss.com/components/#nav