---
title:      FineUploader的使用姿势
description:  File uploading without the hassle.
date:       2017-02-16 19:25:00
categories:
    - Web屠龙刀
tags:
    - JavaScript
    - PHP
---

# 前言

`FineUploader`是基于`Javascript`的文件上传组件，支持多文件上传、拖拽上传、文件删除等功能，可以说相当强大。

关于`FineUploader`的介绍和安装教程在[官方网站][1]中已有详细的描述，在此仅对我在开发过程中使用`FineUploader`的方式稍作记录，权当做对部分官方文档的翻译吧。


# 正文

在开始之前首先下载`FineUploader`的核心代码包，可以从[官网][2]直接下载，或从[`github`项目][3]`clone`，也可以直接使用`npm`安装。

`FineUploader`因`Server`端的不同，又分为：

1. Traditional / Generic Endpoint Uploader

2. Amazon S3 Uploader

3. Azure Blob Storage Uploader

因为是直接在本地开发环境搭建使用，所以选择`Traditional`进行安装。


### 1 引入核心代码与样式

``` html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
     <!-- 引入样式文件 -->
    <link href="fine-uploader/fine-uploader-gallery.min.css" rel="stylesheet">
     <!-- 引入js脚本文件 -->
    <script src="fine-uploader/fine-uploader.min.js"></script>
    <title>Upload your files</title>
</head>
<body>
    <script>
        // Some options to pass to the uploader are discussed on the next page
        var uploader = new qq.FineUploaderBasic({...})
    </script>
</body>
</html>
```
### 2 设置模板

``` html
<script type="text/template" id="qq-template">
        <div class="qq-uploader-selector qq-uploader qq-gallery" qq-drop-area-text="Drop files here">
            <div class="qq-total-progress-bar-container-selector qq-total-progress-bar-container">
                <div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" class="qq-total-progress-bar-selector qq-progress-bar qq-total-progress-bar"></div>
            </div>
            <div class="qq-upload-drop-area-selector qq-upload-drop-area" qq-hide-dropzone>
                <span class="qq-upload-drop-area-text-selector"></span>
            </div>
            <div class="qq-upload-button-selector qq-upload-button">
                <div>上传试卷</div>
            </div>
            <span class="qq-drop-processing-selector qq-drop-processing">
                <span>Processing dropped files...</span>
                <span class="qq-drop-processing-spinner-selector qq-drop-processing-spinner"></span>
            </span>
            <ul class="qq-upload-list-selector qq-upload-list" role="region" aria-live="polite" aria-relevant="additions removals">
                <li>
                    <span role="status" class="qq-upload-status-text-selector qq-upload-status-text"></span>
                    <div class="qq-progress-bar-container-selector qq-progress-bar-container">
                        <div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" class="qq-progress-bar-selector qq-progress-bar"></div>
                    </div>
                    <span class="qq-upload-spinner-selector qq-upload-spinner"></span>
                    <div class="qq-thumbnail-wrapper">
                        <img class="qq-thumbnail-selector" qq-max-size="120" qq-server-scale>
                    </div>
                    <button type="button" class="qq-upload-cancel-selector qq-upload-cancel">X</button>
                    <button type="button" class="qq-upload-retry-selector qq-upload-retry">
                        <span class="qq-btn qq-retry-icon" aria-label="Retry"></span>
                        Retry
                    </button>

                    <div class="qq-file-info">
                        <div class="qq-file-name">
                            <span class="qq-upload-file-selector qq-upload-file"></span>
                            <span class="qq-edit-filename-icon-selector qq-btn qq-edit-filename-icon" aria-label="Edit filename"></span>
                        </div>
                        <input class="qq-edit-filename-selector qq-edit-filename" tabindex="0" type="text">
                        <span class="qq-upload-size-selector qq-upload-size"></span>
                        <button type="button" class="qq-btn qq-upload-delete-selector qq-upload-delete">
                            <span class="qq-btn qq-delete-icon" aria-label="Delete"></span>
                        </button>
                        <button type="button" class="qq-btn qq-upload-pause-selector qq-upload-pause">
                            <span class="qq-btn qq-pause-icon" aria-label="Pause"></span>
                        </button>
                        <button type="button" class="qq-btn qq-upload-continue-selector qq-upload-continue">
                            <span class="qq-btn qq-continue-icon" aria-label="Continue"></span>
                        </button>
                    </div>
                </li>
            </ul>

            <dialog class="qq-alert-dialog-selector">
                <div class="qq-dialog-message-selector"></div>
                <div class="qq-dialog-buttons">
                    <button type="button" class="qq-cancel-button-selector">Close</button>
                </div>
            </dialog>

            <dialog class="qq-confirm-dialog-selector">
                <div class="qq-dialog-message-selector"></div>
                <div class="qq-dialog-buttons">
                    <button type="button" class="qq-cancel-button-selector">No</button>
                    <button type="button" class="qq-ok-button-selector">Yes</button>
                </div>
            </dialog>

            <dialog class="qq-prompt-dialog-selector">
                <div class="qq-dialog-message-selector"></div>
                <input type="text">
                <div class="qq-dialog-buttons">
                    <button type="button" class="qq-cancel-button-selector">Cancel</button>
                    <button type="button" class="qq-ok-button-selector">Ok</button>
                </div>
            </dialog>
        </div>
    </script>
```

### 3 上传选项配置

``` html
<script>
        // Some options to pass to the uploader are discussed on the next page
        var uploader = new qq.FineUploader({
            // 开启debug模式，用于检测程序是否有错
            debug: true,
            element: document.getElementById("uploader"),
            request: {
            	// 服务端URL，用于处理上传请求
                endpoint: "/exam/paper/upload_paper"
            },
            deleteFile: {
                // 开启文件删除功能
                enabled: true,
                // 用于删除的服务端URL
                endpoint: "/exam/paper/upload_paper"
            },
            chunking: {
                enabled: true,
                concurrent: {
                    enabled: true
                },
                success: {
                    endpoint: "/exam/paper/upload_paper?done"
                }
            },
            resume: {
                enabled: true
            },
            retry: {
                // 开启上传重试功能，默认情况下关闭
                enableAuto: true,
                showButton: true
            }
        })
    </script>
```

配置成功后可以看到前端的上传入口：

![前端上传入口样式][4]

### 4 写一个简单的服务端

我使用`PHP`语言进行服务端的编写，在官方提供的[`git`仓库][5]中也有范例。其中的核心类是`UploadHandler`，自己简单地封装了一个类，用于`Excel`格式的试卷上传。

``` php
class Uploadpaper extends Controller
{

    private $uploader;
    static private $alloweExtensions = array('xls', 'xlsx');
    const INPUT_NAME = 'qqfile';
    // 设置上传目录
    const UPLOAD_DIRE = 'paper/';

    // 数据预处理
    public function before()
    {
        $this->uploader = new \Fw\UploadHandler();

        // 设置合法后缀
        $this->uploader->allowedExtensions = self::$alloweExtensions;
        // 设置文件大小限制
        $this->uploader->sizeLimit = null;
        // Specify the input name set in the javascript.
        $this->uploader->inputName = self::INPUT_NAME; // matches Fine Uploader's default inputName value by default
        // If you want to use the chunking/resume feature, specify the folder to temporarily save parts.
        $this->uploader->chunksFolder = "chunks";
    }

    public function main()
    {
        // 执行步骤1:文件上传
        $uploadResult = $this->uploadAction($this->getRequestMethod());
    ｝

    /**
     * 获取请求方式
     * @return mixed
     */
    private function getRequestMethod() {
        global $HTTP_RAW_POST_DATA;
        if(isset($HTTP_RAW_POST_DATA)) {
            parse_str($HTTP_RAW_POST_DATA, $_POST);
        }
        if (isset($_POST["_method"]) && $_POST["_method"] != null) {
            return $_POST["_method"];
        }
        return $_SERVER["REQUEST_METHOD"];
    }

    /**
     * 上传文件
     * @param $method
     */
    private function uploadAction($method)
    {
        if ($method == "POST") {
            header("Content-Type: text/plain");
            // Assumes you have a chunking.success.endpoint set to point here with a query parameter of "done".
            // For example: /myserver/handlers/endpoint.php?done
            if (isset($_GET["done"])) {
                $result = $this->uploader->combineChunks(self::UPLOAD_DIRE);
            }
            // 处理上传请求
            else {
                // Call handleUpload() with the name of the folder, relative to PHP's getcwd()
                $result = $this->uploader->handleUpload(self::UPLOAD_DIRE);
                // To return a name used for uploaded file you can use the following line.
                $result["uploadName"] = $this->uploader->getUploadName();
                // 上传成功则读入数据库
                if($result['success']) {
                    // ......
                }
            }
            // 输出json格式结果
            echo json_encode($result);
        }
        // 处理删除请求
        else if ($method == "DELETE") {
            $result = $this->uploader->handleDelete(self::UPLOAD_DIRE);
            // 删除成功则删除数据库信息
            if($result['success']) {
            	// ......
            }
            echo json_encode($result);
        }
        else {
            header("HTTP/1.0 405 Method Not Allowed");
        }

        //return $result;
    }
}
```

至此，基本的核心代码都已编写完成，能实现文件上传、拖拽上传、文件删除和重新上传的功能。在`Linux`系统下的同学要注意保存文件的目录需有访问权限。

# 参考资料

[FineUploader官方文档][1]

  [1]: http://fineuploader.com/
  [3]: https://github.com/FineUploader/fine-uploader.git
  [4]: /img/in-post/how-to-use-fineuploader/web-template.jpg "web-template.jpg"
  [5]: https://github.com/FineUploader/php-traditional-server
