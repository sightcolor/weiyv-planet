# 合并K个升序链表

> **题目链接:** [LeetCode Link](https://leetcode.cn/problems/merge-k-sorted-lists/)

---

## 题目描述

> 给你一个链表数组，每个链表都已经按升序排列。
>
> 请你将所有链表合并到一个升序链表中，返回合并后的链表。
>
> **示例:**
> ```
> 输入：lists = [[1,4,5],[1,3,4],[2,6]]
> 输出：[1,1,2,3,4,4,5,6]
> 解释：链表数组如下：
> [
>   1->4->5,
>   1->3->4,
>   2->6
> ]
> 将它们合并到一个有序链表中得到。
> 1->1->2->3->4->4->5->6
> ```

---

## 解题思路

### 思路一：分治合并 (迭代实现)

#### 核心思想
这种方法的灵感来源于归并排序的“自底向上”思想。我们可以不一次性合并所有 `k` 个链表，而是两两配对进行合并，从而将 `k` 个链表的合并问题，转化为 `k/2` 个，然后 `k/4` 个... 直到最后只剩下一个合并后的链表。这大大减少了每次合并操作中链表的数量，提高了效率。

#### 算法步骤
1.  **处理边界**: 如果输入的数组为空，直接返回 `nullptr`。
2.  **初始化指针**: 设置两个指针 `left = 0` 和 `right = lists.size() - 1`，分别指向链表数组的头和尾。
3.  **循环配对合并**:
    *   当 `right > 0` 时，持续进行合并。
    *   在每一轮中，将 `lists[left]` 和 `lists[right]` 合并，结果存回 `lists[left]`。
    *   然后将指针向中间收缩：`left++`, `right--`。
    *   当 `left >= right` 时，说明一轮配对合并完成。此时，我们将 `left` 重置为 `0`，`right` 的值已经是上一轮合并后的终点，准备开始下一轮合并。
4.  **返回结果**: 循环结束后，所有链表都已被合并到 `lists[0]` 中，返回 `lists[0]` 即可。

#### 复杂度分析
- **时间复杂度**: O(N log k)
  *(其中 N 是所有链表中节点的总数，k 是链表的数量。每轮合并需要遍历所有 N 个节点，总共需要进行 `log k` 轮合并。)*
- **空间复杂度**: O(max_list_len) 或 O(1)
  *(空间复杂度取决于 `mergeTwoLists` 的实现。在您的代码中，该函数是递归的，最坏情况下栈深度为两个待合并链表的长度之和，可能达到 O(N)。如果 `mergeTwoLists` 使用迭代实现，则此方法空间复杂度为 O(1)。)*

---

### 思路二：分治合并 (递归实现)

#### 核心思想
这是更经典的“自顶向下”的归并排序思想。我们将合并 `k` 个链表的问题，分解为：先合并前 `k/2` 个链表，再合并后 `k/2` 个链表，最后将这两个合并后的结果再次合并。

#### 算法步骤
1.  **定义递归函数**: 定义一个 `merge(lists, left, right)` 函数，其功能是合并 `lists` 数组中从索引 `left` 到 `right` 的所有链表。
2.  **递归基 (Base Case)**:
    *   如果 `left > right`，说明区间无效，返回 `nullptr`。
    *   如果 `left == right`，说明区间只有一个链表，无需合并，直接返回 `lists[left]`。
3.  **递归过程 (分治)**:
    *   计算中间点 `mid = left + (right - left) / 2`。
    *   递归调用 `merge(lists, left, mid)`，得到左半部分合并后的链表 `l1`。
    *   递归调用 `merge(lists, mid + 1, right)`，得到右半部分合并后的链表 `l2`。
    *   调用 `mergeTwoLists(l1, l2)` 将左右两部分的结果合并，并返回。
4.  **初始调用**: 在主函数中，调用 `merge(lists, 0, lists.size() - 1)` 启动整个过程。

#### 复杂度分析
- **时间复杂度**: O(N log k)
  *(分析同上，递归树的深度为 `log k`，每层合并的总操作数是 O(N)。)*
- **空间复杂度**: O(log k) + O(max_list_len)
  *(`merge` 函数的递归深度为 O(log k)，`mergeTwoLists` 的递归深度取决于链表长度。)*

---

## 代码实现

### C++ (思路一：分治合并 - 迭代实现)

```cpp
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
private:
    ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
        if (!l1) return l2;
        if (!l2) return l1;
        if (l1->val < l2->val) {
            l1->next = mergeTwoLists(l1->next, l2);
            return l1;
        }
        l2->next = mergeTwoLists(l1, l2->next);
        return l2;
    }

public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        int n = lists.size();
        if (n == 0) return nullptr;
        
        int left = 0, right = n - 1;
        while (right > 0) {
            // 当指针相遇或交错，一轮合并结束，准备下一轮
            if (left >= right) {
                left = 0;
            }
            lists[left] = mergeTwoLists(lists[left], lists[right]);
            left++;
            right--;
        }
        return lists[0];
    }
};
```

### C++ (思路二：分治合并 - 递归实现)

```C++
/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        if (lists.empty()) {
            return nullptr;
        }
        return merge(lists, 0, lists.size() - 1);
    }

private:
    // 递归分治的主函数
    ListNode* merge(vector<ListNode*>& lists, int left, int right) {
        // 递归基
        if (left == right) {
            return lists[left];
        }
        if (left > right) {
            return nullptr;
        }
        
        // 分
        int mid = left + (right - left) / 2;
        ListNode* l1 = merge(lists, left, mid);
        ListNode* l2 = merge(lists, mid + 1, right);
        
        // 治（合并）
        return mergeTwoLists(l1, l2);
    }

    // 合并两个有序链表的辅助函数
    ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
        if (!l1) return l2;
        if (!l2) return l1;
        
        if (l1->val < l2->val) {
            l1->next = mergeTwoLists(l1->next, l2);
            return l1;
        } else {
            l2->next = mergeTwoLists(l1, l2->next);
            return l2;
        }
    }
};
```