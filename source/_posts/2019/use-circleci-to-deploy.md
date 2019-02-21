---
title:       Github + CircleCI + GKE 部署应用
description: 人生很短，部署流程很长
date:       2019-01-26 16:04:00
categories:
    - 技多不压身
tags:
    - NodeJS
    - Kubernetes
    - GCP
    - DevOps
toc: true
---

![](/img/devops.png)

我的 [Venceremos](https://github.com/GGGanon/dont-forget-me-service) 完成三分之一了，客户端同学 Csming 催着要接口，于是开始着手测试环境的部署。

由于去年在 GCP 开了账户，之前也有了 GKE 的一些使用经验，打算这次也直接在 GKE 完成应用的部署。但是每次都自己打镜像，自己修改配置文件也太蠢了吧，那就顺便加上 CI 试试。

# 什么是持续集成

持续集成（Continuous Integration）通常缩写为 CI，指的是当代码有变更时，立即进行构建和测试，反馈运行结果，我们可以根据测试结果，确定新代码是否可以和原有代码正确的集成在一起。

由于在这篇文章里还没涉及到测试部分，只是单纯的构建部署，因此还不能称作真正意义上的 CI。

# CircleCI

公司使用的持续集成工具是 Jenkins，也写过部署相关的 pipeline，但用 CircleCI 还是头一回。

## 简介

CircleCI 是一个持续集成/持续部署的服务，开源项目可以免费使用，他的价格取决于你需要并发构建实例的数量，单个实例是免费的。

它能做到：

- 关联你的 Github/BitBucket 项目
- 当代码有更新时自动抓取
- 执行工作流中的构建、测试、部署等步骤

## 关联 Github

可以在 [Github MarketPlace](https://github.com/marketplace) 中找到 [CircleCI](https://github.com/marketplace/circleci)，关联后即可使用。

## 快速开始

要让持续集成工具明白你的用意，首先要定义好你的工作流。

在项目的根目录下创建 `.circleci` 文件夹，并在文件夹中创建工作流配置文件 `config.yml`，CircleCI 将会根据 `config.yml` 中的内容执行相关操作。

一个简单的 `config.yaml` 配置格式如下：

```
version: 2
jobs:
  build:
    docker:
      - image: circleci/ruby:2.4.1
    steps:
      - checkout
      - run: echo "A first hello"
```

具体语法不多介绍了，详见官方文档：[Welcome to CircleCI Documentation](https://circleci.com/docs/)。

## 我的工作流

### 构建

构建步骤要完成的几件事：

- 拉取代码
- 构建镜像
- 将镜像推送至镜像仓库

#### 代码拉取

非常简单，在 `steps` 中定义 `checkout`。

```
jobs:
  build:
    steps:
      - checkout
```

`checkout` 会把项目源码拉取至当前工作目录。

#### 构建镜像

我采用的是根据 `Dockerfile` 完成镜像构建的。

项目是基于 nodeJS 开发的，首先要编写一个 `Dockerfile` 文件：

```
FROM node:latest

COPY . /workspace
WORKDIR /workspace
RUN npm install

EXPOSE 8088

ENTRYPOINT ["node", "app.js"]
```

工作流：

```
jobs:
  build:
    steps:
      ......
      - run:
          name: Build image
          command: |
            FULL_DOCKER_IMAGE_NAME=$(cat full_docker_image_name)
            # 构建镜像
            docker build -t $FULL_DOCKER_IMAGE_NAME . 
```

这里的 `$FULL_DOCKER_IMAGE_NAME` 可以根据项目的具体需求来赋值。

#### 镜像推送

因为使用的是 GCP 的镜像仓库，因此这一步还包含了 GCP 的授权登录。

```
jobs:
  build:
    steps:
      ......
      - run:
          name: Push image
          command: |
            FULL_DOCKER_IMAGE_NAME=$(cat full_docker_image_name)
            echo $GCLOUD_SERVICE_KEY | base64 --decode --ignore-garbage > gcloud-service-key.json
            gcloud auth activate-service-account --key-file gcloud-service-key.json
            gcloud --quiet auth configure-docker
            docker push $FULL_DOCKER_IMAGE_NAME
```

### 部署

```
jobs:
  ......
  deploy:
    steps:
      ......
      - run:
          name: Deploy
          command: |
            # 获取授权信息
            echo $GCLOUD_SERVICE_KEY | base64 --decode --ignore-garbage > gcloud-service-key.json
            set -x
            # 授权登录
            gcloud auth activate-service-account --key-file gcloud-service-key.json
            gcloud --quiet config set project $GOOGLE_PROJECT_ID
            gcloud --quiet config set compute/zone $GOOGLE_COMPUTE_ZONE
            EXISTING_CLUSTER=$(gcloud container clusters list --format="value(name)" --filter="name=$GOOGLE_CLUSTER_NAME")
            if [ "${EXISTING_CLUSTER}" != $GOOGLE_CLUSTER_NAME ]
            then
              gcloud --quiet container clusters create $GOOGLE_CLUSTER_NAME --num-nodes=1
            else
              gcloud --quiet container clusters get-credentials $GOOGLE_CLUSTER_NAME
            fi
            FULL_DOCKER_IMAGE_NAME=$(cat workspace/full_docker_image_name)
            # 滚动更新
            kubectl --namespace=default set image deployment/venceremos dont-forget-service=$FULL_DOCKER_IMAGE_NAME --record
```

### 定义执行流程

之前的步骤都只是定义了工作流的模板，具体模板的执行顺序、依赖等还要使用 `workflow` 关键字进行最后的定义。

```
workflows:
  version: 2
  build-deploy:
    jobs:
      - build
      - deploy:
          requires:
            - build
```

附上 `config.yaml` 文件：[config.yaml](https://github.com/GGGanon/dont-forget-me-service/blob/develop/.circleci/config.yml)，后续会根据不同分支来部署不同的环境，也会加上单元测试的步骤，持续更新。

# GCP

由于是在 GCP 上部署，在 CircleCI 中配置了 google-cloud-sdk 镜像：

```
defaults: &defaults
  docker:
    - image: google/cloud-sdk@sha256:126a49cfa2aa6e20d561fa14999bf657bc341efeba04939bd2f612bf843d12a6
```

其他要注意的地方估计只有授权登录了，获取授权配置见：[Getting Started with Authentication](https://cloud.google.com/docs/authentication/getting-started)

项目使用了两种 GCP 资源：

- Google Kubernetes Engine - Google k8s 引擎
- Google Container Registry - Google 镜像仓库

## GKE

因为使用的是 Google 自己的镜像仓库，也不需要仓库授权的麻烦步骤了。

官方文档：[Google Kubernetes Engine Documentation](https://cloud.google.com/kubernetes-engine/docs/)

## Container Registry

Google 的镜像仓库，会根据 Storage 的具体流量进行收费。在国内使用很不友好，已被 qiang。

使用方法详见官方文档：[Container Registry Documentation](https://cloud.google.com/container-registry/docs/)

----


最后纪念一下调了半死终于跑起来的样子：

![(◔౪◔)](/img/circle-ci-test.png)

# 参考资料

- [使用 CircleCI 2.0 进行持续集成/持续部署](https://www.jianshu.com/p/36af6af74dfc)

