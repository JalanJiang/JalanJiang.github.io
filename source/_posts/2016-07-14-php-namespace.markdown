---
title:      "PHP命名空间"
description:   我在你的可见范围内吗？
date:       2016-07-14 19:00:00
categories:
    - Web屠龙刀
tags:
    - PHP
---

# 前言

由于暑期实习的原因，要接触新的框架。之前也使用过`ThinkPHP`和`Laravel`之类的PHP框架，但对命名空间的使用都没有深入研究。既然出来实习了，一切都从最基础的开始吧~现对PHP的命名空间做一个总结。

为方便起见，在下文中，空间中的常量、函数、类均称为“元素”。

----------

# 正文

----------

## 命名空间

----------

### 什么是命名空间？


**命名空间（英语：`Namespace`）表示标识符（`identifier`）的可见范围。**

一个标识符可在多个命名空间中定义，它在不同命名空间中的含义是互不相干的。这样，在一个新的命名空间中可定义任何标识符，它们不会与任何已有的标识符发生冲突，因为已有的定义都处于其它命名空间中。

简单说来**命名空间是为了解决不同库在同一个环境下使用时出现的命名冲突**。例如我自己有一个函数名叫A，但是系统已经有一个A函数了，那就会出现冲突。

----------


### 为什么PHP中要使用命名空间？

`PHP`从`5.3`版本开始引入命名空间。假设如果不使用命名空间，那么每个类在一个项目中的名字就必须是固定的。因为PHP在`new`的时候不管是调用`autoload`还是调用已加载过的类，都存在一个类名对应的文件。所以在不使用命名空间的时候，我们会想各种命名规则来区分不同的类，比如：`project1_school1_class1_Student`或者`project2_school_class_Student`。

引入命名空间之后就可以将这个有效规避了，一个`namespace`就**相当于对应一个文件路径**，查找这个类的时候，就会去对应的文件路径查找类定义文件了。

----------

### 如何使用命名空间？

创建命名空间使用关键字：`namespace`

使用命名空间使用关键字：`use`

----------

#### 1 常量

在命名空间里，`define`的作用是全局的，`const`仅作用于当前空间。

----------

#### 2 创建命名空间

 - 创建一个命名空间需要使用`namespace`关键字
 - 第一个命名空间前面不能有任何代码
 - 一个脚本文件可以创建多个命名空间



----------

#### 3 在不同空间之间直接调用其它元素

关键词：`\空间名\元素名`

    <?php
    //  创建一个名为Article的命名空间
    namespace Atrticle;
    //  Comment属于Article空间的类
    class Comment
    {
        //  Class Comment body
    }
    
    //  创建一个名为MessageBoard的命名空间
    namespace MessageBoard;
    //  此Comment属于MessageBoard空间的类
    class Comment
    {
        //  Class Comment body
    }

----------

#### 4 子空间

我们可以自定义子空间来描述各个空间之间的关系。子空间可定义很多层级，例如：`Blog\Article\Archives\Date`

    <?php
        //  表示处于Blog下的Article模块
        namespace Blog\Article;
        class Comment
        {
            //  Class Comment body
        }
        
        //  表示处于Blog下的MessageBoard模块
        namespace Blog\MessageBoard;
        class Comment
        {
            //  Class Comment body
        }
        
        //  调用当前空间的类
        $comment = new Comment();
        //  调用Blog\Article空间的类
        $articleComment = new \Blog\Article\Comment();
    ?>

----------

#### 5 公共空间

关键词：`\元素名`

我们创建一个名为`comment_inc.php`的脚本文件，脚本中有一些常用的函数和类。

    <?php
        function getIP()
        {
            //  function getIP body
        }
        
        class FilterXSS
        {
            // function FilterXSS body
        }
    ?>
    
我们在一个命名空间里引入该脚本，脚本里的元素不会归属到这个命名空间。**如果这个脚本没有定义其他的命名空间，则它的元素始终处于公共空间**。PHP自带的元素也处于公共空间。

    <?php
        namespace Blog\Article;
        //  引入脚本文件
        include './common_inc.php';
        //  出现致命错误，找不到Blog\Article\FilterXSS类
        $filterXSS = new FilterXSS();
        //  正确 \元素名
        $filterXSS = new \FilterXSS();
    ?>

调用公共空间的方式：直接在元素名称前加入`\`即可，若不加入`\`，`PHP`解析器会认为用户想调用当前空间下的元素。但为了正确区分元素，建议调用时还是加上`\`。

----------

#### 6 名称术语

关于空间有三种名称术语：

**1.非限定名称**

或称作**不包含前缀的类名称**。

例如：

    $comment = new Comment();

如果当前命名空间是`Blog\Article`，`Comment`将被解析为`Blog\Article\Comment`。

如果使用Comment的代码不包含在任何命名空间中的代码（处于全局空间中），则`Comment`会被解析为Comment。

**2.限定名称**

或称作**包含前缀的名称**。

例如：

    $comment = new Article\Comment();

如果当前的命名空间是`Blog`，则`Comment`会被解析为`Blog\Article\Comment`。

如果使用`Comment`的代码不包含在任何命名空间中的代码（全局空间中），则`Comment`会被解析为`Comment`。

**3.完全限定名称**

或称作**包含了全局前缀操作符的名称**。

例如：

    $comment = new \Article\Comment();

在这种情况下，`Comment`总是被解析为代码中的文字名(`literal name`)`Article\Comment`。

为了方便理解，我们可以把这三种名称类进行类比：

 - 非限定名称（不包含前缀的类名称）=>文件名（`comment.php`）
 - 限定名称（包含前缀的名称）=>相对路径名（`./article/comment.php`）
 - 完全限定名称（包含了全局前缀操作符的名称）=>绝对路径名（`/blog/article/comment.php`）

----------

#### 别名和导入

关键词：`use`

调用命名空间元素的快捷方式。通过`use`操作符实现。

    <?php
        namespace Blog\Article;
        class Comment
        {
            //  Class Comment body
        }
        //  创建BBS命名空间
        namespace BBS;
        //  导入一个命名空间
        use Blog\Article;
        //  导入命名空间后使用限定名称调用元素
        $articleComment = new Article\Comment();
        //  为命名空间使用别名
        use Blog\Article as Arte;
        //  使用别名代替空间名
        $articleComment = new Arte\Comment();
        //  导入一个类
        use Blog\Article\Comment;
        //  导入类后使用非限定名称调用元素
        $articleComment = new Comment();
        //  为类使用别名
        use Blog\Article\Comment as Comt;
        $articleComment = new Comt();
    ?>

----------

#### 动态调用

`PHP`提供了`namespace`关键字和`__NAMESPACE__`魔法常量动态的访问元素。

`__NAMESPACE__`可以通过组合字符串的形式来动态访问。

    <?php
        namespace Blog\Article;
        const PATH = '/Blog/article';
        class Comment
        {
            //  class Comment body
        }
        //  namespace关键字表示当前空间
        echo namespace\PATH;    //  Blog/article
        $comment = new namespace\Comment();
        //  魔法常量__NAMESPACE__的值是当前空间名称
        echo __NAMESPACE__;
        //  可以组合成字符串并调用
        $commentClassName = __NAMESPACE__.'\Comment';
        $comment = new $commentClassName();
    ?>

**字符串形式调用的问题**：

 1. 使用双引号的时候特殊字符可能被转义
 2. 不会认为是限定名称

----------

## 参考资料

 - [《PHP手册：命名空间》](http://php.net/manual/zh/language.namespaces.php)
 - [《PHP命名空间》](http://www.cnblogs.com/phpfans/p/3785268.html)
