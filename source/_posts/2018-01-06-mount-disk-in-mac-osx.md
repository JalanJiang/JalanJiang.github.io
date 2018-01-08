---
layout:     post
title:      "原生命令行实现 macOS 下 ntfs 硬盘读写"
description:   "外面那些妖艳贱货哪有原生的命令好"
date:       2018-01-06 12:00:00
categories:
    - 磨刀石
tags:
    - macOS
---

最近电脑空间越用越小，打算把一些文件整理到移动硬盘中。但由于 mac 对 windows 文件分区支持不够好，无法在 mac 上对我的硬盘进行读写，于是开始折腾。

之前的解决方法是借助第三方软件。免费的例如 [Mounty](http://enjoygineering.com/mounty/)，收费的有 [NTFS for Mac](http://www.ntfsformac.cn/)。但是这次 Mounty 莫名其妙的抽风了，我也不想花 140+ 买个付费的工具。so，自己折腾吧。

## 1. 插入硬盘／U盘

就不手把手教你了。

## 2. 获取系统硬盘的挂载路径与设备号

```
➜  mount
/dev/disk1 on / (hfs, local, journaled)
devfs on /dev (devfs, local, nobrowse)
map -hosts on /net (autofs, nosuid, automounted, nobrowse)
map auto_home on /home (autofs, automounted, nobrowse)
/dev/disk3s1 on /Volumes/ParagonFS.localized (hfs, local, nodev, nosuid, read-only, noowners, quarantine, mounted by zj-db0908)
/dev/disk2s4 on /Volumes/新加卷 (ntfs, local, nodev, nosuid, read-only, noowners)
/dev/disk2s1 on /Volumes/新加卷 1 (ntfs, local, nodev, nosuid, read-only, noowners)
/dev/disk2s3 on /Volumes/移动的Jalan (ntfs, local, nodev, nosuid, read-only, noowners)
```

例如我需要的硬盘记录是这一条

```
/dev/disk2s3 on /Volumes/移动的Jalan (ntfs, local, nodev, nosuid, read-only, noowners)
```

`/dev/disk2s3` 是设备号，`/Volumes/移动的Jalan` 则是挂载路径。

## 3. 卸载挂载分区

```
➜  sudo umount /dev/disk2s3
```

卸载后我们可以发现，在 Finder 侧边栏挂载的被卸载分区消失了。

## 4. 在桌面新建文件夹

我建立的文件夹路径为 `/Users/zj-db0908/Desktop/move_jalan`。

## 5. 挂载分区

把卸载下的分区挂载到我们新建的桌面文件夹上。

```
➜  sudo mount_ntfs -o rw,nobrowse /dev/disk2s3 /Users/zj-db0908/Desktop/move_jalan
```

## 6. 卸载分区

```
➜  sudo umount /Users/zj-db0908/Desktop/move_jalan
```


