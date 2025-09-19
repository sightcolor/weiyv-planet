# 工厂模式 (Factory Pattern)

> **模式类型**：创建型模式 (Creational Pattern)  

---

## 模式定义与核心思想  

### 核心思想  
工厂模式的核心在于 **将对象的创建与使用分离**。  
即：把“创建对象”的职责交给专门的工厂类或方法，而不是由客户端直接通过 `new` 关键字去实例化。  

好处：  
1. 客户端代码不依赖具体实现类，只依赖工厂接口和抽象产品，提高了**代码的可扩展性**和**可维护性**。  
2. 如果要扩展新的产品，只需要扩展工厂，而非大范围修改客户端逻辑，符合 **开闭原则**。  

---

## 工厂模式的三种主要形式  

### 1. 简单工厂 (Simple Factory)  

**定义**  
简单工厂不是真正“设计模式三剑客”里的官方模式，但在实际开发中用得非常多。它通过一个工厂类集中管理产品的创建逻辑，根据传入的参数决定返回哪种具体产品对象。  

**实现思路**  
1. 定义一个抽象产品基类。  
2. 定义多个具体产品类实现该基类。  
3. 定义一个工厂类，提供一个“参数化的创建方法”，内部通过条件判断(`if-else` / `switch`)返回不同的产品实例。  

**示例代码**  
```cpp
class Base {
public:
    virtual void pay() = 0;
};

class A : public Base {
public:
    void pay() override {
        std::cout << "product: A" << std::endl;
    }
};

class B : public Base {
public:
    void pay() override {
        std::cout << "product: B" << std::endl;
    }
};

// 简单工厂
class Factory {
public:
    Base* getProduct(char type) {
        if (type == 'A') return new A();
        if (type == 'B') return new B();
        return nullptr;
    }
};
```

**优缺点**  
- ✅ 优点：结构简单，使用方便，集中管理对象创建。  
- ❌ 缺点：违背开闭原则（每次新增产品都要修改工厂代码）。  

**适用场景**  
- 产品种类比较少，变化不频繁的场景。  

---

### 2. 工厂方法 (Factory Method)  

**定义**  
工厂方法模式将“产品的创建延迟到子类工厂中”。它不是用一个工厂来生产所有产品，而是每个具体工厂只负责生产自己的一类产品。  

**实现思路**  
1. 定义产品抽象类和具体产品类。  
2. 定义抽象工厂接口，声明工厂方法。  
3. 每个具体工厂类只负责生产一种具体产品。  

**示例代码**  
```cpp
class Coffee {
public:
    virtual void drink() = 0;
};

class A : public Coffee {
public:
    void drink() override {
        std::cout << "drinking A" << std::endl;
    }
};

class B : public Coffee {
public:
    void drink() override {
        std::cout << "drinking B" << std::endl;
    }
};

class Factory {
public:
    virtual std::shared_ptr<Coffee> getCoffee() = 0;
};

class FactoryA : public Factory {
public:
    std::shared_ptr<Coffee> getCoffee() override {
        return std::make_shared<A>();
    }
};

class FactoryB : public Factory {
public:
    std::shared_ptr<Coffee> getCoffee() override {
        return std::make_shared<B>();
    }
};
```

**优缺点**  
- ✅ 优点：满足开闭原则（新增产品 → 新建一个对应的工厂类即可）。  
- ❌ 缺点：类数量可能会急剧膨胀（每新增一个产品就要新增一个工厂）。  

**适用场景**  
- 产品体系需要经常扩展变化。  
- 每类产品的创建逻辑相对复杂，便于分工管理。  

---

### 3. 抽象工厂 (Abstract Factory)  

**定义**  
抽象工厂模式解决的是“一族产品”的生成问题。**工厂不仅负责生产一种产品，而是负责生产一整套相互关联的产品。**  

**实现思路**  
1. 定义多个抽象产品（如咖啡、甜点）。  
2. 每类产品有各自的具体实现（咖啡A、咖啡B、甜点A、甜点B）。  
3. 定义工厂抽象类，声明“获取一整套产品族”的接口。  
4. 具体工厂类负责产出同一产品族的一组产品（比如 `FactoryA` 产出 `CofA+DesA`，`FactoryB` 产出 `CofB+DesB`）。  

**示例代码核心**  
```cpp
class Coffee { public: virtual void drink() = 0; };
class Dessert { public: virtual void eat() = 0; };

class AbstractFactory {
public:
    virtual std::shared_ptr<Coffee> getCoffee() = 0;
    virtual std::shared_ptr<Dessert> getDessert() = 0;
};

class FactoryA : public AbstractFactory {
public:
    std::shared_ptr<Coffee> getCoffee() override { return std::make_shared<CofA>(); }
    std::shared_ptr<Dessert> getDessert() override { return std::make_shared<DesA>(); }
};

class FactoryB : public AbstractFactory {
public:
    std::shared_ptr<Coffee> getCoffee() override { return std::make_shared<CofB>(); }
    std::shared_ptr<Dessert> getDessert() override { return std::make_shared<DesB>(); }
};
```

**优缺点**  
- ✅ 优点：能保证一组产品族的**一致性**，不用担心配套混乱。  
- ❌ 缺点：扩展困难，如果要新增一种产品（例如披萨），需要修改所有工厂接口和实现。  

**适用场景**  
- 产品之间存在配套逻辑，必须成套使用，比如：  
  - 操作系统 UI 组件（Windows 风格、Mac 风格、Linux 风格 UI，一整套按钮+菜单+窗口）。  
  - 饮品 & 餐食套餐。  

---

## 三者对比总结  

| 模式         | 谁来决定具体产品 | 工厂数量 | 适用场景                                     | 扩展性 |
|--------------|------------------|----------|----------------------------------------------|--------|
| **简单工厂** | 工厂方法里硬编码 | 一个     | 产品种类少，变化不频繁                        | 差     |
| **工厂方法** | 具体工厂决定     | 多个     | 产品种类较多，且经常有新产品扩展              | 好     |
| **抽象工厂** | 具体工厂决定     | 多个     | 一族产品需要成套一致地产出（UI 套餐／饮食套餐） | 中     |

---

## 适用场景总结  

- **简单工厂**：小型项目，产品变化少。  
- **工厂方法**：中大型项目，产品扩展多。  
- **抽象工厂**：需要“一家人整整齐齐”的产品族（配套生产）。  

---

💡 **一句话记忆秘诀**：  
- 简单工厂：**一个工厂干所有事**。  
- 工厂方法：**一个工厂干一件事**。  
- 抽象工厂：**一个工厂出一整套套餐**。  

