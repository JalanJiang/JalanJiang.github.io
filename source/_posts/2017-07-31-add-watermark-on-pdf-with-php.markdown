---
title:       使用 PHP 在 PDF 文档中加水印并进行文档加密
description: FPDI + TFPDF，在 PHP 中操作 PDF 文档
date:       2017-08-08 20:17:00
categories:
    - Web屠龙刀
tags:
    - PHP
---

## 前言

在使用 PHP 在 PDF 文件上打水印的过程中，我尝试了如下几个工具：

- [FPDI][1]
- [FPDF][2]
- [TCPDF][3]
- TFPDF

因为想满足对中文水印的支持，并对 PDF 文档进行加密，最终使用 FPDI + TCPDF 的方案完成功能。

## 正文

### 打水印类

```
<?php

require_once ('./fpdi/TCPDF/tcpdf.php');
require_once('./fpdi/fpdi.php');

class Pdf_Watermark extends FPDI {
    
    protected $angle = 0;
    protected $extgstates = array();

    public function __construct() {
        parent::__construct();
    }

    /**
     * 旋转角度
     * @param $angle
     * @param int $x
     * @param int $y
     */
    protected function _rotate($angle, $x=-1, $y=-1) {
        if ($x == -1)
            $x == $this->x;
        if ($y == -1)
            $y == $this->y;
        if ($this->angle != 0)
            $this->_out('Q');
        $this->angle = $angle;
        if ($angle != 0) {
            $angle *= M_PI / 180;
            $c = cos($angle);
            $s = sin($angle);
            $cx = $x * $this->k;
            $cy = ($this->h - $y) * $this->k;
            $this->_out(sprintf('q %.5F %.5F %.5F %.5F %.2F %.2F cm 1 0 0 1 %.2F %.2F cm',$c,$s,-$s,$c,$cx,$cy,-$cx,-$cy));
        }
    }

    /**
     * 旋转文字角度
     * @param $x
     * @param $y
     * @param $txt
     * @param $angle
     */
    public function RotatedText($x, $y, $txt, $angle)
    {
        //Text rotated around its origin
        $this->_rotate($angle,$x,$y);
        $this->Text($x,$y,$txt);
        $this->_rotate(0);
    }

    /**
     * 旋转图片角度
     * @param $file
     * @param $x
     * @param $y
     * @param $w
     * @param $h
     * @param $angle
     */
    public function RotatedImage($file, $x, $y, $w, $h, $angle)
    {
        //Image rotated around its upper-left corner
        $this->_rotate($angle,$x,$y);
        $this->Image($file,$x,$y,$w,$h);
        $this->_rotate(0);
    }

    /**
     * 设置字体颜色
     * @param $hexStr
     */
    public function SetTextColorByHexStr($hexStr) {
        $rgbArray = $this->_hex2rgb($hexStr);
        if (is_array($rgbArray)) {
            $this->SetTextColor($rgbArray['red'], $rgbArray['green'], $rgbArray['blue']);
        }
    }

    /**
     * 16进制颜色代码转RGB值
     * @param string $hexStr (hexadecimal color value)
     * @param boolean $returnAsString (if set true, returns the value separated by the separator character. Otherwise returns associative array)
     * @param string $seperator (to separate RGB values. Applicable only if second parameter is true.)
     * @return array or string (depending on second parameter. Returns False if invalid hex color value)
     */
    protected function _hex2rgb($hexStr, $returnAsString = false, $seperator = ',') {
        $hexStr = preg_replace("/[^0-9A-Fa-f]/", '', $hexStr); // Gets a proper hex string
        $rgbArray = array();
        if (strlen($hexStr) == 6) { //If a proper hex code, convert using bitwise operation. No overhead... faster
            $colorVal = hexdec($hexStr);
            $rgbArray['red'] = 0xFF & ($colorVal >> 0x10);
            $rgbArray['green'] = 0xFF & ($colorVal >> 0x8);
            $rgbArray['blue'] = 0xFF & $colorVal;
        } elseif (strlen($hexStr) == 3) { //if shorthand notation, need some string manipulations
            $rgbArray['red'] = hexdec(str_repeat(substr($hexStr, 0, 1), 2));
            $rgbArray['green'] = hexdec(str_repeat(substr($hexStr, 1, 1), 2));
            $rgbArray['blue'] = hexdec(str_repeat(substr($hexStr, 2, 1), 2));
        } else {
            return false; //Invalid hex color code
        }
        return $returnAsString ? implode($seperator, $rgbArray) : $rgbArray; // returns the rgb string or the associative array
    }
}
```

### 继承顺序

程序依赖 `FPDI` 读取已存在的 PDF 文档，依赖 `TCPDF` 处理 PDF 文档。程序继承顺序如下：

1. `Pdf_Watermark extends FPDI`
2. `FPDI extends FPDF_TPL`
3. `FPDF_TPL extends fpdi_bridge`
4. `fpdi_bridge` 根据引入的类是 `TCPDF` 还是 `FPDF` 进行选择继承

因此，在使用 `FPDI` 读取文件后，可以选择使用 `TCPDF` 或 `FPDF` 对文档进行处理。

### 调用方法

```
require_once('PdfWatermark.php');


function pdf_set_watermark_text($file, $newFile, $text, $text_color, $font_style, $font_size, $alpha, $margin_left, $margin_top, $angle) {

    try {

        $pdf = new Pdf_Watermark();
        $pageCount = $pdf->setSourceFile($file);

        // 循环读取分页
        for ($i = 1; $i <= $pageCount; $i++) {

            // 加密文档
            $pdf->SetProtection(array('print', 'modify', 'copy', 'annot-forms'));
            $pdf->addPage();
            $tplidx = $pdf->importPage($i);

            // 获取 pdf 长宽
            $whArray   = $pdf->getTemplateSize($tplidx);
            $pdfWidth  = $whArray['w'];
            $pdfHeight = $whArray['h'];

            // 如果将最后一个参数 $adjustPageSize 设置为TRUE，则当前的pdf页面大小会根据模板自适应。
            $pdf->useTemplate($tplidx, null, null, 0, 0, TRUE);

            for ($j = 0; $j < 9; $j++) {
            	// 设置字体
                $pdf->SetFont('helvetica', 'B', $font_size);
                $pdf->SetAlpha($alpha);
                // 设置文字颜色
                $pdf->SetTextColorByHexStr($text_color);
                // 设置文字位置
                $pdf->RotatedText($margin_left+$j*30, $margin_top+$j*30, $text, $angle);
                $pdf->SetAlpha(1);
            }
        }
        // pdf文档在浏览器中输出显示
        $pdf->Output($newFile, 'I');

    } catch (Exception $ex) {
        return false;
    }
    return true;
}


$pdfFile = 'test.pdf';
$newFile = 'word.pdf';
$watermark_text = 'abc';

$text_color = '#CFCFCF';
$font_style = 'B';
$font_size = 25;
$alpha = 0.5;
$margin_left = 10;
$margin_top = 10;
$angle = 45;
pdf_set_watermark_text($pdfFile, $newFile, $watermark_text, $text_color, $font_style, $font_size, $alpha, $margin_left, $margin_top, $angle);
```

### FPDI的限制

FPDI 的免费版本只能读取版本 <1.5 的 pdf 文档，为了兼容所有的 pdf 文档需要做一些处理。

如果不在乎 money，可以直接使用付费工具 [FPDI PDF-Parser][4] 来解决这个问题。

我在这里选择了使用 [PDFtk][5] 命令行工具，通过在 PHP 中执行如下代码对 pdf 文档进行处理：

```
exec("pdftk input_file.pdf output output_file.pdf");
```

这样，处理过后的 output_file.pdf 就能使用上诉方法添加水印了。

附：[PDFtk 的各种安装姿势][6]。

### 关于中文显示

新版本的 TCPDF 已支持中文，在 `TCPDF/fonts` 目录下存在 `cid0cs.php` 与 `stsonstdlight.php` 均能有效支持中文显示。

可以使用 `setFont` 方法进行调用：

```
// 设置字体
$pdf->SetFont('cid0cs', '', $font_size);
```

```
// 设置字体
$pdf->SetFont('stsongstdlight', '', $font_size);
```

## 总结

在研究给 PDF 文档打水印的过程中一波三折。

因为一开始选用的 `FPDF` 不支持 utf-8 编码，转战 `TFPDF` 开始捣鼓中文字体包，最终因为需要加密文档选择了更加方便的 `TCPDF`。

总的来说，开发前还是要仔细阅读参考文档啊，泪目。

## 参考资料

- 《[纯php为pdf文件添加水印的方法][7]》


[1]: https://www.setasign.com/products/fpdi/demos/simple-demo/
[2]: http://www.fpdf.org/
[3]: https://tcpdf.org/
[4]: https://www.setasign.com/products/fpdi-pdf-parser/details
[5]: https://www.pdflabs.com/tools/pdftk-the-pdf-toolkit/
[6]: https://www.pdflabs.com/docs/install-pdftk-on-redhat-or-centos/
[7]: http://www.yangchaoblog.com/posts/method-for-pure-php-pdf-file-to-add-the-watermark.html




