import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: "未屿的知识库",
  description: "一个全面的知识总结网站",

  themeConfig: {
    // 顶部导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: 'LeetCode HOT100', link: '/LeetCode-HOT100/1-哈希表 (Hash-Table)/两数之和' },
      // 确保在 Handwritten 目录下有名为 SingletonPattern.md 的文件
      { text: '手写场景题', link: '/Handwritten/单例模式 (SingletonPattern)' }
    ],

    search: {
      provider: 'local'
    },

    // 核心：多模块侧边栏配置
    sidebar: {
      // 当 URL 匹配 /LeetCode-HOT100/ 前缀时，应用此侧边栏
      '/LeetCode-HOT100/': [
        {
          text: 'LeetCode HOT100',
          items: [
            {
              text: '1-哈希表 (Hash-Table)',
              collapsed: false, // 默认展开
              items: [
                { text: '两数之和', link: '/LeetCode-HOT100/1-哈希表 (Hash-Table)/两数之和' },
                { text: '字母异位词分组', link: '/LeetCode-HOT100/1-哈希表 (Hash-Table)/字母异位词分组' },
                { text: '最长连续序列', link: '/LeetCode-HOT100/1-哈希表 (Hash-Table)/最长连续序列' },
              ]
            },
            {
              text: '2-双指针 (Two-Pointers)',
              collapsed: true,
              items: [
                { text: '移动零', link: '/LeetCode-HOT100/2-双指针 (Two-Pointers)/移动零' },
                { text: '盛最多水的容器', link: '/LeetCode-HOT100/2-双指针 (Two-Pointers)/盛最多水的容器' },
                { text: '三数之和', link: '/LeetCode-HOT100/2-双指针 (Two-Pointers)/三数之和' },
                { text: '接雨水', link: '/LeetCode-HOT100/2-双指针 (Two-Pointers)/接雨水' },
              ]
            },
            {
              text: '3-滑动窗口 (Sliding-Window)',
              collapsed: true,
              items: [
                { text: '无重复字符的最长子串', link: '/LeetCode-HOT100/3-滑动窗口 (Sliding-Window)/无重复字符的最长子串' },
                { text: '找到字符串中所有字母异位词', link: '/LeetCode-HOT100/3-滑动窗口 (Sliding-Window)/找到字符串中所有字母异位词' },
              ]
            },
            {
              text: '4-子串 (Substring)',
              collapsed: true,
              items: [
                { text: '和为 K 的子数组', link: '/LeetCode-HOT100/4-子串 (Substring)/和为 K 的子数组' },
                { text: '滑动窗口最大值', link: '/LeetCode-HOT100/4-子串 (Substring)/滑动窗口最大值' },
                { text: '最小覆盖子串', link: '/LeetCode-HOT100/4-子串 (Substring)/最小覆盖子串' },
              ]
            },
            {
              text: '5-数组 (Array)',
              collapsed: true,
              items: [
                { text: '最大子数组和', link: '/LeetCode-HOT100/5-数组 (Array)/最大子数组和' },
                { text: '合并区间', link: '/LeetCode-HOT100/5-数组 (Array)/合并区间' },
                { text: '轮转数组', link: '/LeetCode-HOT100/5-数组 (Array)/轮转数组' },
                { text: '除自身以外数组的乘积', link: '/LeetCode-HOT100/5-数组 (Array)/除自身以外数组的乘积' },
                { text: '缺失的第一个正数', link: '/LeetCode-HOT100/5-数组 (Array)/缺失的第一个正数' },
              ]
            },
            {
              text: '6-矩阵 (Matrix)',
              collapsed: true,
              items: [
                { text: '矩阵置零', link: '/LeetCode-HOT100/6-矩阵 (Matrix)/矩阵置零' },
                { text: '螺旋矩阵', link: '/LeetCode-HOT100/6-矩阵 (Matrix)/螺旋矩阵' },
                { text: '旋转图像', link: '/LeetCode-HOT100/6-矩阵 (Matrix)/旋转图像' },
                { text: '搜索二维矩阵 II', link: '/LeetCode-HOT100/6-矩阵 (Matrix)/搜索二维矩阵 II' },
              ]
            },
            {
              text: '7-链表 (Linked-List)',
              collapsed: true,
              items: [
                { text: '相交链表', link: '/LeetCode-HOT100/7-链表 (Linked-List)/相交链表' },
                { text: '反转链表', link: '/LeetCode-HOT100/7-链表 (Linked-List)/反转链表' },
                { text: '回文链表', link: '/LeetCode-HOT100/7-链表 (Linked-List)/回文链表' },
                { text: '环形链表', link: '/LeetCode-HOT100/7-链表 (Linked-List)/环形链表' },
                { text: '环形链表 II', link: '/LeetCode-HOT100/7-链表 (Linked-List)/环形链表 II' },
                { text: '合并两个有序链表', link: '/LeetCode-HOT100/7-链表 (Linked-List)/合并两个有序链表' },
                { text: '两数相加', link: '/LeetCode-HOT100/7-链表 (Linked-List)/两数相加' },
                { text: '删除链表的倒数第 N 个结点', link: '/LeetCode-HOT100/7-链表 (Linked-List)/删除链表的倒数第 N 个结点' },
                { text: '两两交换链表中的节点', link: '/LeetCode-HOT100/7-链表 (Linked-List)/两两交换链表中的节点' },
                { text: 'K 个一组翻转链表', link: '/LeetCode-HOT100/7-链表 (Linked-List)/K 个一组翻转链表' },
                { text: '随机链表的复制', link: '/LeetCode-HOT100/7-链表 (Linked-List)/随机链表的复制' },
                { text: '排序链表', link: '/LeetCode-HOT100/7-链表 (Linked-List)/排序链表' },
                { text: 'LRU 缓存', link: '/LeetCode-HOT100/7-链表 (Linked-List)/LRU 缓存' },
              ]
            },
            {
              text: '8-二叉树 (Binary-Tree)',
              collapsed: true,
              items: [
                { text: '二叉树的中序遍历', link: '/LeetCode-HOT100/8-二叉树 (Binary-Tree)/二叉树的中序遍历' },
                { text: '二叉树的最大深度', link: '/LeetCode-HOT100/8-二叉树 (Binary-Tree)/二叉树的最大深度' },
                { text: '翻转二叉树', link: '/LeetCode-HOT100/8-二叉树 (Binary-Tree)/翻转二叉树' },
                { text: '对称二叉树', link: '/LeetCode-HOT100/8-二叉树 (Binary-Tree)/对称二叉树' },
                { text: '二叉树的直径', link: '/LeetCode-HOT100/8-二叉树 (Binary-Tree)/二叉树的直径' },
                { text: '二叉树的层序遍历', link: '/LeetCode-HOT100/8-二叉树 (Binary-Tree)/二叉树的层序遍历' },
                { text: '将有序数组转换为二叉搜索树', link: '/LeetCode-HOT100/8-二叉树 (Binary-Tree)/将有序数组转换为二叉搜索树' },
                { text: '验证二叉搜索树', link: '/LeetCode-HOT100/8-二叉树 (Binary-Tree)/验证二叉搜索树' },
                { text: '二叉搜索树中第 K 小的元素', link: '/LeetCode-HOT100/8-二叉树 (Binary-Tree)/二叉搜索树中第 K 小的元素' },
                { text: '二叉树的右视图', link: '/LeetCode-HOT100/8-二叉树 (Binary-Tree)/二叉树的右视图' },
                { text: '二叉树展开为链表', link: '/LeetCode-HOT100/8-二叉树 (Binary-Tree)/二叉树展开为链表' },
                { text: '从前序与中序遍历序列构造二叉树', link: '/LeetCode-HOT100/8-二叉树 (Binary-Tree)/从前序与中序遍历序列构造二叉树' },
                { text: '路径总和 III', link: '/LeetCode-HOT100/8-二叉树 (Binary-Tree)/路径总和 III' },
                { text: '二叉树的最近公共祖先', link: '/LeetCode-HOT100/8-二叉树 (Binary-Tree)/二叉树的最近公共祖先' },
                { text: '二叉树中的最大路径和', link: '/LeetCode-HOT100/8-二叉树 (Binary-Tree)/二叉树中的最大路径和' },
              ]
            },
            {
              text: '9-图论 (Graph-Theory)',
              collapsed: true,
              items: [
                { text: '岛屿数量', link: '/LeetCode-HOT100/9-图论 (Graph-Theory)/岛屿数量' },
                { text: '腐烂的橘子', link: '/LeetCode-HOT100/9-图论 (Graph-Theory)/腐烂的橘子' },
                { text: '课程表', link: '/LeetCode-HOT100/9-图论 (Graph-Theory)/课程表' },
                { text: '实现 Trie (前缀树)', link: '/LeetCode-HOT100/9-图论 (Graph-Theory)/实现 Trie (前缀树)' },
              ]
            },
            {
              text: '10-回溯 (Backtracking)',
              collapsed: true,
              items: [
                { text: '全排列', link: '/LeetCode-HOT100/10-回溯 (Backtracking)/全排列' },
                { text: '子集', link: '/LeetCode-HOT100/10-回溯 (Backtracking)/子集' },
                { text: '电话号码的字母组合', link: '/LeetCode-HOT100/10-回溯 (Backtracking)/电话号码的字母组合' },
                { text: '组合总和', link: '/LeetCode-HOT100/10-回溯 (Backtracking)/组合总和' },
                { text: '括号生成', link: '/LeetCode-HOT100/10-回溯 (Backtracking)/括号生成' },
                { text: '单词搜索', link: '/LeetCode-HOT100/10-回溯 (Backtracking)/单词搜索' },
                { text: '分割回文串', link: '/LeetCode-HOT100/10-回溯 (Backtracking)/分割回文串' },
                { text: 'N 皇后', link: '/LeetCode-HOT100/10-回溯 (Backtracking)/N 皇后' },
              ]
            },
            {
              text: '11-二分查找 (Binary-Search)',
              collapsed: true,
              items: [
                { text: '搜索插入位置', link: '/LeetCode-HOT100/11-二分查找 (Binary-Search)/搜索插入位置' },
                { text: '搜索二维矩阵', link: '/LeetCode-HOT100/11-二分查找 (Binary-Search)/搜索二维矩阵' },
                { text: '在排序数组中查找元素的第一个和最后一个位置', link: '/LeetCode-HOT100/11-二分查找 (Binary-Search)/在排序数组中查找元素的第一个和最后一个位置' },
                { text: '搜索旋转排序数组', link: '/LeetCode-HOT100/11-二分查找 (Binary-Search)/搜索旋转排序数组' },
                { text: '寻找旋转排序数组中的最小值', link: '/LeetCode-HOT100/11-二分查找 (Binary-Search)/寻找旋转排序数组中的最小值' },
                { text: '寻找两个正序数组的中位数', link: '/LeetCode-HOT100/11-二分查找 (Binary-Search)/寻找两个正序数组的中位数' },
              ]
            },
            {
              text: '12-栈 (Stack)',
              collapsed: true,
              items: [
                { text: '有效的括号', link: '/LeetCode-HOT100/12-栈 (Stack)/有效的括号' },
                { text: '最小栈', link: '/LeetCode-HOT100/12-栈 (Stack)/最小栈' },
                { text: '字符串解码', link: '/LeetCode-HOT100/12-栈 (Stack)/字符串解码' },
                { text: '每日温度', link: '/LeetCode-HOT100/12-栈 (Stack)/每日温度' },
                { text: '柱状图中最大的矩形', link: '/LeetCode-HOT100/12-栈 (Stack)/柱状图中最大的矩形' },
              ]
            },
            {
              text: '13-堆 (Heap)',
              collapsed: true,
              items: [
                { text: '数组中的第K个最大元素', link: '/LeetCode-HOT100/13-堆 (Heap)/数组中的第K个最大元素' },
                { text: '前 K 个高频元素', link: '/LeetCode-HOT100/13-堆 (Heap)/前 K 个高频元素' },
                { text: '数据流的中位数', link: '/LeetCode-HOT100/13-堆 (Heap)/数据流的中位数' },
              ]
            },
            {
              text: '14-贪心算法 (Greedy)',
              collapsed: true,
              items: [
                { text: '买卖股票的最佳时机', link: '/LeetCode-HOT100/14-贪心算法 (Greedy)/买卖股票的最佳时机' },
                { text: '跳跃游戏', link: '/LeetCode-HOT100/14-贪心算法 (Greedy)/跳跃游戏' },
                { text: '跳跃游戏 II', link: '/LeetCode-HOT100/14-贪心算法 (Greedy)/跳跃游戏 II' },
                { text: '划分字母区间', link: '/LeetCode-HOT100/14-贪心算法 (Greedy)/划分字母区间' },
              ]
            },
            {
              text: '15-动态规划 (Dynamic-Programming)',
              collapsed: true,
              items: [
                { text: '爬楼梯', link: '/LeetCode-HOT100/15-动态规划 (Dynamic-Programming)/爬楼梯' },
                { text: '杨辉三角', link: '/LeetCode-HOT100/15-动态规划 (Dynamic-Programming)/杨辉三角' },
                { text: '打家劫舍', link: '/LeetCode-HOT100/15-动态规划 (Dynamic-Programming)/打家劫舍' },
                { text: '完全平方数', link: '/LeetCode-HOT100/15-动态规划 (Dynamic-Programming)/完全平方数' },
                { text: '零钱兑换', link: '/LeetCode-HOT100/15-动态规划 (Dynamic-Programming)/零钱兑换' },
                { text: '单词拆分', link: '/LeetCode-HOT100/15-动态规划 (Dynamic-Programming)/单词拆分' },
                { text: '最长递增子序列', link: '/LeetCode-HOT100/15-动态规划 (Dynamic-Programming)/最长递增子序列' },
                { text: '乘积最大子数组', link: '/LeetCode-HOT100/15-动态规划 (Dynamic-Programming)/乘积最大子数组' },
                { text: '分割等和子集', link: '/LeetCode-HOT100/15-动态规划 (Dynamic-Programming)/分割等和子集' },
                { text: '最长有效括号', link: '/LeetCode-HOT100/15-动态规划 (Dynamic-Programming)/最长有效括号' },
                { text: '不同路径', link: '/LeetCode-HOT100/15-动态规划 (Dynamic-Programming)/不同路径' },
                { text: '最小路径和', link: '/LeetCode-HOT100/15-动态规划 (Dynamic-Programming)/最小路径和' },
                { text: '最长回文子串', link: '/LeetCode-HOT100/15-动态规划 (Dynamic-Programming)/最长回文子串' },
                { text: '最长公共子序列', link: '/LeetCode-HOT100/15-动态规划 (Dynamic-Programming)/最长公共子序列' },
                { text: '编辑距离', link: '/LeetCode-HOT100/15-动态规划 (Dynamic-Programming)/编辑距离' },
              ]
            },
            {
              text: '16-技巧 (Tricks)',
              collapsed: true,
              items: [
                { text: '只出现一次的数字', link: '/LeetCode-HOT100/16-技巧 (Tricks)/只出现一次的数字' },
                { text: '多数元素', link: '/LeetCode-HOT100/16-技巧 (Tricks)/多数元素' },
                { text: '颜色分类', link: '/LeetCode-HOT100/16-技巧 (Tricks)/颜色分类' },
                { text: '下一个排列', link: '/LeetCode-HOT100/16-技巧 (Tricks)/下一个排列' },
                { text: '寻找重复数', link: '/LeetCode-HOT100/16-技巧 (Tricks)/寻找重复数' },
              ]
            }
          ]
        }
      ],

      // 当 URL 匹配 /Handwritten/ 前缀时，应用此侧边栏
      '/Handwritten/': [
        {
          text: 'C++ 手写场景题',
          items: [
            // 链接已更新为新的文件名 (不带.md后缀)
            { text: '线程交替打印', link: '/Handwritten/线程交替打印 (AlternatePrinting)' },
            { text: '手写单例模式', link: '/Handwritten/单例模式 (SingletonPattern)' },
            { text: '手写智能指针 (shared_ptr)', link: '/Handwritten/智能指针 (SharedPtr)' },
            { text: '手写线程安全的阻塞队列', link: '/Handwritten/阻塞队列 (BlockingQueue)' },
            { text: '手写线程池', link: '/Handwritten/线程池 (ThreadPool)' },
            { text: '手写 String 类', link: '/Handwritten/String类 (StringClass)' },
            { text: '手写 Vector 类', link: '/Handwritten/Vector类 (VectorClass)' },
            { text: '实现生产者消费者模型', link: '/Handwritten/生产者消费者模型 (ProducerConsumer)' },
            { text: '实现大数相加', link: '/Handwritten/大数相加 (BigNumberAddition)' },
          ]
        }
      ]
    },

    socialLinks: [
      // { icon: 'github', link: 'https://github.com/your-github-username' }
    ]
  }
})