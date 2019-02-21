---
title:       Python 实现队列的几种方式
description: 人生苦短，我用 Python
date:       2019-02-05 13:52:00
categories:
    - Web屠龙刀
tags:
    - Python
toc: true
---

## 什么是队列

- 队列是一种特殊的线性表
- 是一种先进先出（FIFO）的数据结构
- 只允许在表的前端（front）进行删除操作，而在表的后端（rear）进行插入操作
- 进行插入操作的端称为队尾，进行删除操作的端称为队头
- 队列中没有元素时，称为空队列

## 实现

### 借用列表

利用 `list` 实现对队列的模拟：

```python
# 创建列表
q = []
# 入队
q.append("a")
# 出队
del q[0]
```

### deque

双端队列，即可实现栈，也可实现队列。

```python
import collections

# 创建队列
d = collections.deque()

# 入队
d.append(1) #从队尾
d.appendleft(2) #从队头

# 出队
d.pop() #从队尾
d.popleft() #从队头
```

详见官方文档：[deque objects](https://docs.python.org/3/library/collections.html?highlight=collection#deque-objects)。

## 应用

### 树的层次遍历

[从上往下打印二叉树](https://www.nowcoder.com/practice/7fe2212963db4790b57431d9ed259701?tpId=13&tqId=11175&tPage=1&rp=1&ru=/ta/coding-interviews&qru=/ta/coding-interviews/question-ranking)，借助队列实现。

```python
# -*- coding:utf-8 -*-
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    # 返回从上到下每个节点值列表，例：[1,2,3]
    def PrintFromTopToBottom(self, root):
        if root is None:
            return []
        # write code here
        queue = []
        res = []
        queue.append(root)
        while len(queue) > 0:
            q_len = len(queue)
            for i in range(0, q_len):
                r = queue[0]
                del queue[0]
                if r is None:
                    continue
                res.append(r.val)
                queue.append(r.left)
                queue.append(r.right)
        return res
```