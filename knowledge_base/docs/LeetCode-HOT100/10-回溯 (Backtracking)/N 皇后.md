# N皇后

> **题目链接:** [LeetCode Link](https://leetcode.cn/problems/n-queens/)

---

## 题目描述

> `n` **皇后问题** 研究的是如何将 `n` 个皇后放置在 `n×n` 的棋盘上，并且使皇后彼此之间不能相互攻击。
>
> 给你一个整数 `n` ，返回所有不同的 `n` **皇后问题** 的解。
>
> 每一种解法包含一个不同的 `n` **皇后问题** 的棋子放置方案，该方案中 `'Q'` 和 `'.'` 分别代表了皇后和空位。
>
> **攻击规则**: 皇后可以攻击同一行、同一列、以及两条主/副对角线上的任何棋子。
>
> **示例:**
> ```
> 输入：n = 4
> 输出：[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]
> 解释：如上图所示，4 皇后问题存在两个不同的解。
> ```
>
> ![N-Queens Example](https://assets.leetcode.com/uploads/2020/11/13/queens.jpg)

---

## 解题思路

### 核心思想
**按行回溯 + 空间换时间 (记录攻击范围)**

N皇后问题是一个经典的约束满足问题，非常适合使用**回溯算法**。一个朴素的想法是尝试在 `n*n` 的棋盘上放置 `n` 个皇后，然后检查其合法性，但这样搜索空间过于巨大。

一个高效的剪枝策略是**按行放置**：我们从第 0 行开始，依次在每一行放置一个皇后。当我们决定在第 `row` 行的第 `col` 列放置一个皇后时，我们必须确保这个位置不会被之前（第 `0` 到 `row-1` 行）放置的皇后攻击。

为了能够 O(1) 地判断一个位置 `(row, col)` 是否被攻击，我们需要用额外的数据结构来记录所有被攻击的**列**、**主对角线**和**副对角线**。这就是典型的“空间换时间”思想。

**如何表示对角线？**
通过观察可以发现规律：
1.  **主对角线 (左上到右下)**: 同一条主对角线上的所有格子 `(row, col)`，它们的 **`row - col`** 的值是恒定的。
2.  **副对角线 (右上到左下)**: 同一条副对角线上的所有格子 `(row, col)`，它们的 **`row + col`** 的值是恒定的。

因此，我们可以使用三个集合（或布尔数组）来记录状态：
-   一个集合记录被占用的**列**。
-   一个集合记录被占用的**主对角线** (通过 `row - col` 识别)。
-   一个集合记录被占用的**副对角线** (通过 `row + col` 识别)。

### 算法步骤
1.  **初始化**:
    *   创建结果列表 `res` 和棋盘路径 `temp`。
    *   创建 `cols` (记录列)、`diag1` (记录主对角线)、`diag2` (记录副对角线) 这三个状态集合（或数组）。
2.  **定义回溯函数 `backTrack(int row)`**:
    *   `row` 表示当前正在决策的行号。
    *   **Base Case (终止条件)**: 如果 `row == n`，说明我们已经成功地在 `n` 行中都放置了皇后，形成了一个完整的解。将 `temp` 加入 `res` 并返回。
    *   **遍历当前行的所有选择 (列)**:
        *   使用 `for` 循环遍历当前 `row` 的所有列 `col` (从 `0` 到 `n-1`)。
        *   **剪枝**: 在尝试放置皇后在 `(row, col)` 之前，检查该位置是否会被攻击：
            *   检查 `col` 是否在 `cols` 集合中。
            *   检查 `row - col` 是否在 `diag1` 集合中。
            *   检查 `row + col` 是否在 `diag2` 集合中。
            *   如果任何一个条件满足，说明该位置已被攻击，`continue` 到下一个列。
        *   **做选择**:
            *   将 `(row, col)` 的信息记录下来（例如，将表示该行的字符串加入 `temp`）。
            *   更新三个状态集合，将 `col`、`row - col` 和 `row + col` 加入其中。
        *   **进入下一层递归**:
            *   调用 `backTrack(row + 1)`，去决策下一行的皇后位置。
        *   **撤销选择 (回溯)**:
            *   将之前添加的行从 `temp` 中移除。
            *   从三个状态集合中移除 `col`、`row - col` 和 `row + col`，恢复现场。
3.  **主函数调用**:
    *   在主函数中，初始化好所有变量后，调用 `backTrack(0)` 启动搜索。
    *   返回 `res`。

### 复杂度分析
- **时间复杂度**: O(N!)
  *(虽然有剪枝，但搜索树的节点数量仍然是阶乘级别的。这是一个粗略的估计，实际运行会快很多，但仍然是指数级的。)*
- **空间复杂度**: O(N)
  *(不考虑存储结果 `res` 的空间。空间主要由递归栈的深度（为 N）、棋盘 `temp` (大小 N)、以及三个状态集合/数组（大小均为 O(N)）决定。)*

---

## 代码实现

### C++ 
*(该实现使用 `vector<bool>` 和 `unordered_set` 来高效地记录攻击范围，是解决 N 皇后问题的标准回溯范式。)*
```cpp
#include <vector>
#include <string>
#include <unordered_set>

class Solution {
private:
    std::vector<std::vector<std::string>> res;
    std::vector<std::string> temp;
    std::vector<bool> cols;           // 记录列是否可用 (true: 可用)
    std::unordered_set<int> diag1;    // 记录主对角线 (row - col)
    std::unordered_set<int> diag2;    // 记录副对角线 (row + col)
    int n;

    // 辅助函数：构建一行的棋盘字符串
    std::string construct(int col) {
        std::string str(n, '.');
        str[col] = 'Q';
        return str;
    }

    // row: 当前正在决策的行号
    void backTrack(int row) {
        // Base Case: 成功放置了 n 行
        if (row == n) {
            res.push_back(temp);
            return;
        }

        // 遍历当前行的所有列
        for (int col = 0; col < n; ++col) {
            // --- 剪枝: 判断 (row, col) 是否会被攻击 ---
            if (!cols[col]) { // 列被占用
                continue;
            }
            if (diag1.count(row - col) || diag2.count(row + col)) { // 对角线被占用
                continue;
            }

            // --- 做出选择 ---
            temp.push_back(construct(col));
            cols[col] = false; // 标记列为不可用
            diag1.insert(row - col);
            diag2.insert(row + col);

            // --- 进入下一行决策 ---
            backTrack(row + 1);

            // --- 撤销选择 (回溯) ---
            temp.pop_back();
            cols[col] = true; // 恢复列为可用
            diag1.erase(row - col);
            diag2.erase(row + col);
        }
    }

public:
    std::vector<std::vector<std::string>> solveNQueens(int n) {
        this->n = n;
        cols.resize(n, true); // true 代表可以放棋子
        backTrack(0);
        return res;
    }
};
```