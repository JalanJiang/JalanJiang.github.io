---
title:       Python configparser 模块
description: 论如何优雅读取配置文件
date:       2019-02-14 18:22:00
categories:
    - Web屠龙刀
tags:
    - Python
---

Ps：基于 Python3

## 创建配置文件

在项目根目录下创建 `.ini` 格式的配置文件：

```
touch conf.ini
```

配置文件大概长这样：

```
[DEFAULT]
ServerAliveInterval = 45
Compression = yes
CompressionLevel = 9
ForwardX11 = yes

[bitbucket.org]
User = hg

[debug]
log_errors=true
show_warnings=False

[topsecret.server.com]
Port = 50022
ForwardX11 = no
```

## 优雅读取

```python
from configparser

config = configparser.ConfigParser()
# 配置文件路径
config.read("./conf.ini")
config.sections()
# 读取配置
config.get("DEFAULT", "Compression")
cfg.getboolean('debug','log_errors')
config.getint("topsecret.server.com", "Port")
```

## 参考资料

- [configparser — Configuration file parser](https://docs.python.org/3/library/configparser.html)
- [读取配置文件](https://python3-cookbook.readthedocs.io/zh_CN/latest/c13/p10_read_configuration_files.html)