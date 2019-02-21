---
title:       使用 Python 上传文件到 Google Cloud Storage
description: from gcloud import storage
date:       2018-12-27 23:46:00
categories:
    - Web屠龙刀
tags:
    - Python
    - GCP
toc: true
---

需要上传生成的文本文件到 GCP 的 Storage 中，使用 Python 实现。

## 安装 gcloud

首先，需要安装 Python 的 gcloud 库，[google-cloud-python](https://googleapis.github.io/google-cloud-python/)。

```
pip install gcloud
pip install google-cloud-storage
```

## 获取凭证文件

[点击前往](https://cloud.google.com/storage/docs/reference/libraries?authuser=1#client-libraries-install-python)

## 举个栗子

```python
from gcloud import storage

storage_client = storage.Client.from_service_account_json('creds.json') # 指定凭证文件
bucket = self.storage_client.get_bucket('bucket-name') # 设置 bucket 名称
blob = bucket.blob(blob_name) # 设置 storage 中的文件名
blob.upload_from_filename(path_to_file) # 设置要上传的源文件路径
```