---
title:      PHP 通过比对十六进制 RGB 查找最接近色值
description: 一场关于颜色的较量
date:       2018-01-10 15:58:00
categories:
    - Web屠龙刀
tags:
    - PHP
---

最近在项目中遇到这样的需求：需要在一组色值中找到最接近色值 A 的色值 B。给出的色值数据均是十六进制格式的，例如 `#F82587`。下面总结下我的解决思路。

## 先聊聊 RGB

由于网页(WEB)是基于计算机浏览器开发的媒体，所以颜色以光学颜色RGB（红、绿、蓝）为主。网页颜色是以16进制代码表示，一般格式为 `#DEFABC`（字母范围从A-F,数字从0-9 ）。

如黑色，在网页代码中便是：`#000000`(在css编写中可简写为#000)。当颜色代码为 `#AABB11` 时，可以简写为 `#AB1` 表示，如 `#135`与 `#113355` 表示同样的颜色。

## 如何从十六进制转为 RGB 值

因为 RGB 的颜色表示分为红、绿、蓝三个通道，为了方便计算两值之间的差距，我们要先把十六进制的 RGB 表示法转变为 `rgb(r, g, b)` 三通道数值表示法。

```
    /**
     * 十六进制转rgb
     * @param string $hexColor 十六进制代码
     * @return array
     */
    function hex2rgb($hexColor)
    {
        $color = str_replace('#', '', $hexColor);
        if (strlen($color) > 3) {
            $rgb = array(
                'r' => hexdec(substr($color, 0, 2)),
                'g' => hexdec(substr($color, 2, 2)),
                'b' => hexdec(substr($color, 4, 2))
            );
        } else {
            // 考虑简写情况
            $color = $hexColor;
            $r = substr($color, 0, 1) . substr($color, 0, 1);
            $g = substr($color, 1, 1) . substr($color, 1, 1);
            $b = substr($color, 2, 1) . substr($color, 2, 1);
            $rgb = array(
                'r' => hexdec($r),
                'g' => hexdec($g),
                'b' => hexdec($b)
            );
        }
        return $rgb;
    }
```

## 如何对比色值接近度

可以将两组 RGB 值看作三维空间的两个点 `(r1, g1, b1)` 和 `(r2, g2, b2)`，判断两组颜色的相近度就像判断三维空间两个点的距离。

```
    /**
     * 计算色值距离
     * @param $rgb1
     * @param $rgb2
     * @return float|int
     */
    function caculateColorDist($rgb1, $rgb2)
    {
        $r = $rgb1['r'] - $rgb2['r'];
        $g = $rgb1['g'] - $rgb2['g'];
        $b = $rgb1['b'] - $rgb2['b'];

        $dist = $r * $r + $g * $g + $b * $b;
        return sqrt($dist);
    }
```

最终算出的 `sqrt($dist)` 越小，两个色值就越接近。

## 参考资料

- [RGB to closest predefined color](https://stackoverflow.com/questions/4485229/rgb-to-closest-predefined-color)



