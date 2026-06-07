import React, { useState, useEffect, useRef } from 'react'
import { Card, Button, Space, Slider, Tag } from 'antd'

/**
 * 聊天场景打字机效果完整实现
 *
 * 核心技术点：
 * 1. 生产者-消费者模型：后端推送 → 缓冲区 → 定时渲染
 * 2. 缓冲区队列：解耦数据接收和渲染速度
 * 3. 动态速度调整：根据缓冲区大小自适应
 * 4. 内存泄漏防护：useRef 管理定时器，useEffect 清理
 */
const ChatTypeWriter: React.FC = () => {
  // ========== 状态管理 ==========
  const [displayText, setDisplayText] = useState('') // 当前显示的文本
  const [isTyping, setIsTyping] = useState(false) // 是否正在打字
  const [bufferSize, setBufferSize] = useState(0) // 缓冲区大小（用于显示）
  const [baseSpeed, setBaseSpeed] = useState(50) // 基础打字速度（ms）

  // ========== Ref 引用（不触发重渲染）==========
  const bufferRef = useRef<string[]>([]) // 字符缓冲区队列
  const timerRef = useRef<NodeJS.Timeout | null>(null) // 定时器引用
  const contentRef = useRef<HTMLDivElement>(null) // 内容容器引用
  const eventSourceRef = useRef<EventSource | null>(null) // SSE 连接引用

  // ========== 核心逻辑：动态速度策略 ==========
  /**
   * 根据缓冲区大小动态调整打字速度
   * - 缓冲区 > 50：直接渲染完（跳过逐字）
   * - 缓冲区 > 20：加快速度到 20ms
   * - 缓冲区 <= 20：使用基础速度
   */
  const getTypingInterval = (bufferLength: number): number => {
    if (bufferLength > 50) return 0 // 直接渲染
    if (bufferLength > 20) return 20 // 加快速度
    return baseSpeed // 正常速度
  }

  // ========== 核心逻辑：消费缓冲区（定时器回调）==========
  const typeNextChar = () => {
    const currentBufferSize = bufferRef.current.length
    setBufferSize(currentBufferSize) // 更新显示的缓冲区大小

    // 缓冲区为空，继续等待新数据
    if (currentBufferSize === 0) {
      timerRef.current = setTimeout(typeNextChar, 100)
      return
    }

    // 策略1：缓冲区过大（>50），直接渲染完
    if (currentBufferSize > 50) {
      const remaining = bufferRef.current.join('')
      setDisplayText((prev) => prev + remaining)
      bufferRef.current = [] // 清空缓冲区
      setBufferSize(0)

      // 继续等待新数据
      timerRef.current = setTimeout(typeNextChar, 100)
      return
    }

    // 策略2：正常逐字渲染
    const char = bufferRef.current.shift()! // 取出第一个字符
    setDisplayText((prev) => prev + char)

    // 动态调整下次执行间隔
    const nextInterval = getTypingInterval(bufferRef.current.length)
    timerRef.current = setTimeout(typeNextChar, nextInterval)
  }

  // ========== 生产者：处理后端推送的数据 ==========
  /**
   * 处理后端推送的数据
   * 只提取 name 字段，添加逗号分隔
   */
  const handleBackendData = (data: any) => {
    // 跳过 status 消息
    if (data.status === 'completed') {
      return
    }

    // 只提取 name 字段
    if (data.name) {
      const text = data.name + ', ' // 用逗号和空格分隔
      addToBuffer(text)
    }
  }

  // ========== 生产者：将文本片段加入缓冲区 ==========
  /**
   * 将后端推送的文本片段拆分成单字符并加入缓冲区
   * 使用 Array.from 正确处理 emoji 等复杂字符
   */
  const addToBuffer = (chunk: string) => {
    const chars = Array.from(chunk) // 正确处理 emoji："👋你好" → ['👋', '你', '好']
    bufferRef.current.push(...chars)
    setBufferSize(bufferRef.current.length)
  }

  // ========== 控制函数：启动打字机 ==========
  const startTyping = () => {
    if (timerRef.current) return // 防止重复启动定时器

    setIsTyping(true)

    // 创建 SSE 连接
    const eventSource = new EventSource(
      'http://127.0.0.1:8000/api/v1/stream/items',
    )
    eventSourceRef.current = eventSource

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log(data)
      handleBackendData(data) // 使用新的处理函数
      if (data.status === 'completed') {
        eventSource.close()
        eventSourceRef.current = null
      }
    }

    eventSource.onerror = (error) => {
      console.error('SSE error:', error)
      eventSource.close()
      eventSourceRef.current = null
    }

    // 启动消费者定时器
    typeNextChar()
  }

  // ========== 控制函数：停止打字机 ==========
  const stopTyping = () => {
    // 停止定时器
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    // 关闭 SSE 连接
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }

    setIsTyping(false)
  }

  // ========== 控制函数：跳过动画（一次性渲染完）==========
  const skipTyping = () => {
    // 停止定时器
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    // 将缓冲区剩余内容一次性渲染
    const remaining = bufferRef.current.join('')
    if (remaining) {
      setDisplayText((prev) => prev + remaining)
      bufferRef.current = []
      setBufferSize(0)
    }

    setIsTyping(false)
  }

  // ========== 控制函数：重置 ==========
  const reset = () => {
    stopTyping()
    setDisplayText('')
    bufferRef.current = []
    setBufferSize(0)
  }

  // ========== 副作用：自动滚动到底部 ==========
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight
    }
  }, [displayText]) // 每次文本更新时触发

  // ========== 副作用：组件卸载时清理资源（防止内存泄漏）==========
  useEffect(() => {
    return () => {
      // 清理定时器
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      // 关闭 SSE 连接
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      {/* 控制面板 */}
      <Card title="聊天场景打字机效果" style={{ marginBottom: '20px' }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          {/* 状态指示器 */}
          <Space>
            <Tag color={isTyping ? 'green' : 'default'}>
              {isTyping ? '正在打字' : '已停止'}
            </Tag>
            <Tag
              color={
                bufferSize > 50 ? 'red' : bufferSize > 20 ? 'orange' : 'blue'
              }
            >
              缓冲区: {bufferSize} 字符
            </Tag>
            <Tag>当前速度: {getTypingInterval(bufferSize)}ms</Tag>
          </Space>

          {/* 速度控制 */}
          <div>
            <label style={{ marginBottom: '8px', display: 'block' }}>
              基础打字速度：{baseSpeed}ms
            </label>
            <Slider
              min={20}
              max={200}
              value={baseSpeed}
              onChange={setBaseSpeed}
              disabled={isTyping}
            />
          </div>

          {/* 控制按钮 */}
          <Space>
            <Button type="primary" onClick={startTyping} disabled={isTyping}>
              开始打字
            </Button>
            <Button onClick={stopTyping} disabled={!isTyping}>
              暂停
            </Button>
            <Button onClick={skipTyping} disabled={!isTyping}>
              跳过动画
            </Button>
            <Button onClick={reset}>重置</Button>
          </Space>

          {/* 技术说明 */}
          <div style={{ fontSize: '12px', color: '#666' }}>
            <p>
              <strong>动态速度策略：</strong>
            </p>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>缓冲区 ≤ 20 字符：使用基础速度（{baseSpeed}ms）</li>
              <li>缓冲区 20-50 字符：加快到 20ms</li>
              <li>缓冲区 &gt; 50 字符：直接渲染完（跳过逐字）</li>
            </ul>
          </div>
        </Space>
      </Card>

      {/* 聊天消息展示区 */}
      <Card title="聊天消息">
        <div
          ref={contentRef}
          style={{
            minHeight: '300px',
            maxHeight: '400px',
            overflowY: 'auto',
            fontSize: '16px',
            lineHeight: '1.8',
            padding: '20px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            whiteSpace: 'pre-wrap', // 保留换行和空格
          }}
        >
          {displayText}
        </div>
      </Card>
    </div>
  )
}

export default ChatTypeWriter
