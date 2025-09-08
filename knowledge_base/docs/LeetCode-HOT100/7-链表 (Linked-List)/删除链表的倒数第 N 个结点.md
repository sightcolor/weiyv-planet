# 删除链表的倒数第 N 个结点

> **题目链接:** [LeetCode Link](https://leetcode.cn/problems/remove-nth-node-from-end-of-list/)

---

## 题目描述

> 给你一个链表，删除链表的倒数第 `n` 个结点，并且返回链表的头结点。
>
> **示例:**
> ```
> 输入：head = [1,2,3,4,5], n = 2
> 输出：[1,2,3,5]
> ```
>
> ```
> 输入：head = [1], n = 1
> 输出：[]
> ```

---

## 解题思路

### 核心思想
**快慢指针 + 哨兵节点**

要找到倒数第 `n` 个节点，一个直观的想法是先遍历一遍链表得到总长度 `L`，然后再遍历 `L-n` 次找到目标节点的前驱。但题目进阶要求我们只遍历一次。

我们可以使用 **快慢指针** 来实现一次遍历。
1.  我们设置两个指针，`fast` 和 `slow`。
2.  先让 `fast` 指针从链表头部向前走 `n` 步。此时，`fast` 和 `slow` 之间就形成了一个 `n` 个节点的固定窗口。
3.  然后，同时移动 `fast` 和 `slow` 指针，每次都向前走一步。
4.  当 `fast` 指针到达链表的末尾（即 `fast` 为 `nullptr`）时，`slow` 指针正好指向要删除的倒数第 `n` 个节点。

为了方便地删除节点（特别是删除头节点时），我们引入一个 **哨兵节点 (Dummy Node)**。它是一个虚拟的头节点，指向原始的 `head`。这样，任何要被删除的节点（包括原来的头节点）都有一个确定的前驱节点，简化了删除操作。

### 算法步骤
1.  **初始化**:
    *   创建一个哨兵节点 `dummy`，让它的 `next` 指向 `head`。
    *   创建 `fast` 和 `slow` 指针，都初始化为 `head`。
    *   （如您的实现）创建一个 `prev` 指针指向 `dummy`，用于记录 `slow` 的前一个节点。
2.  **建立窗口**: 让 `fast` 指针先向前移动 `n` 步。
3.  **同步移动**:
    *   进入一个循环，当 `fast` 不为 `nullptr` 时，将 `fast`, `slow` 和 `prev` 三个指针同时向后移动一步。
4.  **定位与删除**:
    *   循环结束后，`fast` 指针到达了链表末尾。此时，`slow` 指针指向的就是要删除的倒数第 `n` 个节点，而 `prev` 指针指向它的前驱节点。
    *   执行删除操作：`prev->next = slow->next`。
    *   释放被删除节点的内存（`delete slow`）。
5.  **返回**: 返回哨兵节点的下一个节点 `dummy->next`，这就是新链表的头节点。

### 复杂度分析
- **时间复杂度**: O(L)
  *(其中 L 是链表的长度。我们只需要对链表进行一次遍历。)*
- **空间复杂度**: O(1)
  *(我们只使用了固定的几个指针变量，与链表长度无关。)*

---

## 代码实现

### C++ (快慢指针法)

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
    // 辅助函数：删除指定节点
    void deleteNode(ListNode* curr, ListNode* prev) {
        if (!curr) return;
        prev->next = curr->next;
        // 在 C++ 中，手动管理内存时应释放节点
        delete curr; 
    }

public:
    ListNode* removeNthFromEnd(ListNode* head, int n) {
        // 1. 初始化：创建哨兵节点和指针
        ListNode* dummy = new ListNode(0, head);
        ListNode* prev = dummy;
        ListNode* slow = head;
        ListNode* fast = head;

        // 2. 建立窗口：fast 指针先走 n 步
        for (int i = 0; i < n; i++) {
            if (fast) {
                fast = fast->next;
            }
        }

        // 3. 同步移动：三个指针一起前进，直到 fast 到达末尾
        while (fast) {
            prev = slow;
            slow = slow->next;
            fast = fast->next;
        }

        // 4. 定位与删除：此时 slow 指向目标节点，prev 是其前驱
        deleteNode(slow, prev);
        
        // 5. 返回新链表的头
        ListNode* newHead = dummy->next;
        delete dummy; // 释放哨兵节点
        return newHead;
    }
};
```