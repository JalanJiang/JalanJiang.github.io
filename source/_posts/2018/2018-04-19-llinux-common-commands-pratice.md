---
title:       使用 Shell 脚本统计词频率
description: egrep + awk
date: 2018-04-19 20:12:00
categories:
    - Web屠龙刀
tags:
    - Shell
toc: false
---

## Code

```
#!/bin/bash
# 统计单词词频

if [ $# -ne 1 ];
then
	echo "Usage: $0 filename";
	exit -1
fi

filename=$1

egrep -o "\b[[:alpha:]]+\b" $filename |

awk '{ count[$0]++ }
END{ 
	printf("%-14s%s\n", "Word", "Count");
	for (ind in count) {
		printf("%-14s%d\n", ind, count[ind]);
	}

}'
```

## Output

```
$ sh word_freq.sh test
Word          Count
jalan         1
jiang         2
hello         2
hi            1
word          2
```

## 相关命令

- egrep 正则匹配
    - 使用 `-o` 选项打印出**由换行符分割**匹配字符序列
    - `"\b[[:alpha:]]+\b"` 匹配单词
        - `[:alpha:]` 表示字母类的字符
        - `[]` 匹配指定范围内的任意单个字符
        - `\b` 单词边界标记
- awk 文本处理
    - `awk { 计算关联数组 } END { 打印结果 }`
    


