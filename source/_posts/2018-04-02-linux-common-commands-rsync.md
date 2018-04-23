---
title:       Linux常用命令之 —— rsync
description: 对位于不同位置的文件盒目录进行同步（远端同步／备份）
date:       2018-04-02 20:59:00
categories:
    - Web屠龙刀
tags:
    - Shell
toc: true
---

# rsync 简述

- 对位于不同位置的文件盒目录进行同步（远端同步／备份）
- 优势（与 `cp` 相比）：
    - 差异计算
    - 压缩技术
    - 加密技术

# rsync 备份姿势

## 将源目录复制到目的端

```
rsync -av source_path destination_path
```

- `-a`：归档
- `-v`：在 stdout 上打印出细节信息或进度

例如：

```
rsync -av /home/slynux/data slynux@192.168.0.6:/home/backup/data
```

## 将数据备份到远程服务器或主机

```
rsync -av source_dir username@host:PATH
```

- rsync 使用 ssh 连接远程主机
    - `user`：代表用户名
    - `host`：代表远程主机的IP地址或主机名
    - `PATH`：指定需要从中复制数据的远程主机上的路径

## 压缩数据

`-z` 指定在网路传输时压缩数据。

```
rsync -avz source destination
```

## 将一个目录中的内容同步到另一个目录

```
rsync -av /home/test/ /home/backups
```

将 `/home/test` 中的内容（**不包括目录本身**）复制到 backups 目录中。

## 包括目录本身在内的内容复制到另一个目录中

```
rsync -av /home/test /home/backups
```

同：

```
rsync -av /home/test /home/backups/
```

- destination_path 末尾：
    - 使用`/`：将来自源端的内容复制到目的端目录中
    - 不使用`/`：在目的端路径尾部创建一个同名目录

# 补充内容

## 排除部分文件

### --exclude

`--exclude` 通过通配符指定需要排除的文件。

```
rsync -avz /home/code/some_code /mnt/disk/backup/code --exclude "*.txt"
```

### --exclude-from

`--exclude-from` 通过一个列表文件指定需要排除的文件。

```
rsync -avz /home/code/some_code /mnt/disk/backup/code --exclude-from FILEPATH
```

## 删除不存在的文件

在目的端删除那些在源端已不存在的文件。

```
rsync -avz SOURCE DESTINATION -delete
```

## 定期备份

配合 `cron` 任务使用 `rsync`。