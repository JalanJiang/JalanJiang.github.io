---
title:      从HTTP请求谈谈模拟登录教务处
description:   查成绩|查考场|查课表 轻松搞定
date:       2016-02-05 20:32:00
categories:
    - Web屠龙刀
tags:
    - PHP
---

# 导语

前一段时间开发一款时间管理App《Todo》时，需要在首页的日历表上添加考试与图书归还的日期，涉及到学生教务处和图书馆的个人信息获取。虽然之前也做过类似的数据接口，但还是趁这个机会再此做个总结。

图书馆与教务处的登录类似，这里以模拟登录教务处为例。

# 正文

## 1、获取账号、密码的提交地址

网页登录的流程近乎都是：用户填写表单--->用户提交表单--->服务端判断账号与密码是否匹配--->返回结果。因此，要想模拟用户的登录，首先要知道用户将表单信息提交至何处。

我们在教务处的登录处查看源码，找到**form**表单对应的**action**地址。

![action-url](/img/in-post/analog-login/action-url.png)

在图中我们可以看到，action所指向的URL是**http://59.77.226.32/logincheck.asp**。

## 2、有关 logincheck.asp 的请求

既然知道了表单提交的URL，那么进一步得，我们需要确认需要提交的数据有哪些，以及提交数据后的返回结果。

为方便查看HTTP请求，我在这里使用了FireFox的插件**Toggle HttpFox**。

### 2.1 http://59.77.226.32/logincheck.asp 的HTTP请求

向http://59.77.226.32/logincheck.asp提交表单后，得到HTTP请求信息如下：
![logincheck-http-request](/img/in-post/analog-login/logincheck-http-request.png)

在这一请求过程中POST的数据：
![logincheck-http-request-post-data](/img/in-post/analog-login/logincheck-http-request-post-data.png)

HTTP请求包括三部分：请求行（Request Line）、头部（Headers）和数据体（Body）。
	
我们对上图进行具体分析，顺便复习一下HTTP的请求格式：

<table>
	<tr>
		<td rowspan="2">请求行</td>
		<td>字段</td>
		<td>值</td>
		<td>字段含义</td>
		<td>具体说明</td>
	</tr>
	<tr>
		<td>Request-Line</td>
		<td>POST /logincheck.asp HTTP/1.1</td>
		<td>HTTP请求行。由请求方法（method）、请求网址（Request-URI）和协议（Protocol）构成。格式：Method Request-URI Protocol</td>
		<td>该请求请求方法为POST；请求网址：logincheck.asp协议：HTTP 1.1</td>
	</tr>
	<tr>
		<td rowspan="11">头部</td>
	</tr>
	<tr>
		<td>Host</td>
		<td>59.77.226.32</td>
		<td>对应网址URL中的Web名称和端口号</td>
		<td></td>
	</tr>
	<tr>
		<td>User-Agent</td>
		<td>Mozilla/5.0 (Windows NT 10.0; WOW64; rv:43.0) Gecko/20100101 Firefox/43.0</td>
		<td>客户浏览器名称</td>
		<td></td>
	</tr>
	<tr>
		<td>Accept</td>
		<td>text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8</td>
		<td>浏览器或其他客户可以接受的MIME文件格式（可以根据此返回适当的文件格式）</td>
		<td></td>
	</tr>
	<tr>
		<td>Accept-Language</td>
		<td>zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3</td>
		<td>浏览器可接受的语言种类</td>
		<td></td>
	</tr>
	<tr>
		<td>Accept-Encoding</td>
		<td>gzip, deflate</td>
		<td>浏览器可接受的编码方式</td>
		<td></td>
	</tr>
	<tr>
		<td>Referer</td>
		<td>http://jwch.fzu.edu.cn/</td>
		<td>产生请求的网页URL</td>
		<td></td>
	</tr>
	<tr>
		<td>Cookie</td>
		<td>ASPSESSIONIDQARDDQSQ=DHDPHHMCEAKPBCOJFPECGAEJ</td>
		<td>向服务器发送的Cookie</td>
		<td>Cookie名称：ASPSESSIONIDSCTDCQSR；Cookie值：DHDPHHMCEAKPBCOJFPECGAEJ</td>
	</tr>
	<tr>
		<td>Connection</td>
		<td>keep-alive</td>
		<td>告知服务器是否可以维持固定的HTTP连接。（HTTP/1.1使用Keep-Alive为默认值）</td>
		<td>Keep-alive:保持连接</td>
	</tr>
	<tr>
		<td>Content-Type</td>
		<td>application/x-www-form-urlencoded</td>
		<td>request的内容类型</td>
		<td></td>
	</tr>
	<tr>
		<td>Content-Length</td>
		<td>47</td>
		<td></td>
		<td></td>
	</tr>
	<tr>
		<td rowspan="5">数据体</td>
		<td>字段</td>
		<td>字段含义</td>
		<td>具体说明</td>
		<td>是否必须</td>
	</tr>
	<tr>
		<td style="color:red">muser</td>
		<td>账号</td>
		<td>即学生学号</td>
		<td>是</td>
	</tr>
	<tr>
		<td style="color:red">passwd</td>
		<td>密码</td>
		<td>教务处密码</td>
		<td>是</td>
	</tr>
	<tr>
		<td>x</td>
		<td>未知</td>
		<td></td>
		<td>否</td>
	</tr>
	<tr>
		<td>y</td>
		<td>未知</td>
		<td></td>
		<td>否</td>
	</tr>
</table>

### 2.2 http://59.77.226.32/logincheck.asp 的HTTP响应

HTTP响应信息如下：
![logincheck-http-response](/img/in-post/analog-login/logincheck-http-response.png)

HTTP响应由3个部分组成：协议状态版本代码描述、响应头（Response Header）和响应正文。

同样，我们也分析一下这一HTTP响应：

<table>
	<tr>
		<td rowspan="2">协议状态版本代码描述</td>
		<td>字段</td>
		<td>值</td>
		<td>字段含义</td>
		<td>具体说明</td>
	</tr>
	<tr>
		<td>(Status-Line)</td>
		<td>HTTP/1.1 <span style="color:red">302</span> Object moved</td>
		<td>协议状态代码描述</td>
		<td>协议：HTTP 1.1;返回码：302(通过不同的URI请求资源的临时文件)</td>
	</tr>
	<tr>
		<td rowspan="6">响应头</td>
	</tr>
	<tr>
		<td>Cache-Control</td>
		<td>private</td>
		<td>告知客户端如何控制相应内容缓存</td>
		<td></td>
	</tr>
	<tr>
		<td>Date</td>
		<td>Sat, 06 Feb 2016 06:37:34 GMT</td>
		<td>响应日期、时间</td>
		<td></td>
	</tr>
	<tr>
		<td>Content-Length</td>
		<td>189</td>
		<td>实体正文长度</td>
		<td></td>
	</tr>
	<tr>
		<td>Content-Type</td>
		<td>text/html</td>
		<td>指明发送给接收者的实体正文的媒体类型</td>
		<td></td>
	</tr>
	<tr>
		<td style="color:red">Location</td>
		<td>http://59.77.226.35/loginchk_xs.aspx?id=201626143734214&num=4432</td>
		<td>重定向接受者到一个新的位置</td>
		<td>服务端告知客户端应访问 http://59.77.226.35/loginchk_xs.aspx?id=201626143734214&num=4432 来获取新的资源</td>
	</tr>
	<tr>
		<td>响应正文</td>
		<td colspan="4">略</td>
	</tr>
</table>

### 2.3 提取重要信息

在请求和响应的信息中，我们可以提取出几个关键信息：

* 1、 必须提交的数据有
	
	muser:	  账号
	
	password：密码

* 2、 返回状态码为302
	
	这意味着我们要重定向到Location所指向的URL获取新的资源

## 3、有关重定向Location的请求
	
在向 http://59.77.226.32/logincheck.asp 请求后，我们得到了302状态码。

302重定向又称为302代表暂时性转移，需重定向到的网址在字段“Location”中给出，即 http://59.77.226.35/loginchk_xs.aspx?id=201626143734214&num=4432。

此处Http响应和请求的格式与上述相同，不再做具体分析。

### 3.1 HTTP请求信息：
![302-http-request](/img/in-post/analog-login/302-http-request.png)

### 3.2 HTTP返回信息：
![302-http-response](/img/in-post/analog-login/302-http-response.png)

### 3.3 提取重要信息

以上信息中，**Cookie**和向页面传输的**id**值十分重要（如上图红框标识），这两个字段都用于标识已登录用户。

## 4、举例：获取考场信息

用以上获取的Cookie和id值可以获取所有教务处的个人信息，例如课表、考场、成绩等。此处以获取考场为例。

登录教务处后，点击“我的考表”可查看个人考场信息。在HTTP查看工具中，我们可以看到，请求的地址是：http://59.77.226.35/student/xkjg/examination/exam_list.aspx?id=20162614373765992 。这里在url地址后用GET方式传递的id值就是3.2中获取的id值。

具体的HTTP请求信息如下：
![exam-list-http-request](/img/in-post/analog-login/exam-list-http-request.png)

其中的**id**和**Cookie**都是我们在步骤3中看到的。

## 5、总结

总而言之，登录获取数据的关键在于Cookie和id值的获取，有了这两个值就能尽情地获取页面数据啦~

![final-pic](/img/in-post/analog-login/final-pic.png)
