---
title:       Kubernetes 预研
description: 初探 Kubernetes
date:       2018-08-19 17:22:00
categories:
    - 云原生应用
tags:
    - Kubernetes
toc: true
---

## 概述

### 介绍

- Kubernetes（k8s）是自动化容器操作的开源平台
- 目标是让部署容器化的应用简单并且高效
- 提供了应用部署，规划，更新，维护的一种机制
- 可以将 Docker 看成 Kubernetes 内部使用的低级别组件

### 功能

- 自动化容器的部署和复制 
- 随时扩展或收缩容器规模 
- 将容器组织成组，并且提供容器间的负载均衡 
- 很容易地升级应用程序容器的新版本 
- 提供容器弹性，如果容器失效就替换它

### 背景

- Docker 作为高级容器引擎快速发展
- 云计算的蓬勃发展
- 单机走向集群的必然

### 解决问题

- 调度：容器应该在哪个机器上运行 
- 生命周期和健康状况：让容器在无错的条件下运行 
- 服务发现：容器在哪，怎样与它通信 
- 监控：观测容器是否运行正常 
- 认证：谁能访问容器 
- 容器聚合：如何将多个容器合并成一个工程

### 优点

- 具备超强的横向扩容能力（从几个 Node 平滑扩展到几百个 Node）
- 简化部署流程，部署容器化应用简单高效
- 可将负载运行在由成千上万的机器联合而成的集群中

## 设计架构

![k8s 架构](http://dockone.io/uploads/article/20151230/d56441427680948fb56a00af57bda690.png)

### 节点（Node）

- 是物理或者虚拟机器
- 每个节点都运行如下 Kubernetes 关键组件：
    - Kubelet：是主节点代理
    - Kube-proxy：Service 使用其将链接路由到 Pod
    - Docker 或 Rocket：容器

#### Pod

- 所有的容器均在Pod中运行
- 一个Pod可以承载一个或者多个相关的容器

#### Lable

- 一个 Label 是 attach 到 Pod 的一对键值对，传递用户定义的属性
- 可以使用 Selectors 选择带有特定 Label 的Pod，并且将 Service 或者 Replication Controller 应用到上面

#### kubelet

- 负责管理 Pods 和它们上面的容器，images镜像、volumes、etc

#### kube-proxy

- 完成网络代理和负载均衡

### Service

- 是定义一系列Pod以及访问这些Pod的策略的一层抽象
- 为后台 Pod 之间提供透明的负载均衡，会将请求分发给其中的任意一个

![Service 功能](http://dockone.io/uploads/article/20151230/125bbccce0b3bbf42abab0e520d9250b.gif)

### Kubernetes Master

#### Kubernetes API Server

- 提供可以用来和集群交互的 REST 端点

#### Replication Controller

- 确保任意时间都有指定数量的 Pod “副本”在运行
- 持续监控 Pod
- 如果某个 Pod 不响应，那么 Replication Controller 会替换它

![image](http://dockone.io/uploads/article/20151230/5e2bad1a25e33e2d155da81da1d3a54b.gif)



