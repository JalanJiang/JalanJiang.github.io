---
title:      百度前端学院之——JavaScript基础
description:   万丈高楼平地起
date:       2015-10-27 19:25:00
categories:
    - Web屠龙刀
tags:
    - JavaScript
---

# 导语

暑假期间阅读了《JavaScript高级程序设计（第3版）》，结合百度前端学院的课程进行了练习。虽然在之前的项目中常使用`JavaScript`进行交互和`Ajax`数据请求，但在百度前端学院的任务实践中依旧感受到了自身基础的薄弱之处。看来在平时自学时，自身对知识框架的建立把握得还不够好，许多在项目中没有被应用到的知识点被有意无意地“荒废”。现在在这篇文章中纪录一下`JavaScript`任务中的部分知识点~

# 正文

## 1、`<script>`标签放在何处？

在创建第一个页面交互时，任务要求：

> 在这个页面的`</body>`前增加这么一段代码: `<script>alert("Hello World!");</script>`

我们使用`<script>`标签在HTML文件中添加`JavaScript`代码。理论上说，我们可以在HTML文件的任何位置加载`JavaScript`代码。

### 放在`<head>`部分

按照惯例，所有`<script>`元素都应该放在页面的`<head>`标签中，例如：

```
<html>
	<head>
		<title>Example Page</title>
		<script type="text/javascript" src="test.js"></script>
		<script type="text/javascript" src="test2.js"></script>
	</head>
	<body>
		<!-- 放置页面内容 -->
	</body>
</html>
```

这一做法的目的是把所有外部文件的引用都放在相同的地方，具有如下特点：

* 必须等待所有`JavaScript`代码下载、解析和执行后，才开始呈现页面内容

* 若`JavaScript`文件出现错误，页面元素无法加载

* 若`JavaScript`代码较多，则页面加载延迟、缓慢

### 放在`<body>`前

为了优化前端页面的显示，避免页面延迟、加载缓慢的现象，我们一般把全部`JavaScript`的引用放在`<body>`元素中，即页面内容的后面。

```
<html>
	<head>
		<title>Example Page</title>
	</head>
	<body>
		<!-- 放置页面内容 -->
		<script type="text/javascript" src="test.js"></script>
		<script type="text/javascript" src="test2.js"></script>
	</body>
</html>
```

这样一来，在解析`JavaScript`代码之前，页面的内容将完全呈现在浏览器中，让用户感觉打开页面的速度加快了。

**当然，如果你的`JavaScript`代码与页面显示的初始化有关，那就必须放在`<head>`中了。**

### 放在`</body>`后？

根据`HTML2.0`和`HTML5`的语法标准，在`</body>`后出现任何元素的开始标签都是`Parse error`。浏览器将忽略`</body>`标签的存在，将`</body>`后的所有内容视作`<body>`内。所以，在`</body>`后放置`<script>`和在`</body>`前放置`<script>`效果上是无区别的，但放置在`</body>`后是**不符合标准**的。

总而言之，将`<script>`标签放置在`</body>`后

* 不能带来任何好处

* 是不符合标准的

* 是你理解错了“将`<script>`标签放在页面最末端”这句话

## 2、数据类型及语言基础

### 2.1 判断各种数据类型

#### 判断是否为函数

这个任务比较简单，直接使用`typeof`**操作符**即可。

```
//	判断fn是否为一个函数，返回一个bool值
function isFunction(fn) {
	return typeof fn === "function";
}
```

#### 判断是否为数组

在判断数组时不能再简单地使用`typeof`操作符了，因为我们将收到一个"`object`"值，无法达到我们的目的。

```
var arr = new Array("1", "2", "3");
console.log(typeof(arr));	//object
```

因此我们使用`Object.prototype`上的原生方法`toString()`来判断数据类型。

```
//	判断arr是否为一个数组，返回一个bool值
function isArray(arr) {
	return object.prototype.toString.call(arr) == "[object Array]";
}
```

##### 关于`Object.prototype.toString()`的行为

1. 取得一个对象的内部属性`[[Class]]`

2. 依据这一属性，返回一个类似于"[`Object Array`]"的字符串作为结果

利用`Object.prototype.toString()`这一方法，再配合`call`，可以取得任何对象的内部属性`[[Class]]`，并转化为字符串进行比较吗，最终达到类型检测的目的。

### 2.2 值类型和引用类型的区别

在ECMAScript中，变量可以存在两种类型的值，即**原始值**和**引用值**。

#### 原始值

存储在**栈**(`stack`)中的简单数据段，值直接存储在变量访问的位置。 

ECMAScript 有 5 种原始类型（primitive type），即 Undefined、Null、Boolean、Number 和 String。

#### 引用值

存储在**堆**(`heap`)中的对象。存储在变量处的值是一个**指针**(`point`)，指向存储对象的内存处。

![how-g-come-2](/img/in-post/baidu-ife/javascript/stack-heap.gif)

#### 深度克隆的实现

##### 克隆的概念：

* 浅度克隆：原始类型为值传递，对象类型仍为引用传递。

* 深度克隆：所有元素或属性完全复制，与原对象完全脱离。即**所有对于新对象的修改都不会反映到原对象中**。

既然对象分为这两类，这两种类型在复制克隆的时候是有很大区别的。原始类型存储的是对象的**实际数据**，而对象类型存储的是对象的**引用地址**。

在克隆时使用循环后，为了保证对象的所有属性都被复制到，若得到的元素仍是`Object`或`Array`，需要再次循环。

```
//	判断变量数据类型
function returnClass(ob) {
	if(ob == null) return 'NULL';
	if(ob == undefined) return 'Undefined';
	return Object.prototype.toString.call(ob).slice(8, -1);
}

// 使用递归来实现一个深度克隆，可以复制一个目标对象，返回一个完整拷贝
// 被复制的对象类型会被限制为数字、字符串、布尔、日期、数组、Object对象。不会包含函数、正则对象等
function cloneObject(src) {
	var result;
	var srcClass = returnClass(src);

	if(srcClass == 'Object') {
		result = {};
	} else if {
		result = [];
	} else {
		return src;
	}

	for(key in src) {
		var copy = src[key];
		var copyClass = returnClass(copy);

		if(copyClass == 'Object') {
			result[key] = arguments.callee(copy);
		} else if(copyClass == 'Array') {
			result[key] = arguments.callee(copy);
		} else {
			result[key] = src[key];
		}
	}

	return result;
}
```

### 2.3 数组去重

要求对数组进行去重操作，只考虑数组中元素为数字或字符串，返回一个去重后的数组。我想了三种算法。

#### 方法一

开辟一个新数组`result[]`用于存放最终结果。将需要去重的数组`arr[]`与`result[]`循环比较，把未在`result[]`中出现的元素压入`result[]`数组即可。
