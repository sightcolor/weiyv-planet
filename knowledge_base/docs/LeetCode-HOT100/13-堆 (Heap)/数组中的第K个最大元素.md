# 数组中的第K个最大元素

> **题目链接:** [LeetCode Link](https://leetcode.cn/problems/kth-largest-element-in-an-array/)

---

## 题目描述

> 给定整数数组 `nums` 和整数 `k`，请返回数组中第 `k` 个最大的元素。
>
> 请注意，你需要找的是数组排序后的第 `k` 个最大的元素，而不是第 `k` 个不同的元素。
>
> 你必须设计并实现时间复杂度为 `O(n)` 的算法解决此问题。 (注：这是进阶要求，堆解法通常达不到)
>
> **示例:**
> ```
> 输入: [3,2,1,5,6,4], k = 2
> 输出: 5
> ```
>
> ```
> 输入: [3,2,3,1,2,4,5,5,6], k = 4
> 输出: 4
> ```

---

## 解题思路

寻找第 K 大/小元素（Top K 问题）是算法中的一类经典问题。主要有两种主流解法：基于**堆 (优先队列)** 和基于**快速排序的分区思想 (快速选择)**。

### 方法一：堆 (优先队列)

堆是为高效获取最大/最小元素而设计的数据结构，非常适合解决 Top K 问题。

#### 思路 A: 最大堆 (简单直观)
1.  **建堆**: 将数组中的所有 `N` 个元素都放入一个最大堆中。
2.  **筛选**: 依次弹出堆顶 `k-1` 次。
3.  **获取结果**: 此时的堆顶就是第 `k` 大的元素。
-   **时间复杂度**: O(N + k log N)
-   **空间复杂度**: O(N)

#### 思路 B: 最小堆 (空间优化)
这是更高效的堆解法。我们维护一个**大小为 `k` 的最小堆**。
1.  遍历数组 `nums`。
2.  如果堆的大小小于 `k`，直接将元素入堆。
3.  如果堆的大小已达到 `k`，比较当前元素 `num` 和堆顶 `top`：
    -   若 `num > top`，说明 `num` 比当前“第k大”的候选者还大，于是弹出堆顶，将 `num` 入堆。
    -   否则，`num` 不可能是前 k 大的数，直接忽略。
4.  遍历结束后，堆顶就是最终答案。
-   **时间复杂度**: O(N log k)
-   **空间复杂度**: O(k)

---

### 方法二：快速选择 (Quickselect)

这是基于快速排序分区思想的算法，也是本题时间复杂度最优的解法。
**核心思想**:
> 快速排序的每一轮 `partition` 操作，都会将一个 `pivot` 元素放到它在最终排好序的数组中应该在的正确位置 `p`。
> 我们只需要比较这个位置 `p` 和我们想找的目标位置 `target_index`（第 `k` 大的元素，其索引为 `n-k`）的大小关系，就可以决定下一步只在哪一半区间继续搜索，从而避免了对整个数组的完全排序。

**算法步骤**:
1.  **目标转换**: 确定目标索引 `target_index = n - k`。
2.  **递归/循环**:
    *   在当前区间 `[left, right]` 内，随机选取一个 `pivot`。
    *   执行 `partition` 操作，将 `pivot` 放到最终位置 `p`，并使得 `nums[left...p-1] < nums[p]` 且 `nums[p+1...right] > nums[p]`。
    *   **判断与剪枝**:
        *   如果 `p == target_index`，那么 `nums[p]` 就是答案，直接返回。
        *   如果 `p < target_index`，说明答案在 `pivot` 的右侧，我们只需要在 `[p + 1, right]` 区间继续搜索。
        *   如果 `p > target_index`，说明答案在 `pivot` 的左侧，我们只需要在 `[left, p - 1]` 区间继续搜索。
-   **时间复杂度**: O(N) 平均, O(N^2) 最坏 (可通过随机化 pivot 避免)
-   **空间复杂度**: O(log N) 递归栈空间

---

## 代码实现

### C++ (最大堆)
```cpp
#include <vector>
#include <queue>

class Solution {
public:
    int findKthLargest(std::vector<int>& nums, int k) {
        std::priority_queue<int> pq(nums.begin(), nums.end());
        while (--k) {
            pq.pop();
        }
        return pq.top();
    }
};
```
### C++ (最小堆)
#### 使用函数对象 (Functor)
```C++

#include <vector>
#include <queue>

class Solution {
public:
    template<typename T>
    struct greater {
        bool operator()(T a, T b) { return a > b; }
    };

    int findKthLargest(std::vector<int>& nums, int k) {
        std::priority_queue<int, std::vector<int>, greater<int>> pq;
        for (int num : nums) {
            if (pq.size() < k) {
                pq.push(num);
            } else if (num > pq.top()) {
                pq.pop();
                pq.push(num);
            }
        }
        return pq.top();
    }
};
```
#### 使用 Lambda 表达式
```C++

#include <vector>
#include <queue>

class Solution {
public:
    int findKthLargest(std::vector<int>& nums, int k) {
        auto cmp = [](int a, int b) { return a > b; };
        std::priority_queue<int, std::vector<int>, decltype(cmp)> pq(cmp);
        for (int num : nums) {
            if (pq.size() < k) {
                pq.push(num);
            } else if (num > pq.top()) {
                pq.pop();
                pq.push(num);
            }
        }
        return pq.top();
    }
};
```

### C++ (快速选择)
```C++

#include <vector>
#include <algorithm> // for std::swap
#include <cstdlib>   // for rand()

class Solution {
private:
    std::vector<int> nums_copy; // 使用成员变量来传递数组
    int n;

public:
    // Lomuto partition scheme with random pivot
    int partition(int left, int right) {
        if (left >= right) return left;
        int pivot_idx = left + rand() % (right - left);
        std::swap(nums_copy[left], nums_copy[pivot_idx]);
        
        int pivot_value = nums_copy[left];
        int store_idx = left; // store_idx 是 pivot 最终要放的位置
        
        for (int i = left + 1; i <= right; ++i) {
            if (nums_copy[i] < pivot_value) {
                store_idx++;
                std::swap(nums_copy[i], nums_copy[store_idx]);
            }
        }
        std::swap(nums_copy[left], nums_copy[store_idx]);
        return store_idx;
    }

    int quickSelect(int left, int right, int target_index) {
        if (left == right) {
            return nums_copy[left];
        }
        
        int pivot_index = partition(left, right);
        
        if (pivot_index == target_index) {
            return nums_copy[pivot_index];
        } else if (pivot_index < target_index) {
            return quickSelect(pivot_index + 1, right, target_index);
        } else {
            return quickSelect(left, pivot_index - 1, target_index);
        }
    }

    int findKthLargest(std::vector<int>& nums, int k) {
        this->nums_copy = nums;
        this->n = nums.size();
        srand(time(0)); // 设置随机种子
        
        // 第 k 大的元素，在升序排序后的索引是 n - k
        int target_index = n - k;
        return quickSelect(0, n - 1, target_index);
    }
};
```