# 二叉搜索树中第K小的元素

> **题目链接:** [LeetCode Link](https://leetcode.cn/problems/kth-smallest-element-in-a-bst/)

---

## 题目描述

> 给定一个二叉搜索树的根节点 `root` ，和一个整数 `k` ，请你设计一个算法查找其中第 `k` 个最小的元素（从 1 开始计数）。
>
> **示例:**
> ```
> 输入：root = [3,1,4,null,2], k = 1
> 输出：1
> ```
>
> ```
> 输入：root = [5,3,6,2,4,null,null,1], k = 3
> 输出：3
> ```

---

## 解题思路

### 核心思想
**中序遍历**

二叉搜索树（BST）有一个至关重要的特性：对它进行 **中序遍历**（左 -> 根 -> 右），得到的结果是一个 **严格递增** 的有序序列。

因此，寻找 BST 中第 `k` 小的元素，这个问题就等价于：**找到中序遍历序列中的第 k 个元素**。

### 思路一：递归中序遍历

我们可以通过递归实现中序遍历，并在遍历过程中进行计数。当计数器达到 `k` 时，当前访问到的节点就是我们寻找的目标。

#### 算法步骤
1.  **初始化**: 创建一个成员变量 `k`（作为计数器）和一个 `res`（用于存储结果）。在主函数中用输入的 `k` 初始化计数器。
2.  **定义递归函数 `dfs(node)`**:
    *   **递归基**: 如果 `node` 为空，直接返回。
    *   **遍历左子树**: 递归调用 `dfs(node->left)`。
    *   **访问根节点**:
        *   此时，所有比当前节点小的元素都已被访问。我们将计数器 `k` 减 1。
        *   如果 `k` 减到 0，说明当前节点就是第 `k` 小的元素。将其值存入 `res`，并可以提前结束递归。
    *   **遍历右子树**: 如果尚未找到第 `k` 个元素，递归调用 `dfs(node->right)`。

#### 复杂度分析
- **时间复杂度**: O(H + k)
  *(其中 H 是树的高度。在最好的情况下（平衡树），我们需要 O(logN + k) 的时间；最坏情况下（树退化为链表），为 O(N)。)*
- **空间复杂度**: O(H)
  *(递归调用栈的深度。)*

---

### 思路二：迭代中序遍历

我们也可以使用栈来手动模拟中序遍历的迭代过程，这可以避免递归带来的栈深度问题。

#### 算法步骤
1.  **初始化**: 创建一个空栈 `stk`。
2.  **循环**: 当 `root` 指针不为空或栈不为空时，继续循环。
3.  **深入左子树**: 将当前 `root` 节点及其所有左孩子一路压入栈中。
4.  **访问并计数**:
    *   当无法再向左走时，从栈顶弹出一个节点。这是当前遍历到的最小节点。
    *   将计数器 `k` 减 1。
    *   如果 `k` 减到 0，说明找到了目标，立即返回该节点的值。
5.  **转向右子树**: 将 `root` 指针指向弹出节点的右孩子，准备处理右子树。

#### 复杂度分析
- **时间复杂度**: O(H + k)
- **空间复杂度**: O(H)

---

## 代码实现

### C++ (思路一：递归中序遍历)

```cpp
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
    int count; // 计数器
    int result; // 结果

public:
    void inorderTraversal(TreeNode* root) {
        if (!root) {
            return;
        }
        
        // 1. 遍历左子树
        inorderTraversal(root->left);
        
        // 2. 访问根节点
        // count-- 后如果为0，说明当前节点是目标
        if (--count == 0) {
            result = root->val;
            return; // 找到结果，可以提前返回
        }

        // 3. 只有在尚未找到结果时，才需要遍历右子树
        if (count > 0) {
            inorderTraversal(root->right);
        }
    }

    int kthSmallest(TreeNode* root, int k) {
        this->count = k;
        inorderTraversal(root);
        return result;
    }
};
```
### C++ (思路二：迭代中序遍历)
```C++
#include <stack>

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
public:
    int kthSmallest(TreeNode* root, int k) {
        std::stack<TreeNode*> stk;
        
        while (root || !stk.empty()) {
            // 1. 将所有左孩子压入栈
            while (root) {
                stk.push(root);
                root = root->left;
            }
            
            // 2. 弹出并访问
            root = stk.top();
            stk.pop();
            
            // 3. 计数并检查
            if (--k == 0) {
                return root->val;
            }
            
            // 4. 转向右子树
            root = root->right;
        }
        return -1; // 正常情况下不会执行到这里
    }
};
```