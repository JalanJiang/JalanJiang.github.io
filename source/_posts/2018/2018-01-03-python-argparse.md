---
layout:     post
title:      "Python命令行解析库argparse"
description:   "来自命令行的诸多参数"
date:       2018-01-03 12:00:00
categories:
    - Web屠龙刀
tags:
    - Python
toc: true
---

# 使用场景

argparse 用于解析命令行参数，例如

```
python parseTest.py input.txt output.txt --user=name --port=8080
```

# 使用步骤

```
import argparse
parser = argparse.ArgumentParser()
parser.add_argument()
parser.parse_args()
```

## 创建解析器

创建一个 ArgumentParser 实例对象。

```
import argparse
parser = argparse.ArgumentParser()
```

```
ArgumentParser(prog=None, usage=None,description=None, epilog=None, parents=[],formatter_class=argparse.HelpFormatter, prefix_chars='-',fromfile_prefix_chars=None, argument_default=None,conflict_handler='error', add_help=True)
```

参数：

- prog：程序名称
- usage：描述程序用途的字符串
- description：help 信息前的文字
- epilog：help 信息后的信息
- parents=[]：由 ArgumentParser 对象组成的列表，它们的 arguments 选项会被包含到新 ArgumentParser 对象中
- formatter_class：help信息输出的格式
- argument_default：参数的全局默认值。例如，要禁止 parse_args 时的参数默认添加
- conflict_handler：解决冲突的策略
- add_help：设为False时，help信息里面不再显示 -h --help 信息


**注**：
当参数过多时，可以将参数放到文件中读取，例如 `parser.parse_args(['-f', 'foo', '@args.txt'])` 解析时会从文件 args.txt 读取信息。

## 添加参数选项

```
add_argument(name or flags...[, action][, nargs][, const][, default][, type][, choices][, required][, help][, metavar][, dest])
```

参数：

- name or flags：参数有两种，可选参数和位置参数
    - 可选参数
        - `-`：短参数
        - `--`：长参数
```
#定义了可选参数 -o 或 -output，通过解析后，将值保存在 args.output 中
parser.add_argument("-o", "--output")
```
- action：默认为 store（需要指定参数值，否则报错）
    - 当设置 `action='store_true'` 时，不需要指定参数值。但实际上存储的是 `True` 和 `False`。若参数出现为 `True`，否则为 `False`
- nargs：参数的数量
- const：保存一个常量
- default：默认值
- type：参数类型
    - 默认为 str
    - 传入参数类型错误将直接报错
```
parser.add_argument('x', type=int, help="the base")
```
- choices：可供选择的值
    - 限定取值范围
```
parser.add_argument("-v", "--verbosity", type=int, choices=[0, 1, 2], help="increase output verbosity")`
```
- required：是否必选
- help：自定义帮助信息
```
parser.add_argument("echo", help="echo the string you use here")
```
- desk：可作为参数名

## 解析参数

```
args = parser.parse_args()
```

取参数值时使用 `args.参数名`。

# 参考资料

- [Python命令行解析库argparse](https://www.cnblogs.com/linxiyue/p/3908623.html)
- [python学习之argparse模块](https://www.2cto.com/kf/201412/363654.html)
- [python argparse用法总结](https://www.jianshu.com/p/fef2d215b91d)
- [ python Argparse模块的使用](http://blog.csdn.net/u012005313/article/details/50111455)