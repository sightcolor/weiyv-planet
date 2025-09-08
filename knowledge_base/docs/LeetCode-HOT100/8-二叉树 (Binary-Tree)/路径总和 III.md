# 路径总和 III

> **题目链接:** [LeetCode Link](https://leetcode.cn/problems/path-sum-iii/)

---

## 题目描述

> 给定一个二叉树的根节点 `root` ，和一个整数 `targetSum` ，求该二叉树里节点值之和等于 `targetSum` 的 **路径** 的数目。
>
> **路径** 不需要从根节点开始，也不需要在叶子节点结束，但是路径方向必须是向下的（只能从父节点到子节点）。
>
> **示例:**
> ```
> 输入：root = [10,5,-3,3,2,null,11,3,-2,null,1], targetSum = 8
> 输出：3
> 解释：和等于 8 的路径有 3 条，如图所示。
> ```

---

## 解题思路

### 核心思想
**前缀和 + 哈希表优化**

暴力解法通常需要 O(N^2) 或 O(NlogN) 的复杂度。为了优化，我们可以借鉴数组中“和为K的子数组”问题的思想，即 **前缀和**。

1.  **树上的前缀和**: 定义从根节点到当前节点 `curr_node` 的路径上所有节点值的总和为 `prefix_sum`。
2.  **问题转化**: 假设从根节点到 `curr_node` 的路径上存在一个祖先节点 `ancestor_node`。那么，从 `ancestor_node` (不含) 到 `curr_node` (含) 的路径和就是 `prefix_sum(curr) - prefix_sum(ancestor)`。我们要求这个路径和等于 `targetSum`。
3.  **关键公式**: `prefix_sum(curr) - prefix_sum(ancestor) = targetSum`  =>  `prefix_sum(ancestor) = prefix_sum(curr) - targetSum`。

我们的任务就变成了：在遍历到 `curr_node` 时，去查找在它所有的祖先节点中，有多少个节点的前缀和恰好等于 `prefix_sum(curr) - targetSum`。

**哈希表** 正是实现这种快速查找的完美工具。我们可以用一个哈希表 `mp` 来存储 `(前缀和 -> 出现次数)` 的映射。

### 算法步骤
1.  **初始化**:
    *   创建一个哈希表 `mp` 用于存储前缀和及其出现次数。
    *   `mp[0] = 1`: 这是一个非常重要的技巧。它表示“和为0的前缀和”出现了一次，用于正确计算那些**从根节点开始**就满足条件的路径。

2.  **定义递归函数 `dfs(node, current_prefix_sum)`**:
    *   **递归基**: 如果 `node` 为空，直接返回。
    *   **更新当前前缀和**: `current_prefix_sum += node->val`。
    *   **查找并更新结果**: 在进入当前节点后，立刻查找哈希表中是否存在键为 `current_prefix_sum - targetSum` 的项。如果存在，说明找到了满足条件的路径，将 `mp[current_prefix_sum - targetSum]` 的值累加到最终结果 `res` 中。
    *   **更新状态**: 将当前节点的前缀和计入哈希表，`mp[current_prefix_sum]++`。这是为了让它的 **子孙节点** 能够查找到它。
    *   **递归深入**: 对左右子节点调用 `dfs`。
    *   **回溯 (关键)**: 当左右子树的递归调用全部结束后，**必须恢复状态**，将当前节点的前缀和从哈希表中“移除”，`mp[current_prefix_sum]--`。这确保了在遍历兄弟节点时，当前节点的信息不会造成干扰。

3.  **数据类型注意**: 节点值的累加和可能会超出 `int` 的范围，导致整数溢出。因此，存储前缀和的变量以及哈希表的键（Key）都应该使用 `long long` 类型。

### 复杂度分析
- **时间复杂度**: O(N)
  *(每个节点仅被访问一次。)*
- **空间复杂度**: O(N)
  *(在最坏情况下（链状树），递归栈深度和哈希表大小都可能达到 O(N)。)*

---

## 代码实现

### C++ (前缀和 + DFS回溯)

```cpp
#include <unordered_map>

/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */
class Solution {
private:
    int count = 0;
    // 使用 long long 防止前缀和溢出
    std::unordered_map<long long, int> prefix_sum_map;

public:
    int pathSum(TreeNode* root, int targetSum) {
        // 初始化：和为0的前缀和出现1次
        prefix_sum_map[0] = 1;
        dfs(root, 0LL, targetSum);
        return count;
    }

private:
    void dfs(TreeNode* node, long long current_sum, int targetSum) {
        if (!node) {
            return;
        }

        // 1. 更新当前路径的前缀和
        current_sum += node->val;

        // 2. 查找是否存在满足条件的祖先节点
        if (prefix_sum_map.count(current_sum - targetSum)) {
            count += prefix_sum_map[current_sum - targetSum];
        }

        // 3. 更新哈希表，为子节点提供信息
        prefix_sum_map[current_sum]++;

        // 4. 递归深入
        dfs(node->left, current_sum, targetSum);
        dfs(node->right, current_sum, targetSum);

        // 5. 回溯：移除当前节点的前缀和信息，以免影响其他分支
        prefix_sum_map[current_sum]--;
    }
};
```