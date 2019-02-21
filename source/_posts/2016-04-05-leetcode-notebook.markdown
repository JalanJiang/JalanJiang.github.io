---
layout:     post
title:      LeetCode Notebook
description: Talk is cheap. Show me the code.
date:       2016-04-01 19:25:00
categories:
    - 技多不压身
tags:
    - 算法
---


# List
    
- [338. Counting Bits](#zero)

- [292. Nim Game](#one)

- [136. Single Number](#two)

- [258. Add Digits](#three)

- [226. Invert Binary Tree](#four)

- [283. Move Zeroes](#five) 

- [237. Delete Node in a Linked List](#six)

- [260. Single Number III](#seven)

**LeetCode刷题思路，持续更新中……**

# 零 <span id="zero">338. Counting Bits</span>

## [题目](https://leetcode.com/problems/counting-bits/)
Given a non negative integer number num. For every numbers i in the range 0 ≤ i ≤ num calculate the number of 1's in their binary representation and return them as an array.

**Example:**
For num = `5` you should return `[0,1,1,2,1,2]`.

**Follow up:**

It is very easy to come up with a solution with run time O(n*sizeof(integer)). But can you do it in linear time O(n) /possibly in a single pass?
Space complexity should be O(n).
Can you do it like a boss? Do it without using any builtin function like __builtin_popcount in c++ or in any other language.

**Tag**: `Bit Manipulation`、`Dynamic Programming`

## 思路
根据题目要求，即给出一个数`num`，计算从`0~num`的整数二进制形态中数字`1`的个数。

### 解法一
若使用时间复杂度为`O(n*sizeof(integer))`的算法，还是比较简单的。即循环`0~num`每个整数`i`，循环执行`i&=(i-1)`，计算`i`二进制形态中数字`1`的个数。

### 解法二
而题目要求`in linear time O(n)`的线性时间算法。
我们用数组`res`存储最后的结果，将`res[0]`先置0。通过如下递推，可以获得一些规律：
<table>
    <tr>
        <th>i</th>
        <th>(i-1)&i</th>
        <th>count</th>
        <th>res[i]</th>
    </tr>
    <tr>
        <td>1</td>
        <td>0</td>
        <td>count=0</td>
        <td>res[1] = res[count]+1 = res[0]+1 = 1</td>
    </tr>
    <tr>
        <td>2</td>
        <td>0</td>
        <td>count=0</td>
        <td>res[2] = res[count]+1 = res[0]+1 = 1</td>
    </tr>
    <tr>
        <td>3</td>
        <td>1</td>
        <td>count++, count=1</td>
        <td>res[3] = res[count]+1 = count[1]+1 = 2</td>
    </tr>
    <tr>
        <td>4</td>
        <td>0</td>
        <td>count=0</td>
        <td>res[4] = res[count]+1 = count[0]+1 = 1</td>
    </tr>
</table>
即：若计算`i&(i-1)`后：
 
1. 结果等于零，则该二进制数中仅有`1`个数字`1`,此时将`count`的值置为`0`，`res[i] = res[count] + 1 = res[0] + 1 = 1`;
2. 结果不等于零，则该二进制数中数字`1`的个数大于`1`。该数字`i`可以拆分成`<i`的数字。比如：
 - 3 = 1 + 2
 - 5 = 3 + 2
 - 7 = 5 + 2

即：可以用`res[j]` (j < i) 来计算`res[i]`的值 

## 解决方法

### 解法一：run time O(n*sizeof(integer))

**`c++` Solution**

    class Solution {
    public:
        vector<int> countBits(int num) {
            vector<int> result;
            int cnt;
            for(int i=0; i<=num; i++) {
                int t = i;
                for(cnt=0; t>0; cnt++) {
                    t &= (t-1);
                }
                result.push_back(cnt);
            }
            return result;
        }
    };

### 解法二：run time O(n)

**`c++` Solution**

    class Solution {
    public:
        vector<int> countBits(int num) {
            vector<int> res;
            res.push_back(0);
            int count = 0;
    
            for (int i = 1; i <= num; ++ i) {
                if (((i - 1) & i) == 0) {
                    count = 0;
                } else {
                    count += 1;
                }
                res.push_back(1 + res[count]);
            }
            return res;
        }
    };

----------


# 一 <span id="one">292. Nim Game</span>

## [题目](https://leetcode.com/problems/nim-game/)
You are playing the following Nim Game with your friend: There is a heap of stones on the table, each time one of you take turns to remove 1 to 3 stones. The one who removes the last stone will be the winner. **You will take the first turn** to remove the stones.

Both of you are very clever and have optimal strategies for the game. Write a function to determine whether you can win the game given the number of stones in the heap.

For example, if there are 4 stones in the heap, then you will never win the game: no matter 1, 2, or 3 stones you remove, the last stone will always be removed by your friend.


## 思路
根据题设条件： 当`n∈[1,3]`时，先手必胜。

当`n == 4`时，无论先手第一轮如何选取，下一轮都会转化为`n∈[1,3]`的情形，此时先手必负。

当`n∈[5,7]`时，先手必胜，先手分别通过取走`[1,3]`颗石头，可将状态转化为`n == 4`时的情形，此时后手必负。

当`n == 8`时，无论先手第一轮如何选取，下一轮都会转化为`n∈[5,7]`的情形，此时先手必负。

所以，我们仅需关注`n`的个数是否为`4`的倍数即可。

## 解决方法

**`c++` Solution**

    class Solution {
    public:
        bool canWinNim(int n) {
            if(n%4 == 0) {
                return false;
            } else {
                return true;
            }
        }
    };

----------


# 二 <span id="two">136. Single Number</span>

## [题目](https://leetcode.com/problems/single-number/)

Given an array of integers, every element appears twice except for one. Find that single one.

Note:
Your algorithm should have a linear runtime complexity. Could you implement it without using extra memory?

**Tag:**`Hash Table`；`Bit Manipulation`

## 思路

题目要求：在一个整数数组中，每个元素会出现两次或一次，要求找出仅出现一次的元素。
看到题目后第一反应是使用`Hash Table`来解决。但在题目`Tag`中提示可以使用`Bit Manipulation`，于是想到用位运算中异或的方法：

> **`A ^ B ^ A = B`**

将整数数组`nums`中的每个数循环执行异或操作，最终得到的结果就是仅出现单次的数。

## 解决方法

**`c++` Solution**

    class Solution {
    public:
        int singleNumber(vector<int>& nums) {
            int result = nums[0];
            for(int i=1; i<nums.size(); i++) {
                result ^= nums[i]; 
            }
            return result;
        }
    };
    

----------


# 三 <span id="three">258. Add Digits</span>

## [题目](https://leetcode.com/problems/add-digits/)

Given a non-negative integer num, repeatedly add all its digits until the result has only one digit.

**For example**:

Given num = 38, the process is like: 3 + 8 = 11, 1 + 1 = 2. Since 2 has only one digit, return it.

**Follow up:**
Could you do it without any loop/recursion in O(1) runtime?

**Tag**:`Math`

## 思路

拿到题目后的第一想法还是对`num`进行循环取模求和运算，但题目要求`O(1)`的时间复杂度，那么应当又是一道有规律可循的题了。

我们对一系列数的运算结果进行观察：
<table>
    <tr>
        <th>num</th>
        <th>result</th>
    </tr>
    <tr>
        <td>1</td>
        <td>1</td>
    </tr>
    <tr>
        <td>2</td>
        <td>2</td>
    </tr>
    <tr>
        <td>3</td>
        <td>3</td>
    </tr>
    <tr>
        <td>4</td>
        <td>4</td>
    </tr>
    <tr>
        <td>5</td>
        <td>5</td>
    </tr>
    <tr>
        <td>6</td>
        <td>6</td>
    </tr>
    <tr>
        <td>7</td>
        <td>7</td>
    </tr>
    <tr>
        <td>8</td>
        <td>8</td>
    </tr>
    <tr>
        <td>9</td>
        <td>9</td>
    </tr>
    <tr>
        <td>10</td>
        <td>1</td>
    </tr>
    <tr>
        <td>11</td>
        <td>2</td>
    </tr>
    <tr>
        <td>12</td>
        <td>3</td>
    </tr>
    <tr>
        <td>13</td>
        <td>4</td>
    </tr>
    <tr>
        <td>14</td>
        <td>5</td>
    </tr>
    <tr>
        <td>15</td>
        <td>6</td>
    </tr>
    <tr>
        <td>16</td>
        <td>7</td>
    </tr>
    <tr>
        <td>17</td>
        <td>8</td>
    </tr>
    <tr>
        <td>18</td>
        <td>9</td>
    </tr>
    <tr>
        <td>19</td>
        <td>1</td>
    </tr>
    <tr>
        <td>20</td>
        <td>2</td>
    </tr>
</table>

从结果可以观察出，都是`1~9`的循环数。因此对于某数字`num`得出的`result`应当为：

> `result = (num-1)%9 + 1`

## 解决方法

**`c++` Solution**

    class Solution {
    public:
        int addDigits(int num) {
            return (num-1)%9+1;
        }
    };

----------


# 四 <span id="four">226. Invert Binary Tree</span>

## [题目](https://leetcode.com/problems/invert-binary-tree/)

Invert a binary tree.
![title](https://leanote.com/api/file/getImage?fileId=5704fe24ab64412bd500014c)
to
![title](https://leanote.com/api/file/getImage?fileId=5704fe33ab64412bd500014d)
**Trivia:**
This problem was inspired by this original tweet by Max Howell:
Google: 90% of our engineers use the software you wrote (Homebrew), but you can’t invert a binary tree on a whiteboard so fuck off.
**Tag**:`Tree`

## 思路

二叉树的反转就是将左右子树不停地调换位置，可以用递归的方式实现。

## 解决方法

**`c++` Solution**

    /**
     * Definition for a binary tree node.
     * struct TreeNode {
     *     int val;
     *     TreeNode *left;
     *     TreeNode *right;
     *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
     * };
     */
    class Solution {
    public:
        TreeNode* invertTree(TreeNode* root) {
            if(root) {
                //  调换左右子树位置
                TreeNode *t;
                t = root->left;
                root->left = root->right;
                root->right = t;
                //  递归
                invertTree(root->left);
                invertTree(root->right);
            }
            return root;
        }
    };

----------

# 五 <span id="five">283. Move Zeroes</span>

## 题目

Given an array nums, write a function to move all 0's to the end of it while maintaining the relative order of the non-zero elements.

**For example**, given nums = [0, 1, 0, 3, 12], after calling your function, nums should be [1, 3, 12, 0, 0].

**Note:**
You must do this in-place without making a copy of the array.
Minimize the total number of operations.

**Tag**: `Array`、`Two Pointers`

## 思路

题目不允许`copy array`，如果要把数字0都移动到数组末尾，第一想法还是当遇到`0`时，将数组循环前移，再在末尾插入`0`。或者直接使用`vector`的`erase()`，擦除`0`所在位置，并在末尾`push_back(0)`。
But……这种方法分分钟超时了……
题目中Tag提示`Two Pinters`，估计就是用双指针进行数字交换了。
使用两个指针`i`和`j`指向数组的下标，通过`i`循环`nums[i]`，每当遇到非零数字时，交换`nums[i]`与`nums[j]`，并执行`j++`。
若存在`0`，则能让`j`始终指向数字`0`，当`i`指向`非0`数字时，交换二者。

## 解决方法

### 解法一

`c++ Solution`

    class Solution {
    public:
        void moveZeroes(vector<int>& nums) {
            for(int i=0, j=0; i<nums.size(); i++) {
                if(nums[i] != 0) {
                    swap(nums[i], nums[j]);
                    j++;
                }
            }
        }
    };

### 解法二

`c++ Solution` **Time Limit Exceeded**

    class Solution {
    public:
        void moveZeroes(vector<int>& nums) {
            int size = nums.size();
            for(int i=0; i<size; i++) {
                if(nums[i] == 0) {
                    nums.erase(nums.begin()+i);
                    nums.push_back(0);
                    i = 0;
                }
            }
        }
    };

----------
# 六 <span id="six">237. Delete Node in a Linked List</span>

## 题目

Write a function to delete a node (except the tail) in a singly linked list, given only access to that node.

Supposed the linked list is `1 -> 2 -> 3 -> 4 `and you are given the third node with value `3`, the linked list should become `1 -> 2 -> 4 `after calling your function.

Tag: `Linked List`

## 思路

假设链表中要删除的节点是`node`，想法是：找到指向`node`的节点（如图中值为`2`的结点），改变该节点的指针，指向`node->next`。

![title](https://leanote.com/api/file/getImage?fileId=5706388fab64412bd5000cfa)

然而答题区的函数只传入了一个要删除的节点，难道要遍历找到`pre`吗……然而也没有给我链表的首指针啊……

![title](https://leanote.com/api/file/getImage?fileId=57063b83ab64412a3500101c)

所以应该直接在给定的`node`上做文章。把`node`更改为`node->next`并把`node->next`删除~如下图所示。

![title](https://leanote.com/api/file/getImage?fileId=57063803ab64412a35001006)

## 解决方法

    /**
     * Definition for singly-linked list.
     * struct ListNode {
     *     int val;
     *     ListNode *next;
     *     ListNode(int x) : val(x), next(NULL) {}
     * };
     */
    class Solution {
    public:
        void deleteNode(ListNode* node) {
            ListNode* t = node->next;
            *node = *t;
            delete t;
        }
    };
    
值得一提，代码中的`*node = *t`非常有意思，即`*node = *node->next`，它等价于：

    node->val = node->next->val;
    node->next = node->next->next;

----------

# 七 <span id="seven">260. Single Number III</span>

## [题目](https://leetcode.com/problems/single-number-iii/)

Given an array of numbers nums, in which exactly two elements appear only once and all the other elements appear exactly twice. Find the two elements that appear only once.

**For example**:

Given nums = [1, 2, 1, 3, 2, 5], return [3, 5].

**Note**:
The order of the result is not important. So in the above example, [5, 3] is also correct.
Your algorithm should run in linear runtime complexity. Could you implement it using only constant space complexity?

**Tag**:`Bit Manipulation`

## 思路

看到**Tag**中的“位操作”提示，看来又是非常interesting的一题。找出数组中仅出现一次的数的方法和上面[136. Single Number](#two)一题是一样的，利用 `A^B^A = B`可用异或的方式找出仅出现一次的数。本题将仅出现一次的数换成2个，因此为求出这两个数，我们也应当将数组中的数分成两个group，分别求解。我们将仅出现一次的两个数设为`a`和`b`。

 1. 步骤一：遍历数组，**异或**数组中的所有元素，最终可得到值`aXORb`。由`A^B^A=B`可知，`aXORb = a^b`；
 2. 步骤二：执行`aXORb&(~(aXORb-1))`找出`aXORb`中值为`1`的二进制位。假设`aXORb`中第`i`位的数字为`1`，则代表`a`与`b`在该位上的二进制数不同。可假设`a`在第`i`位上的数为`1`，`b`在第`i`位上的数为`0`；
 3. 步骤三：将数组中所有数据分为两组。A组：第`i`位的数与`a`相同，B组：第`i`位的数与`b`相同；
 4. 步骤四：异或`A`组所有元素，得到`A`，异或`B`组所有元素，得到`b`。

## 解决方法

    class Solution {
    public:
        vector<int> singleNumber(vector<int>& nums) {
            vector<int> result = {0, 0};
            int aXORb = 0;
            for(int i = 0; i<nums.size(); i++) {
                aXORb ^= nums[i];
            }
            
            int last = aXORb&(~(aXORb-1));
            
            for(int i = 0; i<nums.size(); i++) {
                if((last & nums[i]) != 0) {
                    result[0] ^= nums[i];
                } else {
                    result[1] ^= nums[i];
                }
            }
            
            return result;
        }
    };

