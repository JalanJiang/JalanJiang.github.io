---
title:       使用 kubectl 连接远程 Kubernetes 集群 
description: Kubernetes 远在天边，近在眼前
date:       2018-08-25 15:56:00
categories:
    - 云原生应用
tags:
    - Kubernetes
toc: true
---

## 什么是 kubectl

- `kubectl` 是 Kubernetes 的客户端程序
- 是用于运行 Kubernetes 集群命令的管理工具
- 提供了大量子命令可以让用户和集群进行交互
- 不一定部署在 master 上，用户可以通过 `kubectl` 连接到 master 上

## 安装

macOS 下直接使用 homebrew 管理工具进行安装：

```
$ brew install kubernetes-cli
```

确认是否安装成功：

```
$ kubectl version
```

其他系统安装方式详见 [Install and Set Up kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/#configure-kubectl)。

## 基本语法

```
kubectl [command] [TYPE] [NAME] [flags]
```

## 配置 kubectl

```
# 配置集群名称与服务地址
kubectl config --kubeconfig=${HOME}/.kube/config set-cluster cluster-name --server=https://{IP} --insecure-skip-tls-verify

# 设置一个管理用户为admin，并设置访问凭证。此处使用 用户名-密码 的验证方式
kubectl config --kubeconfig=${HOME}/.kube/config set-credentials admin --username=username --password=pwd

# 设置一个名为 admin 的配置，使用 cluster-name 集群与 admin 用户的上下文
kubectl config --kubeconfig=${HOME}/.kube/config set-context admin --cluster=cluster-name --namespace=test --user=admin

# 启用 admin 为默认上下文
kubectl config --kubeconfig=${HOME}/.kube/config use-context admin
```

### 预览配置

```
$ kubectl config view
apiVersion: v1
clusters:
- cluster:
    insecure-skip-tls-verify: true
    server: https://{IP}
  name: cluster-name
contexts:
- context:
    cluster: cluster-name
    namespace: test
    user: admin
  name: admin
current-context: admin
kind: Config
preferences: {}
users:
- name: admin
  user:
    password: pwd
    username: username
```

### 验证配置

```
$ kubectl cluster-info
Kubernetes master is running at https://{IP}
GLBCDefaultBackend is running at https://{IP}/api/v1/namespaces/kube-system/services/default-http-backend:http/proxy
Heapster is running at https://{IP}/api/v1/namespaces/kube-system/services/heapster/proxy
KubeDNS is running at https://{IP}/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
kubernetes-dashboard is running at https://{IP}/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy
Metrics-server is running at https://{IP}/api/v1/namespaces/kube-system/services/https:metrics-server:/proxy
```

查看集群节点：

```
$ kubectl get node
NAME                                          STATUS    ROLES     AGE       VERSION
gke-ci-cluster-1-default-pool-a7b52541-075v   Ready     <none>    3d        v1.9.7-gke.5
```

若以上输出正常，证明连接成功。

### 其他连接验证方式

待补充

## 参考资料

- [Kubernetes kubectl 概述](http://docs.kubernetes.org.cn/61.html)
- [Install and Set Up kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/#configure-kubectl)
- [kubectl config set-credentials](http://kubernetes.kansea.com/docs/user-guide/kubectl/kubectl_config_set-credentials/)
- [配置远程工具访问kubernetes集群](https://blog.csdn.net/shenshouer/article/details/52960364)