---
title:      PHP反射API
description: 深入PHP面向对象模式高级特性
date:       2017-07-24 20:17:00
categories:
    - Web屠龙刀
tags:
    - PHP
---

## 什么是反射API

PHP 中的反射 API 由一系列可以分析属性、方法和类的内置类组成。

一些常用的反射 API 如下：

| 类                  | 描述                       |
| ------------------- | -------------------------- |
| Reflection          | 为类的摘要信息提供静态函数 |
| ReflectionClass     | 类信息和工具               |
| ReflectionMethod    | 类方法信息和工具           |
| ReflectionParameter | 方法参数信息               |
| ReflectionProperty  | 类属性信息                 |
| ReflectionFunction  | 函数信息和工具             |
| ReflectionExtension | PHP扩展信息                |
| ReflectionException | 错误类                     |

利用这些类，可以在运行时访问对象、函数和脚本中的扩展的信息。

## 获取类的相关信息

随意编写一个测试类：

```
class testDemo
{
    private $test;

    public function __construct()
    {
        $this->test = 'test';
    }

    public function __destruct()
    {
        // TODO: Implement __destruct() method.
    }

    public function getTest()
    {
        return $this->test;
    }
}
```

使用 `Reflection::export()` 获取类的相关信息。

```
$test_calss = new ReflectionClass('testDemo');
Reflection::export($test_calss);
```

运行结果：

```
Class [ class testDemo ] {
    @@ /Users/www/test/reflection.php 3-21 - Constants [0] {}

    - Static properties [0] {
      }
    - Static methods [0] {
      }
    - Properties [1] {
        Property [ private $test ]
      }
    - Methods [3] {
        Method [ public method __construct ] {
            @@ /Users/www/test/reflection.php 7 - 10
        }

        Method [ public method __destruct ] {
            @@ /Users/www/test/reflection.php 12 - 15
        }

        Method [ public method getTest ] {
            @@ /Users/www/test/reflection.php 17 - 20
        }

      }
    }
```

这些信息包括：

- 属性和方法的访问控制状态
- 每个方法需要的参数
- 每个方法在脚本文档中的位置

## 检查类

检查类属于哪种类型：

```
function classData(ReflectionClass $class)
{
    $details = "";
    // 返回要检查的类名
    $name = $class->getName();

    // 是否为用户定义
    if($class->isUserDefined()) {
        $details .= "$name is user defined\n";
    }

    // 是否为内置类
    if($class->isInternal()) {
        $details .= "$name is built-in\n";
    }

    // 测试类是否是接口
    if($class->isInterface()) {
        $details .= "$name is an abstract class\n";
    }

    // 测试一个类是否是抽象的
    if($class->isAbstract()) {
        $details .= "$name is abstract class\n";
    }

    if($class->isFinal()) {
        $details .= "$name is final calss\n";
    }

    // 类是否被实例化过
    if($class->isInstantiable()) {
        $details .= "$name is a final class\n";
    } else {
        $details .= "$name can not be instantiated\n";
    }

    return $details;
}

$test_calss = new ReflectionClass('testDemo');
print classData($test_calss);
```

## 检查方法

```
$test_class = new ReflectionClass('testDemo');
// 使用 ReflectionClass::getMethods() 得到 ReflectionMethod 对象数组
$methods = $test_class->getMethods();

foreach ($methods as $method) {
    print methodData($method);
    print "\n-------\n";
}

function methodData(ReflectionMethod $method)
{
    $details = "";
    $name = $method->getName();

    // 是否为用户定义
    if($method->isUserDefined()) {
        // ...
    }

    // 是否内置
    if($method->isInternal()) {
        // ...
    }

    // 是否抽象
    if($method->isAbstract()) {
        // ...
    }

    if($method->isPublic()) {
        // ...
    }

    if($method->isProtected()) {
        // ...
    }

    if($method->isPrivate()) {
        // ...
    }

    if($method->isStatic()) {
        // ...
    }

    if($method->isFinal()) {
        // ...
    }

    // 是否为类的构造方法
    if($method->isConstructor()) {
        // ...
    }

    // 是否返回引用
    if($method->returnsReference()) {
        // ...
    }

    return $details;
}
```

## 检查方法参数

```
$test_class = new ReflectionClass('testDemo');
$method = $test_class->getMethod("__construct");
$params = $method->getParameters();

foreach($params as $param) {
    print argData($param)."\n";
}

function argData(ReflectionParameter $arg) {
    $details = "";
    $declaringclass = $arg->getDeclaringClass();
    // 获得参数的变量名
    $name = $arg->getName();
    $class = $arg->getClass();
    $position = $arg->getPosition();
    $details .= "\$name must be a $classname object\n";

    if (!empty($class)) {
        $classname = $class->getName();
        $details .= "\$$name must be a $classname object\n";
    }

    // 检查参数是否为引用
    if($arg->isPassedByReference()) {
        $details .= "\$$name is passed by reference\n";
    }

    // 检查默认值的可用性
    if($arg->isDefaultValueAvailable()) {
        $def = $arg->getDefaultValue();
        $details .= "\$$name has default: $def\n";
    }

    return $details;
}
```

## 参考资料

- 《深入PHP面向对象模式与实践第3版》