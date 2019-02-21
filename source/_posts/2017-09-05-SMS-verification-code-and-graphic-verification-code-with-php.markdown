---
title:       使用 PHP 实现 图形验证码&短信验证码 的验证
description: 设计与实现验证码+验证码的双重保障
date:       2017-09-07 20:00:00
categories:
    - Web屠龙刀
tags:
    - PHP
---

# 前言

本文主要对使用 PHP 验证用户手机号的方法做一总结。

# 正文

## 为什么需要验证？

在现实生活中，需要用户验证其手机号的场景有很多，例如：使用手机号注册账号、手机号修改密码、提交用户联系方式等……

在这些场景中服务商要求用户对自身手机号码进行验证的原因在于：确保用户手机号真实、可用。

- 确保能通过该联系方式联系到用户本人
- 防止用户随机提交他人手机号作为自身联系方式

## 验证方法是什么？

现在普遍采用验证码方式对手机号进行验证，分为：

- 短信验证码
- 语音验证码

我们在此使用短信验证码的方式。

## 验证需要注意哪些？

在用户进行手机号验证的过程中可能会出现如下问题：

- 用户利用短信验证码接口向他人频繁发送骚扰短信
- 用户通过发包暴力破解验证码

因此在验证过程中需加入如下手段：

- 在发送短信验证码前需让用户进行图形验证码校验
- 用户提交短信验证码失败5次后，将此短信验证码作废

为防止用户对验证码的暴力破解和重复使用，加入验证码作废机制：

- 图形验证码对比 1 次后（无论成功与否）立即失效
- 短信验证码成功对比 1 次后立即失效
- 短信验证码错误对比 5 次后失效

## 如何实现？

### 图形验证码

验证过程主要分为以下几步：

1. 生成图形验证码
2. 将验证码字符串保存在 session 中
3. 将用户所提交的验证码与 session 对比
	- 对比成功：用户通过图形验证码验证，程序进入下一流程，销毁 session 
	- 对比失败：销毁 session。刷新验证码，要求用户重新进行验证操作

其中，生成图形验证码的大致步骤为：

1. 产生一个随机字符串
2. 创建一个图像
3. 将字符串输出到图像中
4. 在图像中加入噪点干扰，例如直线、雪花点等
5. 输出图像
6. 销毁图像资源

本篇的重点不在于如何生成图形验证码，在此不多做赘述。

### 短信验证码

和图形验证码的机制是一样的，也是将用户提交的验证码与 session 做对比。验证过程如下：

1. 产生一个随机 6 位数（按需求而定）
2. 将随机数存储在 session 中
3. 拟定短信文案，加入验证码信息，调用短信平台接口向指定手机号发送短信
4. 将用户所提交的验证码与 session 内容进行对比
	- 对比成功：用户通过短信验证码流程，销毁 session，进入下一步流程（允许用户获取短信验证码）
	- 对比失败：
		- 失败次数 <5 ：允许用户重新提交验证码进行验证
		- 失败次数 >=5 ：销毁 session，用户若再提交，提示用户验证码已过期，要求用户重新获取验证码

附短信验证码验证方法：

```
/**
 * @param $code 验证码
 * @param $phone 用户手机号
 * @return int -1：已过期 0:失败 1:成功
 */
private function checkCode($code, $phone)
{
    session_start();

    if (!isset($_SESSION[static::MESSAGE_CODE_TIME]) || !isset($_SESSION[static::MESSAGE_CODE])) {
        return 0;
    }

	// 验证码五分钟后过期
    if ($_SESSION[static::MESSAGE_CODE_TIME] + 60*5 < time()) {
        // 销毁 session
        $this->unsetCode();
        return -1;
    } else {
        if ($_SESSION[static::MESSAGE_CODE] == $code && $_SESSION[static::MESSAGE_CODE_USER] == $phone) {
            // 销毁 session
            $this->unsetCode();
            return 1;
        } else {
            // 输入验证码错误
            if (!isset($_SESSION[static::SESSION_MESSAGE_CODE_COUNT])) {
            		// 初始化错误次数
                $_SESSION[static::SESSION_MESSAGE_CODE_COUNT] = 1;
            } else {
            		// 记录错误次数
                $_SESSION[static::SESSION_MESSAGE_CODE_COUNT]++;
            }

            if ($_SESSION[static::SESSION_MESSAGE_CODE_COUNT] >= 5) {
                // 尝试超过5次，销毁 session
                $this->unsetCode();
            }
            return 0;
        }
    }

}

```

# 总结

验证码的加入本质是为了提升系统的安全性，因此在设计的过程中也要充分考虑安全性的问题。及时做 session 的销毁处理能够有效防止用户对验证码的暴力破解。
