# 单例模式 (Singleton Pattern)

> **模式类型:** 创建型模式 (Creational Pattern)

---

## 模式定义与核心思想

### 核心思想
**单例模式 (Singleton Pattern)** 是一种创建型设计模式，它确保一个类在任何情况下都 **只有一个实例**，并为该实例提供一个 **全局统一的访问点**。

这个模式解决了两个问题：
1.  **保证唯一实例**：对于某些需要全局共享状态或资源的组件（如数据库连接池、日志记录器），必须保证只有一个实例在运行，以避免冲突和不一致。
2.  **提供全局访问点**：提供一个比全局变量更优雅的访问方式，避免了全局变量污染命名空间的缺点。

### 实现关键点
无论哪种实现方式，通常都包含以下几个共通的关键点：
*   **私有化构造函数**：为了防止外部通过 `new` 关键字创建多个实例。
*   **私有化析构函数**：防止外部 `delete` 单例实例。
*   **禁用拷贝构造和赋值运算符**：防止通过拷贝或赋值操作复制出新的实例。
*   **提供一个静态的全局访问方法**：通常命名为 `getInstance()`，用于获取那个唯一的实例。

---

## 实现一：懒汉式 (Lazy Initialization)

### 核心思想
懒汉式的核心在于 **延迟加载**。实例只有在第一次被请求（即 `getInstance()` 方法第一次被调用）时才会被创建。

*   **优点**: 如果实例从未使用过，就不会有创建的开销，节省了内存和启动时间。
*   **缺点**: 传统的实现方式需要处理多线程环境下的同步问题，否则可能创建出多个实例。

### C++11 实现 (Magic Statics - 推荐)
利用 C++11 标准中的“魔术静态变量”特性，可以写出既简洁又线程安全的懒汉式单例。标准保证了函数内的局部静态变量的初始化是线程安全的。

#### 实现要点
1.  将构造函数、析构函数、拷贝构造和赋值运算符都设置为 `private` 或 `delete`。
2.  `getInstance()` 方法必须返回实例的 **引用** (`Singleton&`)。
3.  在 `getInstance()` 方法内部，使用 `static` 关键字定义唯一的实例变量。该变量只会在第一次调用 `getInstance()` 时被初始化一次，并且这个过程是线程安全的。

#### 代码实现
```cpp
#include <iostream>
#include <mutex>

class Singleton
{
private:
    int count = 0;
    
    // 1. 构造和析构函数私有化
    Singleton() {
        std::cout << "Lazy instance created." << std::endl;
    };
    ~Singleton() {
        std::cout << "Lazy instance destroyed." << std::endl;
    };

public:
    // 2. 禁用拷贝构造和赋值运算符
    Singleton(const Singleton&) = delete;
    Singleton& operator=(const Singleton&) = delete;

    // 3. 提供全局访问点
    static Singleton& getInstance() {
        // C++11 特性保证了局部静态变量的初始化是线程安全的
        static Singleton instance;
        return instance;
    }

    void doSomething() {
        std::cout << "Count is now: " << ++count << ". Address of instance: " << this << std::endl;
    }
};
```
## 实现二：饿汉式 (Eager Initialization)

### 核心思想
饿汉式的核心在于 **提前创建**。实例在程序启动、类被加载时就已经被创建并初始化好了，`getInstance()` 方法只是简单地返回这个已经存在的实例。

*   **优点**: 实现简单，并且天然是线程安全的，因为实例在任何线程活动之前就已经创建好了。
*   **缺点**: 即使一次也没有使用该实例，它也会在程序启动时被创建，可能导致启动速度变慢和资源浪费。

### 实现要点
1.  同样，将构造函数、析构函数、拷贝构造和赋值运算符都设置为 `private` 或 `delete`。
2.  在类的内部 **声明** 一个 `private static` 的实例成员。
3.  在类的外部（全局作用域）对这个静态实例成员进行 **定义和初始化**。这是实现饿汉式的关键步骤。
4.  `getInstance()` 方法直接返回这个静态成员的引用。

### 代码实现
```cpp
#include <iostream>

class Singleton
{
private:
    // 1. 构造和析构函数私有化
    Singleton() {
        std::cout << "Eager instance created." << std::endl;
    }
    ~Singleton() {
        std::cout << "Eager instance destroyed." << std::endl;
    }

    // 2. 在类内部声明静态实例
    static Singleton instance;

public:
    // 3. 禁用拷贝和赋值
    Singleton(const Singleton&) = delete;
    Singleton& operator=(const Singleton&) = delete;

    // 4. 提供全局访问点
    static Singleton& getInstance() {
        return instance;
    }

    void doSomething() {
        std::cout << "Doing something." << std::endl;
    }
};

// 5. 在类外部进行定义和初始化
Singleton Singleton::instance;
```
---

## 对比总结

| 特性       | 懒汉式 (C++11 Magic Statics)         | 饿汉式 (Eager Initialization)          |
| ---------- | ------------------------------------ | -------------------------------------- |
| 初始化时机 | 首次调用 `getInstance()` 时          | 程序启动时 (类加载时)                  |
| 线程安全   | **安全** (C++11 标准保证)            | **安全** (天然线程安全)                |
| 资源占用   | 按需加载，如果不使用则不占用资源     | 启动时即占用资源，可能造成浪费         |
| 实现复杂度 | 极简，推荐使用                       | 简单，但需要类外定义                   |
| 适用场景   | 实例创建开销大或不一定会被使用的场景 | 实例必须存在且创建开销不大的场景       |

---

## 适用场景

单例模式在需要严格控制实例数量的场景中非常有用，例如：

*   **日志记录器 (Logger):** 整个应用程序共享一个日志记录器实例，以便将日志写入同一个文件。
*   **配置管理器 (Configuration Manager):** 读取和存储应用配置，全局共享一份配置信息。
*   **数据库连接池 (Database Connection Pool):** 管理数据库连接，避免频繁创建和销毁连接带来的开销。
*   **线程池 (Thread Pool):** 管理一组工作线程，供整个应用程序复用。
*   **硬件设备访问:** 对于像打印机、显卡等硬件设备的访问，通常也使用单例模式来管理。