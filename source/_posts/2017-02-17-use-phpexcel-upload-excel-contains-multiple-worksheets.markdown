---
layout:     post
title:      使用PHPExcel读取多工作表的Excel文件
description:   Read, Write and Create spreadsheet documents in PHP.
date:       2017-02-16 19:25:00
categories:
    - Web屠龙刀
tags:
    - PHP
---

# 前言

最近在开发一个线上笔试系统，后台需要直接使用Excel表导入试题数据。在开发导入Excel试题的功能时使用了用于操作Excel文件的PHP库——PHPExcel。

用于记录试题的Excel板拥有多个工作表（Sheet），因此需要使用PHPExcel实现多个Sheet信息的读取。

# 正文

## 1 在项目中引入PHPExcel

首先在PHPExcel的[git仓库][1]获取代码包，其中，核心类都在`/Classes`目录中，我们需要把`/Classes`目录copy到自己的项目中。

**PHPExcel不支持命名空间，所以在支持命名空间的Framework中导入PHPExcel需要使用直接导入的方法。**（我一开始还妄图给PHPExcel加入命名空间，哭泣 qwq）

## 2 使用PHPExcel读取多个Sheet

### 2.1 引入所需类

``` php
require_once VENDOR_PATH.'/PHPExcel.php';
require_once VENDOR_PATH.'/PHPExcel/IOFactory.php';
```

### 2.2 创建读取方法


``` php
    private function excelAction($paperPath, $paperName)
    {
    	// 创建excel读取对象，用于excel－2007格式
        $reader = \PHPExcel_IOFactory::createReader('Excel2007');
        // 加载文档
        $PHPExcel = $reader->load(PAPER_PATH.$paperPath);
        // 获取excel中工作表的总数
        $sheetCount = $PHPExcel->getSheetCount();

	// 循环读取SHEET_COUNT个工作表
        for ($currentSheet = 1; $currentSheet < SHEET_COUNT; $currentSheet++) {
            // 根据工作表编号获取工作表内容
            $sheet = $PHPExcel->getSheet($currentSheet);
            // 取得总行数
            $highestRow = $sheet->getHighestRow();
            // 取得总列数
            $highestColumn = $sheet->getHighestColumn();

            echo "第 $currentSheet 个工作表,行数 ＝ $highestRow ，列数 = $highestColumn "."</br>";

            /** 循环读取每个单元格的数据 */
            // 行数是以第1行开始
            for ($row = 1; $row <= $highestRow; $row++){
                // 列数是以A列开始
                for ($column = 'A'; $column <= $highestColumn; $column++) {
                    if(!$sheet->getCell($column.$row)->getValue()) break;
                    $dataset[] = $sheet->getCell($column.$row)->getValue();
                    // 输出数据
                    echo $column.$row.":".$sheet->getCell($column.$row)->getValue()."<br />";
                }
            }
        }
    }
```

## 3 总结

在PHPExcel中能读取文件的类有很多个（针对不同的文件类型），使用`PHPExcel_IOFactory`仅是方法之一。在官方给出的Example中写入文件的例子较多，读取的例子则会比较少些。

在读取多个工作表的功能中，主要的方法是`getSheetCount()`和`getSheet()`，运用这两个方法可以对工作表进行循环读取。


# 参考资料
《[总结了下PHPExcel官方读取的几个例子][2]》


  [1]: https://github.com/PHPOffice/PHPExcel/
  [2]: http://blog.csdn.net/beyond__devil/article/details/53457849
