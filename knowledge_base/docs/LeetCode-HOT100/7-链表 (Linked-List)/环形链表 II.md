# 环形链表 II

> **题目链接:** [LeetCode Link](https://leetcode.cn/problems/linked-list-cycle-ii/)

---

## 题目描述

> 给定一个链表的头节点  `head` ，返回链表开始入环的第一个节点。 如果链表无环，则返回 `null`。
>
> 如果链表中有某个节点，可以通过连续跟踪 `next` 指针再次到达，则链表中存在环。为了表示给定链表中的环，评测系统内部使用整数 `pos` 来表示链表尾连接到链表中的位置（索引从 0 开始）。**`pos` 不作为参数进行传递**。仅仅是为了标识链表的实际情况。
>
> **不允许修改** 链表。
>
> **示例:**
> ```
> 输入：head = [3,2,0,-4], pos = 1
> 输出：返回索引为 1 的链表节点
> 解释：链表中有一个环，其尾部连接到第二个节点。
> ```

---

## 解题思路

### 核心思想
**快慢指针 (两阶段法)**

此问题是 "环形链表 I" 的进阶。我们不仅要判断是否有环，还要找到环的入口节点。这可以通过一个两阶段的快慢指针算法解决。

*   **第一阶段：判断是否有环并找到相遇点**
    *   和上一题一样，使用快慢指针。`slow` 每次走一步，`fast` 每次走两步。
    *   如果 `fast` 到达链表末尾，说明无环。
    *   如果 `slow` 和 `fast` 相遇，说明有环。记录下这个相遇点。

*   **第二阶段：找到环的入口**
    *   当快慢指针在环内相遇后，我们将其中一个指针（例如 `fast`）重新指向链表的头节点 `head`。
    *   然后，让 `slow` 和 `fast` 两个指针都以 **每次一步** 的速度向前移动。
    *   它们下一次相遇的节点，就是环的入口节点。

### 算法推导 (为什么第二阶段有效？)
这是一个经典的数学证明：

1.  设链表头到环入口的距离为 `a`。
2.  设环的入口到快慢指针相遇点的距离为 `b`。
3.  设环的长度为 `c`。

当快慢指针第一次相遇时：
*   慢指针走过的路程 `d_slow = a + b`
*   快指针走过的路程 `d_fast = a + k*c + b` (快指针在环内可能已经转了 `k` 圈)

因为快指针的速度是慢指针的2倍，所以 `d_fast = 2 * d_slow`。
*   `a + k*c + b = 2 * (a + b)`
*   `a + k*c + b = 2a + 2b`
*   `k*c = a + b`

这个公式 `a = k*c - b` 是关键。我们可以把它改写成 `a = (k-1)c + (c-b)`。
*   `a`: 从 `head` 到环入口的距离。
*   `c-b`: 从 **相遇点** 走完环的剩余部分，回到 **环入口** 的距离。

这个等式 `a = (k-1)c + (c-b)` 告诉我们：
> 从 `head` 走到环入口的步数 (`a`)，等于从 `相遇点` 走到环入口的步数 (`c-b`)，再加上 `k-1` 圈。

所以，如果一个指针从 `head` 出发，另一个指针从 `相遇点` 出发，它们都以相同的速度（每次一步）前进，它们最终必然会在 **环的入口点** 相遇。

### 算法步骤
1.  **初始化**: 创建 `slow` 和 `fast` 指针，都指向 `head`。
2.  **第一阶段**:
    *   循环移动指针：`slow` 走一步，`fast` 走两步。
    *   如果 `fast` 或 `fast->next` 为 `nullptr`，说明无环，返回 `nullptr`。
    *   如果 `slow == fast`，说明相遇，跳出循环。
3.  **第二阶段**:
    *   将 `fast` 指针重置回 `head`。
    *   开始一个新的循环，这次 `slow` 和 `fast` 都每次走一步。
    *   当 `slow == fast` 时，它们所在的节点就是环的入口，返回该节点。

### 复杂度分析
- **时间复杂度**: O(N)
  *(其中 N 是链表的节点数。第一阶段和第二阶段都最多遍历链表常数次。)*
- **空间复杂度**: O(1)
  *(只使用了固定的几个指针变量。)*

---

## 代码实现

### C++ (快慢指针两阶段法)

```cpp
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
    ListNode *detectCycle(ListNode *head) {
        if (!head || !head->next) {
            return nullptr;
        }

        ListNode* slow = head;
        ListNode* fast = head;
        bool hasCycle = false;

        // --- 第一阶段：判断是否有环，并找到相遇点 ---
        while (fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;
            if (slow == fast) {
                hasCycle = true;
                break;
            }
        }

        // 如果没有环，直接返回
        if (!hasCycle) {
            return nullptr;
        }

        // --- 第二阶段：找到环的入口 ---
        // 将一个指针重置回头节点
        fast = head;
        // 两个指针同速前进，相遇点即为入口
        while (slow != fast) {
            slow = slow->next;
            fast = fast->next;
        }

        return fast;
    }
};
```