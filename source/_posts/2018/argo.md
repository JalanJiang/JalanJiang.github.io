---
title:       Argo 创建 Kubernetes 工作流
description: The Workflow Engine for Kubernetes
date:       2018-12-18 16:50:00
categories:
    - 云原生应用
tags:
    - Kubernetes
toc: true
---

![](/img/in-post/argo.png)

## 什么是 Argo

在工作中遇到需要串联 n 个容器任务的情况，选择了 Argo 进行工作流程的控制。

Argo 是一个开源项目，为 Kubernetes 提供容器本地工作流程。

## 安装

### 需要环境

- Kubernetes >= 1.9
- 安装 kubectl
- 存在 Kubeconfig 文件（默认路径为 ~/.kube/config）

### 下载

On Mac:

```
brew install argoproj/tap/argo
```

On Linux:

```
curl -sSL -o /usr/local/bin/argo https://github.com/argoproj/argo/releases/download/v2.2.1/argo-linux-amd64
chmod +x /usr/local/bin/argo
```

### 安装控制器与 UI

```
kubectl create ns argo
kubectl apply -n argo -f https://raw.githubusercontent.com/argoproj/argo/v2.2.1/manifests/install.yaml
```

## 令 UI 可访问

Argo UI 对外端口为 `8001`。

### 方法一：kubectl port-forward

```
kubectl -n argo port-forward deployment/argo-ui 8001:8001
```

访问本地 `http://127.0.0.1:8001`

### 方法二：kubectl proxy

```
kubectl proxy
```

访问 `http://127.0.0.1:8001/api/v1/namespaces/argo/services/argo-ui/proxy/`。

### 方法三：负载均衡

```
kubectl patch svc argo-ui -n argo -p '{"spec": {"type": "LoadBalancer"}}'
```

等待设置完成后进行查看：

```
kubectl get svc argo-ui -n argo
```


## Argo CLI

```
argo submit hello-world.yaml    # submit a workflow spec to Kubernetes
argo list                       # list current workflows
argo get hello-world-xxx        # get info about a specific workflow
argo logs -w hello-world-xxx    # get logs from all steps in a workflow
argo logs hello-world-xxx-yyy   # get logs from a specific step in a workflow
argo delete hello-world-xxx     # delete workflow
```


注：`submit` 后默认使用的命名空间为 `default`。


## 工作流模板

### DAG


指定每个任务的依赖项，将工作流定义为 **图**，在运行任务时可以实现有效的并行。


```
apiVersion: argoproj.io/v1alpha1
kind: Workflow
metadata:
  generateName: dag-diamond-
spec:
  entrypoint: diamond
  templates:
  - name: echo
    inputs:
      parameters:
      - name: message
    container:
      image: alpine:3.7
      command: [echo, "{{inputs.parameters.message}}"]
  - name: diamond
    dag:
      tasks:
      - name: A
        template: echo
        arguments:
          parameters: [{name: message, value: A}]
      - name: B
        dependencies: [A]
        template: echo
        arguments:
          parameters: [{name: message, value: B}]
      - name: C
        dependencies: [A]
        template: echo
        arguments:
          parameters: [{name: message, value: C}]
      - name: D
        dependencies: [B, C]
        template: echo
        arguments:
          parameters: [{name: message, value: D}]
```

## 其他问题

### 拉取私有仓库镜像

和 Kubernetes 一样，需要设置 secret，参考 [在 Kubernetes 中拉取私人镜像仓库镜像](/2018/10/08/2018/add-private-docker-registry-to-kubernetes)。

配置文件中添加 `imagePullSecrets`，如下：

```
# imagePullSecrets can be referenced in a workflow spec, which will be carried forward to all pods
# of the workflow. Note that imagePullSecrets can also be attached to a service account:
# https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account
apiVersion: argoproj.io/v1alpha1
kind: Workflow
metadata:
  generateName: hello-world-
spec:
  entrypoint: whalesay
  imagePullSecrets:
  - name: docker-registry-secret
  templates:
  - name: whalesay
    container:
      image: docker/whalesay:latest
      command: [cowsay]
      args: ["hello world"]
```

### 消费 GPU

因为项目是 machine-learning 类型，需要使用到 GPU 资源。创建的 Kubernetes 集群也是 GPU 集群。

在 Google Kubernetes Engine 上 Consume GPU 的配置可以参考 [Kubernetes Engine GPUs](https://cloud.google.com/kubernetes-engine/docs/how-to/gpus)。

#### 安装 Driver

首先，需要安装 Nvidia 的设备驱动，Google 提供了 YAML 文件。

```
kubectl create -f https://raw.githubusercontent.com/GoogleCloudPlatform/container-engine-accelerators/k8s-1.9/nvidia-driver-installer/cos/daemonset-preloaded.yaml
```

#### 配置 Argo 工作流模板

在 Argo 的工作流模板中这样配置：

```
...
- name: ios-training
    retryStrategy:
      limit: 5
    container:
      name: ios-training
      image: "{{workflow.parameters.image-ios-training}}"
      env:
      - name: TEST
        value: "{{workflow.parameters.test}}"
      resources:
        limits:
          nvidia.com/gpu: '1'
        requests:
          nvidia.com/gpu: '1'
```

## 参考文档

- Argo
    - [Argo](https://kubernetes.feisky.xyz/fu-wu-zhi-li/devops/argo)
    - [官方文档](https://applatix.com/open-source/argo/docs/argo_v2_yaml.html)
    - [工作流事例](https://github.com/argoproj/argo/tree/master/examples)
    - [Support for GPU resources #577](https://github.com/argoproj/argo/issues/577)
- [Getting Started with GPUs in Google Kubernetes Engine](https://thenewstack.io/getting-started-with-gpus-in-google-kubernetes-engine/)