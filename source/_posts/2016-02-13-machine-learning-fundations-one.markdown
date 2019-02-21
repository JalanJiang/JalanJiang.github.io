---
layout:     post
title:      《机器学习基石》笔记——第一讲：Learning Problem
description: When Can Machine Learn?
date:       2016-02-13 13:03:00
categories:
    - 技多不压身
tags:
    - 机器学习
---

# 导语

这门课是在著名的MOOC(Massive Online Open Course 大型在线公开课)Coursera上的一门关于机器学习领域的课程，由国立台湾大学的林轩田老师讲授。《机器学习基石》共8周课程，是整个机器学习课程的上半部分，主要分为四大部分讲授：

* When can Machine Learn?       	在何时可以使用机器学习？
* Why can Machine Learn?        	为什么机器可以学习？
* How can Machine Laarn?        	机器可以怎样学习？
* How can Machine Learn Better?		怎样能使机器更好地学习？

大二寒假曾对人脸识别算法做过小研究，上学期也接触了《人工智能》课程，都涉及到机器学习的一些知识。因此，想趁这个寒假的机会对这一领域再做一些了解。这也是我第一次学习MOOC课程，希望最终可以顺利完成~

目前已经听讲到第二周的课程，现在此整理一下第一周的课堂笔记。

# 正文

## 1、Course Introduction
这门课程是：

> foundation oriented and story-like

林轩田老师将从基础点切入、像讲故事一样授课。但并不意味着这门课十分容易。

> 基石不是基础，而是必须要先学会的东西。

## 2、What is Machine Learning?

### 2.1 什么是学习？

学习是**人或动物通过观察思考获得一定技巧的过程**。

> With experience accumulated from observations.
![what-is-learning](/img/in-post/machine-learning-fundations/one/what-is-learning.png)

### 2.2 什么是机器学习？

机器学习是**计算机通过资料和计算获得技巧的过程**。

也就是说，我们把“学习”这一过程的主体——“人”，替换成“计算机”，那么这样的学习就是“机器学习”。

> With experience accumulated/computed from data.
![what-is-machine-learning](/img/in-post/machine-learning-fundations/one/what-is-machine-learning.png)

### 2.3 什么是技巧？

技巧是**某种表现的增进**。

> Improve some performance measure.
![what-is-skill](/img/in-post/machine-learning-fundations/one/what-is-skill.png)


### 2.4 机器学习的应用方向？

机器学习可能会有如下方向的应用：

**1.When human cannot program the system manually.**

* 当人们面对未知领域，不知晓如何设定规则时，需要机器通过学习和环境互动来获得更好的表现。
例如：探测火星的机器人。

**2.When human cannot define the solution easily.**

* 当人们不懂如何写出规则时。例如：声音识别。

**3.When needing rapid decisions that human cannot do.**

* 当需要人们无法做出的快速抉择时。例如：high-frequency trading.

**4.When needing to be user-oriented in a massive scale.**

* 当需要对用户进行个性化设计时。例如：consumer-targeted marketing.

### 2.5 何时适合使用机器学习？

机器学习的**三个关键**：

**1.exits some 'underlying pattern' to be learned.**

* 存在一个可增进的表现，可以让我们对其进行提高。

**2.but no programmable(easy) definition.**

* 不知道如何定义规则/不容易定义规则

**3.somehow there is data about the pattern.**

* 拥有可用的资料

## 3、Applications of Machine Learning?

林轩田老师从食、衣、住、行、育、乐六个领域介绍了机器学习的应用，算是对机器学习应用的一个初步了解。教育和娱乐领域的例子十分Cool，我确实也从中受到了启发。

### 3.1 Food 

从社交网络获取餐厅的信息：干净与否？是否好吃？

* Data: Twitter data( words + location ) 
* Skill: tell food poisoning likeliness of restaurant properly

### 3.2 Clothing 

推荐顾客好看的衣服穿搭

* Data: sales figures + client surveys
* Skill: give good fashion recommendations to clients

### 3.3 Housing 

计算房子的能源消耗。通过已盖过房子的特征学习、预测。

* Data: characteristics of buildings and their energy load
* Skill: predict energy load of other building closely

###	3.4 Transportation 

辨别信号灯、交通号等。

* Data: some traffic sign images and meanings
* Skill: recognize traffic signs accurately

###	3.5 Education 

从学生答题的历史纪录判断学生的学习程度，下道题是否会答对？

* Data: students' records on quizzes on a Math tutoring system
* Skill: predict whether a student can give a correct answer to another quiz question
* How: Answer correctly = [recent **strength** of student>**difficulty** of question]
* Data: Give ML 9 million records from 3000 students. ML determines (reverse-engineers) strength and difficulty automatically.
		
###	3.6 Entertainment 

推荐给使用者他们喜欢的电影。

* Data: how many users have rated some movies
* Skill: predict how a user would rate an unrated movie
* Pattern: **Rating  <-- viewer/movie factors**

## 4、Components of Machine Learning(重点)

机器学习的组成是这一讲的重点，之后的课程也将在这一小节的基础上展开。

### 4.1 机器学习的理论应用符号

先从一个例子开始，了解一下机器学习的理论应用符号。

**举例**：银行判断是否要给办理信用卡的顾客下发信用卡？

1. **输入**（Input）: x∈*X*（代表银行所拥有的用户信息）；

2. **输出**（Output）: y∈*Y*（代表办理信用卡后的结果：好或坏）；

3. **未知函数/目标函数**（Unknown pattern to be learned/target function）:f: *X*-->*Y*(代表理想的信用卡发放公式) ；

4. **资料**（Data），即训练样本（training examples） : D = {(x1, y1), (x2, y2), …, (xN,yN)} （代表存在银行中的n笔资料）；

5. **假说**（Hypothesis），即希望能被更好改进的技能（skill with hopefully good performance）:
g: *X*-->*Y*('learned' formula to be used)。我们希望函数g表现的很好。机器学习最终得到g，用g来衡量是否给未来的顾客信用卡。

### 4.2 机器学习流程

用一张简单的图来表示机器学习的流程：

> ![how-g-come](/img/in-post/machine-learning-fundations/one/how-g-come.png)

从上图可以看出，机器学习就是从我们**未知的公式f**中得到大量的**资料**（Data），再在这些资料的基础上，得到一个**近似于f的g**。

虽然我们不知道有关的规则（pattern）f，但是我们能利用所拥有资料（Data），通过Machine Learning来总结出g。

***

但对于未知的目标函数f，如何得出一个与之相像的g？

我们用一张更为详细的图来说明:

> ![how-g-come-2](/img/in-post/machine-learning-fundations/one/how-g-come-2.png)

在上图中我们将简略图中的“ML”详细定义为“Learning algorithm（机器学习算法）”，简称A；并引入一个新项*H*。

**关于*H*（Hypothesis Set）：**

* *H*称做“假设的集合”（Hypothesis Set）,可以包含好的假设、坏的假设；

* 例如：h1: 月薪 > 8,000; h2: 欠债 > 100,000……

此时，*A*的作用就是**从*H*中挑选**出最接近目标函数f的g。

### 4.3 机器学习模型（Learning Model）的定义

**机器学习模型 = 算法（*A*） + 假设空间（*H*）**

> Learning model = *A* and *H* 

## 5、Machine Learning and Other Fields

### 5.1 Machine Learning & Data Mining 

机器学习与资料勘探

| Machine Learning(ML)                                          | Data Mining(DM)                               |
| :-----------------------------------------------------------: |:---------------------------------------------:| 
| 使用资料产生假设，希望最终得到的假设g可以和目标函数f相似      | 用资料发现一些有趣/有用的事（在意的不是预测） | 

如果资料勘探得到的结果中“有趣的事”和机器学习的目标函数f相似，那么机器学习和资料勘探就没有什么不同了。因此，这两个领域是密不可分的。

### 5.2 Machine Learning & Artificial Intelligence 

机器学习和人工智能

| Machine Learning(ML)                                          | Artificial Intelligence(AI)                   |
| :-----------------------------------------------------------: |:---------------------------------------------:| 
| 使用资料产生假设，希望最终得到的假设g可以和目标函数f相似      | 用计算机完成某些能够体现“智能”的行为          | 

然而，要使得g ≈ f（计算机会预测）显然是一件十分智能的事。所以，**机器学习是实现人工智能的一种方法**。 

### 5.3 Machine Learning & Statistics 

机器学习和统计

| Machine Learning(ML)                                          | Statistics                                    |
| :-----------------------------------------------------------: |:---------------------------------------------:| 
| 使用资料产生假设，希望最终得到的假设g可以和目标函数f相似      | 用数据推论未知的结果（如:丢硬币正反面的概率） | 

而在机器学习中，g是推论的结果，f是未知的事情。所以，**统计是实现机器学习的一种方法**。统计学的许多工具也都可以用于机器学习。

# 总结

通过这一周的课程，可以给机器学习一个更准确的定义：
	
**通过数据来计算得到一个假设g使它来接近未知的目标函数f。**

正如林轩田老师所说的：

> 机器学习是教计算机钓鱼而不是给计算机鱼吃。