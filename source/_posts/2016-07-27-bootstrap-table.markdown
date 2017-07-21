---
title:      Bootstrap Table初体验
description:   在Bootstrap中风骚地使用Table
date:       2016-07-27 20:28:00
categories:
    - Web屠龙刀
tags:
    - Bootstrap
---

# 前言

我的基友[进球](http://www.weibo.com/u/5019776648?refer_flag=1005050005_&is_all=1)这几天因为团队任务寝食难安且智商--，听说是因为搞不定`Ajax`的数据请求。我一开始以为就是原生的`Ajax`，`new`一个`XMLHttpRequest`就好了吧，或者直接使用`jQuery`封装好的方法也能搞定。或许只是前端妹纸没有处理过服务器传来的数据，所以比较生疏吧。

今天进球告诉我，他们团队用的是`AngularJS`框架，要在一个表格内显示数据。

所以应该是要酱紫进行双向绑定咯？

    <html>
    <head>
    <title>Angular JS Includes</title>
    </head>
    <body>
    <h2>AngularJS Sample Application</h2>
    <div ng-app="" ng-controller="studentController">
    <table>
       <tr>
          <th>Name</th>
          <th>Roll No</th>
    	  <th>Percentage</th>
       </tr>
       <tr ng-repeat="student in students">
          <td>{{ student.Name }}</td>
          <td>{{ student.RollNo }}</td>
    	  <td>{{ student.Percentage }}</td>
       </tr>
    </table>
    </div>
    <script>
    function studentController($scope,$http) {
    var url="data.json";
       $http.get(url).success( function(response) {
                               $scope.students = response;
                            });
    }
    </script>
    <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.2.15/angular.min.js"></script>
    </body>
    
等传来项目源代码后我发现我又想错了……

原来他们用的是`Bootstrap Table`。

----------


# 正文

----------


## 什么是BootstrapTable？

`Bootstrap Table`是`Bootstrap`的一个组件，也被称为表格组件神器，可以让用户在编辑`Table`时更加方便、快捷。

----------


## BootstrapTable如何使用？

帮基友解决的主要问题是：在`Table`上显示从服务端返回的数据。因为服务端的接口还没有开发好，这里先使用`.do`文件代替。

假设要显示一个`<th>`如下的表格：

<table>
    <tr>
        <th>名称</th>
        <th>邮件</th>
        <th>部门</th>
        <th>测试</th>
    </tr>
</table>

首先，搭建一个最基本的`Table`：

    <div class="row">
        <div class="fu db alg">
            <table data-toggle="table" class="user-list" data-classes="table">
            <!-- Table Body -->
            </table>
        </div>
    </div>

通过`JavaScript`设置`Table`的字段，并请求`.do`的数据，将数据显示在`Table`上。

    $("table.user-list").bootstrapTable({
        locale: 'zh-US',
        method: "get",  //使用get请求到服务器获取数据
        contentType: "application/x-www-form-urlencoded",
        url: "../UserOperation/findUsers.do",  //获取数据的Servlet地址
        striped: true,  //表格显示条纹
        pagination: true, //启动分页
        pageSize: 10,  //每页显示的记录数
        sidePagination: "server", //表示服务端请求
        //设置Table字段
        columns: [
            {
                field: 'Name',
                title: '名称'
            },
            {
                field: 'Email',
                title: '邮件'
            },
            {
                field: 'Department',
                title: '部门'
            },
            {
                field: 'test',
                title: '测试'
            }]
    });

参考了一些教程，都说如果是服务端分页，返回的数据结果必须包含`total`、`rows`两个参数。于是参考了一段服务端的代码：

    public JsonResult GetDepartment(int limit, int     offset, string departmentname, string statu)
    {
        var lstRes = new List<Department>();
        for (var i = 0; i < 50; i++) {
            var oModel = new Department();
            oModel.ID = Guid.NewGuid().ToString();
            oModel.Name = "销售部" + i ;
            oModel.Level = i.ToString();
            oModel.Desc = "暂无描述信息";
            lstRes.Add(oModel);
        }

        var total = lstRes.Count;
        var rows = lstRes.Skip(offset).Take(limit).ToList();
        return Json(new { total = total, rows = rows }, JsonRequestBehavior.AllowGet);
    }

稍加分析，发现返回的`JSON`数据结构应该是这样的：

    {
        "total": 3,
        "rows": [
            {
                "ID": "",
                "Name": "",
                "Level": "",
                "Desc": ""
            },
            {
                "ID": "",
                "Name": "",
                "Level": "",
                "Desc": ""
            },
            {
                "ID": "",
                "Name": "",
                "Level": "",
                "Desc": ""
            }
        ]
    }

其中的`ID`、`Name`、`Level`、`Desc`就是表格中设置的`field`了。

于是，我们要请求的`findUsers.do`文件中的数据应该这样表达：

    {
        "total": 3,
        "rows": [
            {
                "Name": "Jalan",
                "Email": "jalanjiang@outlook.com",
                "Department": "Web",
                "test": "测试数据"
            },
            {
                "Name": "Jalan2",
                "Email": "jalanjiang@outlook.com",
                "Department": "Web",
                "test": "测试数据2"
            },
            {
                "Name": "Jalan3",
                "Email": "jalanjiang@outlook.com",
                "Department": "Web",
                "test": "测试数据3"
            }
        ]
    }
    
测试结果如下：

![](/img/in-post/bootstrap-table/table-result.png)

----------


# 结尾

这是我对`Bootstrap Table`的初次接触，也只是`Bootstrap Table`使用的冰山一角。`Bootstrap Table`还有很多设置可供用户自由选择，详情可见[官方文档](http://bootstrap-table.wenzhixin.net.cn/)。

----------


## 参考资料

- [《JS组件系列——表格组件神器：bootstrap table》](http://www.cnblogs.com/landeanfen/p/4976838.html)
