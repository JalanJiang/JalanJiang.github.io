---
title:      matlab学习记录
description:   Matrix & Laboratory
date:       2016-11-28 20:20:00
categories:
    - 技多不压身
tags:
    - matlab
---

# 前言

在毕业实习项目高光谱图像解混中，需要使用Matlab语言来编写解混算法。我在之前的学习过程中也尚未接触过Matlab平台的开发，算是一个入门新手。借此机会也对学习过程遇到的知识点稍作记录。

# 正文

## 一、冒号的用法

### 1、表示该维度上的所有元素

对于矩阵来说，冒号表示该维度上的所有元素。

例如：

矩阵A = ![title](https://leanote.com/api/file/getImage?fileId=583c39fcab644137810193e8)

$$
 \left[
 \begin{matrix}
   1 & 2 & 3 \\
   4 & 5 & 6 \\
   7 & 8 & 9
  \end{matrix}
  \right] \
$$

A(1, :1)表示矩阵A的第一行。

则 A(1, :1) =![title](https://leanote.com/api/file/getImage?fileId=583c3a0bab644137810193ec)(https://leanote.com/api/file/getImage?fileId=583c3a08ab644137810193e9)

$$
 \left[
 \begin{matrix}
   1 & 2 & 3
  \end{matrix}
  \right] \
$$

### 2、进行矩阵定义

Matlab定义矩阵的一种方法是：

    A = s:d:f

其中：

 - s:表示起始值；
 - d:表示增量；
 - f:表示终点

若矩阵A = ![title](https://leanote.com/api/file/getImage?fileId=583c39edab644137810193e6)

$$
 \left[
 \begin{matrix}
   1 & 2 & 3 & 4 & 5 \\
   4 & 5 & 6 & 7 & 8 \\
   0 & 1 & 4 & 7 & 8 \\
   0 & 2 & 5 & 8 & 7 \\
  \end{matrix}
  \right] \
$$

则 A(2:3, 1:2:5)表示：矩阵A的第二行与第三行的第一、三、五列。

### 3、将矩阵转换为列向量

A(:)表示把矩阵的元素按列的顺序变为一列，即矩阵转换为列向量。

例如：

矩阵A = ![title](https://leanote.com/api/file/getImage?fileId=583c3a13ab644137810193ed)

$$
 \left[
 \begin{matrix}
   3 & 4 & 2 \\
   1 & 5 & 3 \\
   4 & 7 & 1
  \end{matrix}
  \right] \
$$

则 A(:) = ![title](https://leanote.com/api/file/getImage?fileId=583c3a1eab644137810193f5)

$$
 \left[
 \begin{matrix}
   3\\
   1\\
   4\\
   4\\
   5\\
   7\\
   2\\
   3\\
   1
  \end{matrix}
  \right] \
$$


 
