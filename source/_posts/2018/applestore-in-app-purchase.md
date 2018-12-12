---
title:      iOS 内购-在服务端的凭据验证处理
description: 在服务器完成凭据校验并记录购买记录
date:       2018-09-09 15:30:00
categories:
    - Web屠龙刀
tags:
    - PHP
toc: true
---

## 本地验证的缺陷

本地验证：

客户端拿到 `receipt-data` 之后，直接由客户端向 `itunes.appstore` 发送验证请求，拿到结果后根据结果直接修改数据。本地验证最大的问题就是不安全。

- 不对产品和单据进行验证就发放道具
- 通过伪造 `receipt-data` 即可达成目的

## 独立服务器验证

即：将凭据验证、发放道具的过程交给服务端实现。

### 基本流程

![时序图](https://img-blog.csdn.net/20150723155327761?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

1. 客户端向 Appstore 请求购买产品，Appstore验证产品成功后，从用户的Apple账户余额中扣费

2. Appstore向客户端返回一段 `receipt-data`，里面记录了本次交易的证书和签名信息

3. 客户端向可信任的独立服务器提供 `receipt-data`

4. 服务器对 `receipt-data` 进行 `base_64` 编码

5. 服务器把 `base_64` 编码后的 `receipt-data` 发往 `itunes.appstore` 进行验证

6. `itunes.appstore` 返回验证结果给游戏服务器

7. 服务器对返回结果进行校验，告知客户端是否购买成功

### 凭据验证返回值

`itunes.appstore` 返回示例：

```json
{
  "status": 0,
  "environment": "Production",
  "receipt": {
    "download_id": 75017873837267,
    "adam_id": 1149703708,
    "request_date": "2017-01-13 06:57:20 Etc/GMT",
    "app_item_id": 1149703708,
    "original_purchase_date_pst": "2016-11-17 18:57:09 America/Los_Angeles",
    "version_external_identifier": 820252187,
    "receipt_creation_date": "2017-01-13 05:04:52 Etc/GMT",
    "in_app": [
      {
        "is_trial_period": "false",
        "purchase_date_pst": "2017-01-12 21:04:52 America/Los_Angeles",
        "original_purchase_date_pst": "2017-01-12 21:04:52 America/Los_Angeles",
        "product_id": "com.lucky917.live.gold.1.555",
        "original_transaction_id": "350000191094279",
        "original_purchase_date": "2017-01-13 05:04:52 Etc/GMT",
        "original_purchase_date_ms": "1484283892000",
        "purchase_date": "2017-01-13 05:04:52 Etc/GMT",
        "purchase_date_ms": "1484283892000",
        "transaction_id": "350000191094279",
        "quantity": "1"
      }
    ],
    "original_purchase_date_ms": "1479437829000",
    "original_application_version": "26",
    "original_purchase_date": "2016-11-18 02:57:09 Etc/GMT",
    "request_date_ms": "1484290640800",
    "bundle_id": "com.lucky917.ios.Live",
    "receipt_creation_date_pst": "2017-01-12 21:04:52 America/Los_Angeles",
    "application_version": "32",
    "request_date_pst": "2017-01-12 22:57:20 America/Los_Angeles",
    "receipt_creation_date_ms": "1484283892000",
    "receipt_type": "Production"
  }
}
```

| 字段 | 说明 |
| ---- | ---- |
| receipt.in_app | 未结束的交易将会在列表中出现 |
| receipt.bundle_id | app 标识 |

### 二次校验

- 验证 `receipt-data` 是否已使用过（防止重复验证攻击）
- 验证返回的 `bundle_id` 是否与当前 app 相同（防止跨 app 攻击）
- 根据返回的 `product_id` 下发道具（防止低价格购买高价格商品）

### 漏单处理

客户端提交 `receipt-data` 后，在没有收到回复之前，客户端必须要把 `receipt-data` 保存好，并定期向服务端发起请求，直至收到服务端的回复后删除客户端的 `receipt` 账单记录。

## 参考资料

- [Apple-Receipt Fields](https://developer.apple.com/library/archive/releasenotes/General/ValidateAppStoreReceipt/Chapters/ReceiptFields.html#//apple_ref/doc/uid/TP40010573-CH106-SW31)
- [iOS 内付费（in-app purchase）－－非消耗品的购买与恢复](https://blog.csdn.net/shenjie12345678/article/details/53023804)
- [iOS内购充值 服务器端处理](https://blog.csdn.net/mycwq/article/details/71852679)
- [ios 内购服务器验票（漏单处理）](https://blog.csdn.net/goodeveningbaby/article/details/53372934)
- [用户使用 iOS 内支付成功，但是服务器端没有收到客户端发来的 Receipt 的话，怎么进行支付的确认？](https://www.zhihu.com/question/20996872)
- [苹果应用内支付(iOS IAP)的流程与常用攻击方式](http://www.lucky917.com/ios/2017/01/19/apple-ios-iap.html)