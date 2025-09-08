### IO操作的两个核心阶段
1. **等待数据准备**：内核等待数据就绪，时间完全取决于对端。
2. **拷贝数据到用户态**: 内核将缓冲区的内容拷贝到用户态。
(存在从网卡拷贝数据到内核缓冲区的阶段)

### 阻塞 I/O (Blocking I/O - BIO)
```mermaid
sequenceDiagram
    participant UserApp as 用户程序
    participant Kernel as 内核

    UserApp->>Kernel: 调用 recvfrom()
    Note right of UserApp: 程序被阻塞，无法执行
    Kernel->>Kernel: 等待数据到达...
    Note right of Kernel: (阶段1: 等待数据)
    Kernel->>Kernel: 数据到达，拷贝数据到用户缓冲区
    Note right of Kernel: (阶段2: 拷贝数据)
    Kernel-->>UserApp: recvfrom() 返回成功
    Note right of UserApp: 程序解除阻塞，继续执行
```

### 非阻塞 I/O (Non-blocking I/O - NIO)
```mermaid
sequenceDiagram
    participant UserApp as 用户程序
    participant Kernel as 内核

    loop 轮询检查
        UserApp->>Kernel: 调用 recvfrom
        alt 数据未准备好
            Kernel-->>UserApp: 立即返回错误 EWOULDBLOCK
            UserApp->>UserApp: 执行其他任务...
        else 数据已准备好
            Kernel->>Kernel: 拷贝数据到用户缓冲区
            Kernel-->>UserApp: recvfrom 返回成功
            break
        end
    end
    UserApp->>UserApp: 处理数据
```

### I/O 多路复用 (I/O Multiplexing)
```mermaid
sequenceDiagram
    participant UserApp as 用户程序
    participant Kernel as 内核

    UserApp->>Kernel: 调用 epoll_ctl() 注册多个 socket
    UserApp->>Kernel: 调用 epoll_wait()
    Note right of UserApp: 程序被阻塞，等待任何一个 socket 就绪

    Kernel->>Kernel: 同时监视多个 socket ...
    Note right of Kernel: (阶段1: 内核在等待)

    Kernel-->>UserApp: epoll_wait() 返回，通知有 N 个 socket 就绪
    Note right of UserApp: 程序解除阻塞

    loop 遍历就绪的 socket
        UserApp->>Kernel: 对就绪的 socket 调用 recvfrom()
        Kernel->>Kernel: 拷贝数据 (阶段2)
        Kernel-->>UserApp: recvfrom() 返回成功
    end
    UserApp->>UserApp: 处理所有数据
```

### 异步 I/O (Asynchronous I/O - AIO)
```mermaid
sequenceDiagram
    participant UserApp as 用户程序
    participant Kernel as 内核

    UserApp->>Kernel: 调用 aio_read() (带 buffer 和回调函数)
    Note right of UserApp: 调用立即返回，程序继续执行其他任务
    Kernel-->>UserApp: aio_read() 立即返回成功

    Kernel->>Kernel: 在后台等待数据... (阶段1)
    Kernel->>Kernel: 数据到达，自动拷贝数据到用户缓冲区 (阶段2)

    Kernel->>UserApp: 触发信号或执行回调函数，通知操作完成
    UserApp->>UserApp: 在回调函数中处理数据
```
