---
title:       Linux 定时任务
description: crontab
date:       2018-11-21 23:54:00
categories:
    - 技多不压身
tags:
    - Linux
toc: true
---

## 设置定时任务

### 编辑 crontab 文件

执行以下命令打开 **用户所属的** crontab 文件：

```
crontab -e
```

打开 root 用户所属的 crontab 文件：

```
sudo crontab -e
```

选定编辑器可以使用 `select-editor`。

### 任务格式

```
Linux
*    *    *    *    *    *
-    -    -    -    -    -
|    |    |    |    |    |
|    |    |    |    |    + year [optional]
|    |    |    |    +----- day of week (0 - 7) (Sunday=0 or 7)
|    |    |    +---------- month (1 - 12)
|    |    +--------------- day of month (1 - 31)
|    +-------------------- hour (0 - 23)
+------------------------- min (0 - 59)
```

例子：

```
* * * * *                  # 每隔一分钟执行一次任务  
0 * * * *                  # 每小时的0点执行一次任务，比如6:00，10:00  
6,10 * 2 * *            # 每个月2号，每小时的6分和10分执行一次任务  
*/3,*/5 * * * *          # 每隔3分钟或5分钟执行一次任务，比如10:03，10:05，10:06  
```

### 重启

```
sudo service cron restart  
```

## Debug

### 开启日志文件

- 修改 `/etc/rsyslog.d/50-default.conf` 文件，将 `#cron.*` 前的 `#` 去除
- 重启 rsyslog 服务：`service rsyslog restart`
- 重启 cron 服务：`service cron restart`
- 查看日志文件：`tail -f /var/log/cron.log`

### 奇奇怪怪的错误

#### 命令有输出信息导致错误

重定向输出：

```
sh test.sh >/dev/null 2>&1
```

## 参考资料

- [在 Ubuntu 中， 将 cron 的默认日志存放在 /var/log/cron以及crontab的运用](https://segmentfault.com/a/1190000011316003)