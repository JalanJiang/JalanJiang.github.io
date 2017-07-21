---
layout:     post
title:      基于三级小波变换的数字水印算法
description:  Digital Image Watermarking Using 3 level Discrete Wavelet Transform.
date:       2017-06-27 15:25:00
categories:
    - 技多不压身
tags:
    - 图像处理
---

# 前言

由于工作内容涉及到Web端数字水印添加，故通过《Digital Image Watermarking Using 3 level Discrete Wavelet Transform
》一文对数字水印和小波变换进行初步了解，以便于之后的支持工作。

# 正文

## 1 数字水印

描述：利用数字内嵌方法隐藏在数字图像、声音、视频等数字内容中

### 1.1 数字水印应用

- 版权保护
- 盗版跟踪
- 图像认证
- 拷贝保护

### 1.2 数字水印实现分类

#### 空间域方法

例如LSB。

- 算法简单，实用性强
- 嵌入的信息量不能太多
- 鲁棒性差，尤其对于滤波，量化和压缩攻击

#### 变换域方法

例如DFT、DCT、DWT等。

首先利用傅立叶变换、离散余弦变换（DCT）或离散小波变换（DWT）将原始图像转化为频域，生成高质量的水印图像。

- 物理意义明确
- 可以充分利用人类的感知特性
- 不可见性和鲁棒性好
- 与压缩算法兼容

## 2 小波变换

主要思想：把信号分解成**将原始小波经过移位和缩放之后的一系列小波**，由这些小波来重构原始信号。小波是小波信号的基函数，小波系数反映的是不同缩放尺寸和平移参数的小波基函数在重构原函数时所占的比重。

### 2.1 小波分解

原始图像通过一级小波分解后可分为4个频带：

- LL频带：图像内容的缩略图，它是图像数据能量集中的频带
- HL频带：存放的是图像水平方向的高频信息，它反映了图像水平方向上的变化信息和边缘信息；
- LH频带：存放的是图像竖直方向的高频信息，它反映了图像在竖直方向上的灰度变化信息和图像边缘信息；
- HH频带：存放的是图像在对角线方向的高频信息，它反映了水平方向和竖直方向上图像灰度的综合变化信息，同时包含了少量的边缘信息

一次小波变换频率分布图：

![一次小波变换频率分布图][1]

三次小波变换频率分布图

![三次小波变换频率分布图][2]

### 2.2 低频与高频特点

低频：

- 鲁棒性好
- 不可见性差

高频：

- 鲁棒性差
- 不可见性好

所以根据人类视觉特性可以把水印嵌入在HH3区域上，保证了一定的不可见性，又保证了鲁棒性。

# 3 算法流程

## 3.1 嵌入水印流程

![嵌入水印算法流程][3]

## 3.2 提取水印流程

![提取水印算法流程][4]

# 专有名词解释

- DWT：discrete wavelet transform 离散小波变换
- DFT：DiscreteFourier Transform 离散傅立叶变化域
- DCT：Discrete Cosine Transform 离散余弦变换域
- PSNR：singnal-to-noise-ratio 峰值信噪比
- MSE：mean square error 均方差
- LSB：Spatial domain 最小有效位变换

# 总结

在这次的学习中通过《Digital Image Watermarking Using 3 level Discrete Wavelet Transform》一文对小波变换和数字水印添加有了基本的认识。算法先使用三级小波变换找出鲁棒性高且人眼敏感度较弱的低频区域，再使用融合算法将水印嵌入其中。

# 参考文献

1. [《【DWT笔记】傅里叶变换与小波变换》][5]


[1]:/img/in-post/digital-image-watermarking/first-transform.png

[2]:/img/in-post/digital-image-watermarking/third-transform.png

[3]:/img/in-post/digital-image-watermarking/watermark-embedding-process.png

[4]:/img/in-post/digital-image-watermarking/watermark-extraction-process.png

[5]:http://www.cnblogs.com/lzhen/p/3952529.html