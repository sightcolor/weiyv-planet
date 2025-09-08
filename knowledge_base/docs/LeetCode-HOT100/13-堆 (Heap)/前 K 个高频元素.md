# 前 K 个高频元素

> **题目链接:** [LeetCode Link](https://leetcode.cn/problems/top-k-frequent-elements/)

---

## 题目描述

> 给你一个整数数组 `nums` 和一个整数 `k` ，请你返回其中出现频率前 `k` 高的元素。你可以按 **任意顺序** 返回答案。
>
> **示例:**
> ```
> 输入: nums = [1,1,1,2,2,3], k = 2
> 输出: [1,2]
> ```
>
> ```
> 输入: nums = [1], k = 1
> 输出: [1]
> ```
>
> **进阶**: 你所设计算法的时间复杂度 **必须** 优于 `O(n log n)` ，其中 `n` 是数组大小。

---

## 解题思路

### 核心思想
**哈希表 + 最小堆 (Top K 问题)**

这个问题的目标是找到频率最高的 `k` 个元素。我们可以分两步来解决：
1.  **统计频率**: 首先，我们需要知道每个元素出现的次数。**哈希表 (unordered_map)** 是完成这项任务最理想的数据结构，它可以在 O(1) 的平均时间内完成插入和查找。
2.  **找出 Top K**: 统计完频率后，问题就转化为了：从所有 "元素-频率" 对中，找出频率最高的前 `k` 个。这是一个经典的 **Top K** 问题，使用**大小为 `k` 的最小堆**是解决它的最优方法之一。

**为什么是最小堆？**
- 我们维护一个大小为 `k` 的最小堆，堆中存储的是 `pair<元素, 频率>`。
- 堆的排序规则是按照**频率**从小到大排序（堆顶是频率最小的）。
- 遍历所有 "元素-频率" 对：
  - 如果堆的大小还不到 `k`，直接将该 `pair` 入堆。
  - 如果堆的大小已达到 `k`，我们将当前 `pair` 的频率与堆顶的频率（即当前已入堆的 `k` 个元素中频率最小的那个）进行比较。
    - 如果当前频率 **大于** 堆顶频率，说明当前元素比堆里的“守门员”更有资格进入“前 k 名”。于是，我们弹出堆顶，并将当前 `pair` 入堆。
    - 否则，说明当前元素的频率不够高，直接忽略。
- 遍历结束后，堆中剩下的 `k` 个元素，就是整个数组中频率最高的前 `k` 个。

### 算法步骤
1.  **统计频率**:
    *   创建一个 `unordered_map<int, int> mp`。
    *   遍历 `nums` 数组，用 `mp` 统计每个数字出现的次数。
2.  **构建最小堆**:
    *   创建一个 `priority_queue`，配置为最小堆，其元素类型为 `pair<int, int>`，并根据 `pair.second` (频率) 来比较大小。
    *   遍历哈希表 `mp` 中的每一个 `(key, value)` 对。
    *   按照上述的最小堆逻辑，将 `pair` 放入堆中，始终维持堆的大小不超过 `k`。
3.  **提取结果**:
    *   遍历结束后，最小堆中存储的就是频率最高的 `k` 个元素。
    *   创建一个结果数组 `res`，依次从堆中弹出元素，并将其 `key` (即元素本身) 存入 `res` 中。
    *   返回 `res`。

### 复杂度分析
- **时间复杂度**: O(N log k)
  *(其中 N 是 `nums` 的长度。遍历 `nums` 统计频率是 O(N)。遍历哈希表中的 `M` 个不同元素（`M <= N`），每次堆操作的时间复杂度是 O(log k)，总共是 O(M log k)。所以整体是 O(N + M log k)，简化为 O(N log k)。)*
- **空间复杂度**: O(N)
  *(哈希表在最坏情况下（所有元素都不同）需要存储 N 个键值对。堆需要 O(k) 的空间。所以整体是 O(N + k)，简化为 O(N)。)*

---

## 代码实现

### C++ (哈希表 + 最小堆)
*(该实现逻辑清晰，是解决 Top K 问题的标准高效解法。)*
```cpp
#include <vector>
#include <queue>
#include <unordered_map>
#include <utility> // for std::pair

class Solution {
public:
    // 自定义比较器，用于构建最小堆
    // priority_queue 默认是最大堆，我们需要重载 operator() 使其按频率从小到大排序
    struct greater {
        bool operator()(const std::pair<int, int>& a, const std::pair<int, int>& b) {
            return a.second > b.second; // 频率小的在前面 (堆顶)
        }
    };

    std::vector<int> topKFrequent(std::vector<int>& nums, int k) {
        // 1. 统计频率
        std::unordered_map<int, int> mp;
        for (int num : nums) {
            mp[num]++;
        }

        // 2. 构建大小为 k 的最小堆
        std::priority_queue<std::pair<int, int>, std::vector<std::pair<int, int>>, greater> pq;
        
        for (auto const& [num, freq] : mp) {
            if (pq.size() < k) {
                pq.push({num, freq});
            } else if (freq > pq.top().second) {
                pq.pop();
                pq.push({num, freq});
            }
        }

        // 3. 提取结果
        std::vector<int> res;
        while (!pq.empty()) {
            res.push_back(pq.top().first);
            pq.pop();
        }
        
        return res;
    }
};
```