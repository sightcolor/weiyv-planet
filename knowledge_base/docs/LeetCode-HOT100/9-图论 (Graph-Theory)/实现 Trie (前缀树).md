# 实现 Trie (前缀树)

> **题目链接:** [LeetCode Link](https://leetcode.cn/problems/implement-trie-prefix-tree/)

---

## 题目描述

> **Trie**（发音类似 "try"）或者说 **前缀树** 是一种树形数据结构，用于高效地存储和检索字符串数据集中的键。这一数据结构有相当多的应用情景，例如自动补完和拼写检查。
>
> 请你实现 `Trie` 类：
> *   `Trie()` 初始化前缀树对象。
> *   `void insert(String word)` 向前缀树中插入字符串 `word` 。
> *   `boolean search(String word)` 如果字符串 `word` 在前缀树中，返回 `true`（即，在检索之前已经插入）；否则，返回 `false` 。
> *   `boolean startsWith(String prefix)` 如果之前已经插入的字符串 `word` 的前缀之一为 `prefix` ，返回 `true` ；否则，返回 `false` 。
>
> **示例:**
> ```
> Trie trie = new Trie();
> trie.insert("apple");
> trie.search("apple");   // 返回 True
> trie.search("app");     // 返回 False
> trie.startsWith("app"); // 返回 True
> trie.insert("app");
> trie.search("app");     // 返回 True
> ```

---

## 解题思路

### 核心思想
**空间换时间，利用字符串的公共前缀来降低查询时间的复杂度。**

前缀树是一种特殊的多叉树（本题中是26叉树），它的设计思想是将字符串的每个字符作为树的一个层级。从根节点到某个节点的路径，本身就构成了一个字符串（前缀）。

**节点设计**:
Trie 的核心在于其节点的定义。每个节点需要包含两个关键信息：
1.  **子节点指针数组**: 一个指向其所有子节点的指针数组。对于小写英文字母，这个数组的大小就是26。`child[0]` 代表字符 'a'，`child[1]` 代表 'b'，以此类推。这样，字符本身就作为“边”的信息，隐式地存储在了父节点指向子节点的指针索引中。
2.  **结尾标记 (`isEnd`)**: 一个布尔值，用于标记从根节点到当前节点的路径是否构成一个完整的、被插入过的单词。这是区分一个单词（如 "app"）和另一个单词的前缀（"app" 是 "apple" 的前缀）的关键。

**操作原理**:
*   **插入 (`insert`)**: 从根节点开始，沿着单词的字符路径向下遍历。如果路径中的某个节点不存在，就创建一个新节点。遍历结束后，将最后一个字符对应的节点的 `isEnd` 标记为 `true`。
*   **查找 (`search`)**: 从根节点开始，沿着单词的字符路径向下遍历。如果中途任何一个字符对应的节点不存在，说明单词不存在。如果成功遍历完所有字符，还必须检查最后一个节点的 `isEnd` 是否为 `true`。
*   **前缀查找 (`startsWith`)**: 过程与 `search` 类似，但区别在于，只要能成功遍历完前缀的所有字符，就说明该前缀存在，无需关心最后一个节点的 `isEnd` 标记。

### 算法步骤
1.  **定义 `Node` 结构**: 创建一个内部类或结构体 `Node`，包含 `bool isEnd` 和一个大小为26的 `Node*` 数组 `child`。
2.  **初始化 `Trie`**: 在 `Trie` 的构造函数中，创建一个根节点 `root`。
3.  **实现 `insert(word)`**:
    *   从 `root` 开始，令 `curr = root`。
    *   遍历 `word` 中的每个字符 `ch`。
    *   计算索引 `idx = ch - 'a'`。
    *   如果 `curr->child[idx]` 为空，则 `new` 一个新节点。
    *   将 `curr` 指针移动到子节点：`curr = curr->child[idx]`。
    *   循环结束后，设置 `curr->isEnd = true`。
4.  **实现 `search(word)` 和 `startsWith(prefix)`**:
    *   为了代码复用，可以创建一个辅助函数 `find(string)`，它负责遍历路径并返回一个状态码：
        *   `0`: 路径不存在（不匹配）。
        *   `1`: 路径存在且 `isEnd` 为 `true`（完全匹配）。
        *   `2`: 路径存在但 `isEnd` 为 `false`（前缀匹配）。
    *   `search(word)`: 调用 `find(word)`，如果返回值为 `1`，则结果为 `true`。
    *   `startsWith(prefix)`: 调用 `find(prefix)`，只要返回值不为 `0`，则结果为 `true`。
5.  **内存管理**:
    *   实现析构函数 `~Trie()`，通过递归的方式（后序遍历）释放所有动态分配的 `Node` 内存，防止内存泄漏。

### 复杂度分析
设 `L` 为操作字符串的平均长度，`N` 为 `Trie` 中插入的单词总数，`S` 为所有单词的总字符数，`Σ` 为字符集大小（本题为26）。

- **时间复杂度**:
  *   `insert(word)`: **O(L)**。我们需要遍历单词的每个字符。
  *   `search(word)`: **O(L)**。我们最多遍历单词长度的节点数。
  *   `startsWith(prefix)`: **O(L)**。与 `search` 同理。
  *(Trie 的强大之处在于其查询时间与库中单词总数 `N` 无关)*

- **空间复杂度**: **O(S * |Σ|)**
  *(最坏情况下，所有单词没有公共前缀，每个字符都需要一个新节点，每个节点需要 `|Σ|` 个指针的空间。)*

---

## 代码实现

### C++ 
*(该实现结构清晰，通过 `find` 辅助函数优雅地复用了查找逻辑，并妥善处理了内存管理。)*
```cpp
#include <string>
#include <vector>

class Trie {
private:
    // 定义 Trie 节点
    class Node {
    public:
        bool isEnd = false;
        Node* child[26] = {nullptr};
    };

    Node* root;

    // 辅助函数：查找一个字符串并返回其状态
    // 返回值: 0-不匹配, 1-完全匹配, 2-前缀匹配
    int find(std::string word) {
        Node* curr = root;
        for(auto ch : word) {
            int idx = ch - 'a';
            if(!curr->child[idx]) { // 路径中断，不匹配
                return 0;
            }
            curr = curr->child[idx];
        }
        // 路径存在，根据 isEnd 状态返回
        return curr->isEnd ? 1 : 2;
    }
    
    // 辅助函数：递归释放内存
    void drop(Node* node) {
        if (!node) return;
        for(int i = 0; i < 26; ++i) {
            if (node->child[i]) {
                drop(node->child[i]);
            }
        }
        delete node;
    }

public:
    Trie() {
        root = new Node();
    }
    
    // 析构函数，防止内存泄漏
    ~Trie() {
        drop(root);
    }

    void insert(std::string word) {
        Node* curr = root;
        for(auto ch : word) {
            int idx = ch - 'a';
            if(!curr->child[idx]) {
                curr->child[idx] = new Node();
            }
            curr = curr->child[idx];
        }
        curr->isEnd = true;
    }
    
    bool search(std::string word) {
        // 只有完全匹配才算 search 成功
        return find(word) == 1;
    }
    
    bool startsWith(std::string prefix) {
        // 只要路径存在 (完全匹配或前缀匹配) 就算 startsWith 成功
        return find(prefix) != 0;
    }
};

/**
 * Your Trie object will be instantiated and called as such:
 * Trie* obj = new Trie();
 * obj->insert(word);
 * bool param_2 = obj->search(word);
 * bool param_3 = obj->startsWith(prefix);
 */
 ```