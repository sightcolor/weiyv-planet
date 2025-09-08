# LRU 缓存

> **题目链接:** [LeetCode Link](https://leetcode.cn/problems/lru-cache/)

---

## 题目描述

> 请你设计并实现一个满足 **LRU (最近最少使用) 缓存** 约束的数据结构。
>
> 实现 `LRUCache` 类：
> *   `LRUCache(int capacity)` 以 **正整数** 作为容量 `capacity` 初始化 LRU 缓存。
> *   `int get(int key)` 如果关键字 `key` 存在于缓存中，则返回关键字的值，否则返回 `-1` 。
> *   `void put(int key, int value)` 如果关键字 `key` 已经存在，则变更其数据值 `value` ；如果不存在，则向缓存中插入该组 `key-value` 。如果插入操作导致关键字数量超过 `capacity` ，则应该 **逐出** 最近最少使用的关键字。
>
> 函数 `get` 和 `put` 必须以 **O(1)** 的平均时间复杂度运行。
>
> **示例:**
> ```
> 输入：
> ["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
> [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
> 输出：
> [null, null, null, 1, null, -1, null, -1, 3, 4]
> ```

---

## 解题思路

### 核心思想
**哈希表 + 双向链表**

为了实现 `get` 和 `put` 的 O(1) 时间复杂度，单一的数据结构是无法满足的。我们需要：
1.  **O(1) 的查找、插入、删除能力**：这指向了 **哈希表**。我们可以用哈希表存储 `key` 到链表节点的映射。
2.  **维护一个有序的序列**：我们需要能快速地将一个节点移动到“队尾”（表示最近使用），并能快速地从“队首”删除节点（表示最久未使用）。这指向了 **链表**。

为什么是 **双向链表** 而不是单向链表？因为当我们需要将一个中间节点移动到队尾时，我们需要 O(1) 的时间删除它。在双向链表中，只要我们有指向该节点的指针，我们就可以通过 `node->prev` 和 `node->next` 在 O(1) 时间内完成删除操作。而在单向链表中，删除一个节点需要先找到它的前驱，这需要 O(N) 的时间。

因此，最终的解决方案是：
*   **`unordered_map<int, DLinkedNode*>`**: 提供 O(1) 的 `key` 查找能力，直接定位到链表中的节点。
*   **一个双向链表**: 维护数据的“新鲜度”。我们将链表 **头部** 视为 **最久未使用** 的数据，将 **尾部** 视为 **最近使用** 的数据。

### 算法步骤

1.  **数据结构**:
    *   `DLinkedNode`: 自定义双向链表节点，包含 `key`, `val`, `prev`, `next` 四个成员。`key` 必须存储，因为淘汰队首节点时，需要用 `key` 去哈希表中删除对应项。
    *   `unordered_map<int, DLinkedNode*> cache`: 哈希表。
    *   `dummyHead`, `dummyTail`: 哨兵头尾节点，极大地简化了在链表头尾插入和删除节点的逻辑，无需判断 `head` 或 `tail` 是否为空。

2.  **`get(key)` 操作**:
    *   通过哈希表查找 `key`。
    *   如果不存在，返回 `-1`。
    *   如果存在，说明该数据被访问了。将其从当前位置移动到双向链表的 **队尾**，表示它成为了最近使用的数据。然后返回其 `value`。

3.  **`put(key, value)` 操作**:
    *   通过哈希表查找 `key`。
    *   **如果 key 存在**:
        *   更新节点中的 `value`。
        *   将该节点移动到双向链表的 **队尾**。
    *   **如果 key 不存在**:
        *   创建一个新的节点。
        *   将新节点插入到双向链表的 **队尾**。
        *   在哈希表中添加 `(key, 新节点)` 的映射。
        *   检查当前缓存大小是否超过 `capacity`。
        *   如果超过，则淘汰 **最久未使用** 的数据：即删除双向链表的 **队首** 节点（`dummyHead->next`），并从哈希表中删除对应的 `key`。

### 复杂度分析
- **时间复杂度**: O(1)
  *(`get` 和 `put` 操作都只涉及哈希表的查找/插入/删除和双向链表的节点移动，这些操作的平均时间复杂度都是 O(1)。)*
- **空间复杂度**: O(capacity)
  *(哈希表和双向链表最多存储 `capacity` 个元素。)*

---

## 代码实现

### C++ (哈希表 + 双向链表)

```cpp
#include <unordered_map>

class LRUCache {
private:
    // 自定义双向链表节点
    struct DLinkedNode {
        int key;
        int val;
        DLinkedNode* prev;
        DLinkedNode* next;
        DLinkedNode() : key(0), val(0), prev(nullptr), next(nullptr) {}
        DLinkedNode(int _key, int _val) : key(_key), val(_val), prev(nullptr), next(nullptr) {}
    };

    std::unordered_map<int, DLinkedNode*> cache;
    DLinkedNode* dummyHead;
    DLinkedNode* dummyTail;
    int size;
    int capacity;

public:
    LRUCache(int _capacity) : capacity(_capacity), size(0) {
        // 使用哨兵头尾节点简化逻辑
        dummyHead = new DLinkedNode();
        dummyTail = new DLinkedNode();
        dummyHead->next = dummyTail;
        dummyTail->prev = dummyHead;
    }
    
    int get(int key) {
        // 1. 哈希表O(1)查找
        if (cache.find(key) == cache.end()) {
            return -1;
        }
        // 2. 将节点移动到队尾，表示最近使用
        DLinkedNode* node = cache[key];
        moveToTail(node);
        return node->val;
    }
    
    void put(int key, int value) {
        if (cache.find(key) == cache.end()) {
            // key 不存在，创建新节点
            DLinkedNode* newNode = new DLinkedNode(key, value);
            cache[key] = newNode;
            addToTail(newNode);
            size++;
            // 3. 如果超过容量，淘汰队首（最久未使用）节点
            if (size > capacity) {
                DLinkedNode* head = removeHead();
                cache.erase(head->key);
                delete head;
                size--;
            }
        } else {
            // key 存在，更新值并移到队尾
            DLinkedNode* node = cache[key];
            node->val = value;
            moveToTail(node);
        }
    }

private:
    // 将任意节点移动到队尾
    void moveToTail(DLinkedNode* node) {
        removeNode(node);
        addToTail(node);
    }
    
    // 从链表中删除一个节点
    void removeNode(DLinkedNode* node) {
        node->prev->next = node->next;
        node->next->prev = node->prev;
    }

    // 将一个节点添加到队尾
    void addToTail(DLinkedNode* node) {
        node->prev = dummyTail->prev;
        node->next = dummyTail;
        dummyTail->prev->next = node;
        dummyTail->prev = node;
    }

    // 删除队首节点并返回
    DLinkedNode* removeHead() {
        DLinkedNode* node = dummyHead->next;
        removeNode(node);
        return node;
    }
};
```