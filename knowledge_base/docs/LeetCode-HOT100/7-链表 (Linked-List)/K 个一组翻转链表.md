# K 个一组翻转链表

> **题目链接:** [LeetCode Link](https://leetcode.cn/problems/reverse-nodes-in-k-group/)

---

## 题目描述

> 给你一个链表，每 `k` 个节点一组进行翻转，请你返回翻转后的链表。
>
> `k` 是一个正整数，它的值小于或等于链表的长度。
>
> 如果节点总数不是 `k` 的整数倍，那么请将最后剩余的节点保持原有顺序。
>
> **你不能只是单纯的改变节点内部的值，而是需要实际进行节点交换。**
>
> **示例:**
> ```
> 输入：head = [1,2,3,4,5], k = 2
> 输出：[2,1,4,3,5]
> ```
> ```
> 输入：head = [1,2,3,4,5], k = 3
> 输出：[3,2,1,4,5]
> ```

---

## 解题思路

### 核心思想
**分组 -> 翻转 -> 重连**

这个问题的核心是将复杂的链表翻转任务分解为一系列重复的子任务。我们可以将整个链表看作是由多个长度为 `k` 的子链表组成的。我们的策略是：
1.  **分组**: 找到每一组 `k` 个节点。
2.  **翻转**: 将找到的这一组子链表进行翻转。
3.  **重连**: 将翻转后的子链表与前后部分正确地连接起来。

为了简化操作，特别是处理头节点和各组之间的连接，我们使用一个 **哨兵节点 (Dummy Node)**。

### 算法步骤
1.  **初始化**:
    *   创建一个哨兵节点 `dummy`，其 `next` 指向 `head`。
    *   `group_prev`: 指向待翻转组的前一个节点，初始为 `dummy`。
    *   `group_end`: 用于探测每组的末尾节点，初始为 `dummy`。

2.  **循环分组与翻转**:
    *   **寻找一组**: 从 `group_end` 开始，向前走 `k` 步，找到当前组的末尾。如果中途遇到 `nullptr`，说明剩余节点不足 `k` 个，循环结束。
    *   **保存上下文**: 在翻转前，必须保存好连接信息：
        *   `group_start`: 待翻转组的起始节点 (`group_prev->next`)。
        *   `next_group_start`: 下一组的起始节点 (`group_end->next`)。
    *   **断开连接**: 将当前组与链表的其余部分断开，以便独立翻转。`group_end->next = nullptr;`
    *   **翻转子链表**: 调用一个翻转链表的辅助函数（如 `reverseList`），翻转从 `group_start` 开始的子链表。
    *   **重连链表**: 这是最关键的一步。
        *   将 `group_prev` 的 `next` 指向翻转后子链表的 **新头节点** (也就是翻转前的 `group_end`)。
        *   将翻转后子链表的 **新尾节点** (也就是翻转前的 `group_start`) 的 `next` 指向 `next_group_start`。
    *   **为下一轮迭代做准备**:
        *   更新 `group_prev`，使其指向当前已翻转组的末尾（即原来的 `group_start`）。
        *   更新 `group_end` 为新的 `group_prev`，准备下一次探测。

3.  **返回**: 所有操作完成后，返回 `dummy->next`。

### 复杂度分析
- **时间复杂度**: O(N)
  *(虽然看起来有嵌套，但每个节点只会被遍历和翻转一次。)*
- **空间复杂度**: O(k)
  *(在您的实现中，`reverseList` 辅助函数是递归的，其递归深度为 `k`，所以空间复杂度为 O(k)。如果使用迭代方式翻转子链表，空间复杂度可以降为 O(1)。)*

---

## 代码实现

### C++ (分组翻转法)

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
    // 辅助函数：翻转一个链表
    ListNode* reverseList(ListNode* head) {
        if (!head || !head->next) {
            return head;
        }
        ListNode* newHead = reverseList(head->next);
        head->next->next = head;
        head->next = nullptr;
        return newHead;
    }

public:
    ListNode* reverseKGroup(ListNode* head, int k) {
        ListNode dummy(0, head);
        ListNode* group_prev = &dummy;
        ListNode* group_end = &dummy;

        while (true) {
            // 1. 寻找k个节点的组的末尾
            for (int i = 0; i < k && group_end; i++) {
                group_end = group_end->next;
            }
            // 如果不足k个，结束循环
            if (!group_end) {
                break;
            }

            // 2. 保存上下文信息
            ListNode* group_start = group_prev->next;
            ListNode* next_group_start = group_end->next;

            // 3. 断开连接，准备翻转
            group_end->next = nullptr;

            // 4. 翻转子链表并重连
            // group_prev的next指向翻转后的新头
            group_prev->next = reverseList(group_start);
            // 翻转后的新尾（即group_start）指向下一组的头
            group_start->next = next_group_start;

            // 5. 为下一次迭代做准备
            // 更新 group_prev 和 group_end
            group_prev = group_start;
            group_end = group_prev;
        }

        return dummy.next;
    }
};
```