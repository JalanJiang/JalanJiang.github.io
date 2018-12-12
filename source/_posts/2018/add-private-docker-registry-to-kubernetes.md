---
title:       在 Kubernetes 中拉取私人镜像仓库镜像
description: 谁还没个私人仓库呢
date:       2018-10-08 19:43:00
categories:
    - 云原生应用
tags:
    - Kubernetes
---

对于公司内部的项目, 我们不可能使用公有开放的镜像仓库, 一般会在自己的服务器上搭建私有仓库。这时候就需要在 Kubernetes 中拉取私人镜像仓库的镜像。

## 生成密钥

```
kubectl create secret docker-registry regsecret --docker-server={$Server} --docker-username={$Email} --docker-password={$Password} --docker-email={$Email}
```

参数解释：

- regsecret: 密钥键名，可自行定义
- --docker-server：docker 仓库地址
- --docker-username：docker 仓库账号
- --docker-password：docker 仓库密码
- --docker-email：邮件地址（选填）

**注：**密钥只能在对应 namespace 使用，指定 namespace 使用 `-n` 参数。

## 在配置文件中加入密钥

修改 `yml` 配置文件：

```
spec:
      containers:
      - image: {$ImageUrl}
        imagePullPolicy: Always
      imagePullSecrets:
      - name: regsecret
```

大功告成！

## 参考资料

- [Kubernetes从Private Registry中拉取容器镜像的方法](https://tonybai.com/2016/11/16/how-to-pull-images-from-private-registry-on-kubernetes-cluster/)
- [官方文档](https://kubernetes.io/cn/docs/concepts/containers/images/)
- [kubernetes配置secret拉取私仓镜像](https://www.jianshu.com/p/fd13c2762d81)