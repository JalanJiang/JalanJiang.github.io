---
title:       git 使用姿势：上传本地独立分支至远程
description: 上传一个独立的分支
date:       2017-12-05 17:15:00
categories:
    - 技多不压身
tags:
    - git
---

将本地与远程毫无关联的项目文件上传至远程的一个新分支。

在项目文件根目录下初始化 git ：

```
git init
```

添加所有项目文件：

```
git add *
```

执行 commit ：

```
git commit -m "commit info"
```

创建新分支 copy ：

```
git branch copy
```

切换分支：

```
git checkout copy
```

关联远程库：

```
git remote add origin https://gitlab.xxx.com/xxx/xxx.git
```

上传分支：

```
git push origin copy
```

