---
title:       记一次踩坑 之 PHP 写文件相关操作失败
description: 哭泣，写着写着就失败了
date:       2018-07-13 10:40:00
categories:
    - Web屠龙刀
tags:
    - PHP
---

## 前言

代码都没改，用着用着突然就不能上传图片了，诡异至极……

断点看了一下在创建图片文件夹时返回了创建失败的错误，创建文件夹是使用 `@mkdir` 实现的。

```php
private function _mkdir($dir, $mode = 0777)
{
    if (!is_dir($dir)) {
        $temp = explode('/', $dir);
        $cur_dir = '';
        for ($i = 0; $i < count($temp); $i++) {
            $cur_dir .= $temp [$i] . '/';
            if (!is_dir($cur_dir)) {
                @mkdir($cur_dir, 0777, true);
                @chmod($cur_dir, $mode);
            }
        }
    }
}
```

- 没有代码改动突然失败，不是代码层面的问题
- 直接手动执行 `mkdir` 可以成功，说明是 PHP 运行 `mkdir` 的问题，也许与用户角色有关

## 解决方法

尝试了各种各样 catch 错误的姿势都失败了，啥错误也没有打印出来。

```php
try {
   mkdir('/somedir');
} catch(ErrorException $ex) {
   echo "Error: " . $ex->getMessage();
}
```

最终兜兜转转终于搜索到了下面这个答案：

> I have similar problem and I found out,that I have no frees pace left on my drive. Check with command df(on linux) how full is your drive. It is possible that root is allowed to create files and folders in this situation, because he has pre-reserved space. If you run you script from command line as root user - there is no error, but if your script is run by apache, then error occure.

于是乎 `df` 看了一眼……

![](/img/in-post/php-write-file-error/full-drive.png)

果然是磁盘满了。

之后也出现过一次 `@file_put_contents` 操作失败，也是相同的问题。