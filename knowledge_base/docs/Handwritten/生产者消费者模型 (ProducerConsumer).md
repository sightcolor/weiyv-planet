# 生产者消费者模型 (Producer-Consumer Problem)

> **问题类型:** 多线程同步经典问题 (Classic Multithreading Synchronization Problem)

---

## 问题描述

### 核心思想
**生产者-消费者模型** 是一个经典的多线程同步问题。它描述了这样一种场景：有一群“生产者”线程和一群“消费者”线程，它们通过一个共享的、容量有限的“缓冲区”（通常是一个队列）来协作。

*   **生产者 (Producer)**：负责创建数据（或任务），并将这些数据放入缓冲区。
*   **消费者 (Consumer)**：负责从缓冲区中取出数据，并进行处理。
*   **缓冲区 (Buffer)**：作为一个临时的存储区域，解耦了生产者和消费者的执行效率。

### 面临的挑战 (约束条件)
1.  **缓冲区满**: 当缓冲区已满时，生产者必须停止生产并 **高效地等待**，直到消费者取走数据，腾出空间。
2.  **缓冲区空**: 当缓冲区为空时，消费者必须停止消费并 **高效地等待**，直到生产者放入新的数据。
3.  **互斥访问**: 生产者放入数据和消费者取出数据的操作都涉及到对共享缓冲区（临界资源）的修改，必须是 **互斥** 的，即同一时间只允许一个线程操作缓冲区，以防止数据错乱。

---

## 解题思路与核心工具

为了解决上述挑战，我们需要借助 C++11 提供的线程同步原语：

1.  **互斥锁 (`std::mutex`)**: 用于保护共享缓冲区。在任何线程访问缓冲区之前，必须先获取锁；访问结束后，必须释放锁。这保证了操作的 **原子性** 和 **互斥性**。

2.  **条件变量 (`std::condition_variable`)**: 它是解决高效等待问题的关键，可以被理解为一个 **“线程等待/通知”机制**。它允许线程在某个条件不满足时，自动释放锁并进入 **休眠状态**，避免了消耗CPU的“忙等”。当其他线程改变了这个条件后，可以 **通知 (notify)** 正在等待的线程，使其被唤醒。

我们使用 **两个** 条件变量来让逻辑更清晰：
*   `cv_not_full`：一个“生产者休息室”，当队列满了，生产者在此等待。
*   `cv_not_empty`：一个“消费者休息室”，当队列空了，消费者在此等待。

---

## 代码编写思考流程

我们把整个实现封装成一个线程安全的 `BlockingQueue` 类。

### 第一步：设计类结构 (定义“战场”和“规则”)
1.  **确定核心组件 (私有成员变量)**：
    *   `std::queue<T> m_queue;` // 底层缓冲区
    *   `size_t m_capacity;` // 缓冲区容量
    *   `std::mutex m_mutex;` // 保护队列的互斥锁
    *   `std::condition_variable m_cv_not_full;` // 生产者等待队列满的机制
    *   `std::condition_variable m_cv_not_empty;` // 消费者等待队列空的机制
2.  **确定对外接口 (公开成员函数)**：
    *   `BlockingQueue(size_t capacity);` // 构造函数
    *   `void put(const T& item);` // 生产者接口
    *   `T take();` // 消费者接口

### 第二步：实现生产者逻辑 (`put` 方法)
1.  **上锁**: 进入函数后，立刻使用 `std::unique_lock` 获取互斥锁。必须用 `unique_lock` 因为条件变量需要它的灵活性。
2.  **检查并等待**: 使用 `m_cv_not_full.wait()` 来等待“队列不满”这个条件。`wait` 函数会接收一个 Lambda 表达式作为条件，如果条件不满足，它会自动释放锁并让当前线程休眠。
3.  **执行操作**: 当 `wait` 返回时，线程保证持有锁且条件满足。此时可以安全地将元素 `push` 进队列。
4.  **通知**: 放入元素后，队列状态从“可能为空”变为“绝对不为空”。因此，调用 `m_cv_not_empty.notify_one()` 去唤醒一个可能正在等待的消费者。

### 第三步：实现消费者逻辑 (`take` 方法)
该逻辑与生产者完全对称。
1.  **上锁**: 使用 `std::unique_lock` 获取互斥锁。
2.  **检查并等待**: 使用 `m_cv_not_empty.wait()` 来等待“队列不空” (`!m_queue.empty()`) 这个条件。
3.  **执行操作**: 当 `wait` 返回时，安全地从队列中 `front()` 和 `pop()` 一个元素。
4.  **通知**: 取出元素后，队列状态从“可能为满”变为“绝对不满”。因此，调用 `m_cv_not_full.notify_one()` 去唤醒一个可能正在等待的生产者。
5.  **返回** 取出的元素。

### 第四步：编写测试代码 (`main` 函数)
1.  **警惕 `std::cout`**: `std::cout` 本身也是一个全局共享资源，直接在多线程中调用会导致输出混乱。因此，需要创建一个额外的全局互斥锁（如 `print_mutex`）来保护所有的打印操作。
2.  **创建场景**: 实例化 `BlockingQueue`，创建多个生产者和消费者线程。
3.  **保证结束**: 设计任务量，使得 `总产量 == 总消耗量`，以确保程序可以正常结束。
4.  **等待完成**: 主线程必须 `join()` 所有子线程，等待它们执行完毕。

---

## 最终代码实现

```cpp
#include <iostream>
#include <mutex>
#include <queue>
#include <condition_variable>
#include <string> // 用于打印信息
#include <vector>
#include <chrono>
#include <thread>

// 1. 创建一个专门用于保护 std::cout 的全局互斥锁
std::mutex print_mutex;

template<typename T>
class BlockingQueue
{
private:
    size_t m_capacity;
    std::queue<T> m_queue;
    std::mutex m_mutex;
    std::condition_variable m_cv_not_full;
    std::condition_variable m_cv_not_empty;

public:
    BlockingQueue(size_t capacity) : m_capacity(capacity){};

    void put(const T& item) {
        // 进门上锁
        std::unique_lock<std::mutex> lock(m_mutex);  // 定义一个自动管理声明周期的RALL锁
        // not full 也就是条件变量为真的时候不阻塞 假的时候阻塞
        m_cv_not_full.wait(lock, [this]() -> bool {  // 这里的this需要捕获当前实例对象，因为不捕获的话会导致
            return m_queue.size() < m_capacity;   // 如果条件不满足则自动释放锁并且阻塞当前线程
        });
        // 可能为空->绝对不为空
        // 加入消费队列
        m_queue.push(item);
        // 通知取餐
        m_cv_not_empty.notify_one();
    }

    T take() {
        std::unique_lock<std::mutex> lock(m_mutex);
        m_cv_not_empty.wait(lock, [this]() -> bool{
            return !m_queue.empty();
        });
        // 可能满->一定不满
        // 消费
        T item = m_queue.front();
        m_queue.pop();
        m_cv_not_full.notify_one();
        return item;
    }
};

void producer_task(BlockingQueue<int>& bq, int start_val) {
    for(int i = 0; i < 10; i++) {
        int item = start_val + i;
        {
            std::unique_lock<std::mutex> lock(print_mutex);
            std::cout << "[procuder"  << std::this_thread::get_id() << "] is producing." << std::endl;
        }
        
        bq.put(item);
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
    }
}
// 消费者线程要执行的任务
void consumer_task(BlockingQueue<int>& bq) {
    for (int i = 0; i < 15; ++i) {
        int item = bq.take();
        {
            std::unique_lock<std::mutex> lock(print_mutex);
            std::cout << "[Consumer " << std::this_thread::get_id() << "] consumed item " << item << "!" << std::endl;
       
        }
        // 模拟消费需要一些时间
        std::this_thread::sleep_for(std::chrono::milliseconds(150));
    }
}

int main() {
     std::cout << "--- Test Start ---" << std::endl;
      // 1. 创建一个容量为 5 的共享阻塞队列
    BlockingQueue<int> blocking_queue(5);
    // 2. 创建一个容器来存放我们的线程，方便管理
    std::vector<std::thread> threads;
    // 创建并且启动生产者
    threads.emplace_back(producer_task, std::ref(blocking_queue), 100); // 生产 100-109
    threads.emplace_back(producer_task, std::ref(blocking_queue), 200); // 生产 200-209
    threads.emplace_back(producer_task, std::ref(blocking_queue), 300); // 生产 300-309
    // 总产量: 3 * 10 = 30
    // 4. 创建并启动 2 个消费者线程
    threads.emplace_back(consumer_task, std::ref(blocking_queue));
    threads.emplace_back(consumer_task, std::ref(blocking_queue));
    // 总消耗量: 2 * 15 = 30

    // 5. 等待所有线程完成工作 (谢幕)
    for (auto& t : threads) {
        if (t.joinable()) {
            t.join();
        }
    }

    std::cout << "--- Test Finish ---" << std::endl;

    return 0;
}
```