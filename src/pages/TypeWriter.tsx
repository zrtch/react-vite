import React, { useState, useEffect } from 'react'
import { Card, Button, Space, Input, Slider } from 'antd'

const TypeWriter: React.FC = () => {
  // 状态管理：当前显示的文本
  const [displayText, setDisplayText] = useState('')
  // 状态管理：是否正在打字
  const [isTyping, setIsTyping] = useState(false)
  // 状态管理：当前打字到第几个字符
  const [currentIndex, setCurrentIndex] = useState(0)
  // 状态管理：打字速度（毫秒）
  const [speed, setSpeed] = useState(100)
  // 状态管理：用户自定义的文本内容
  const [customText, setCustomText] = useState(
    '欢迎来到打字效果演示页面！这是一个模拟打字机效果的实现。你可以看到文字一个一个地出现，就像有人在实时打字一样。'
  )

  const fullText = customText

  // 核心逻辑：使用 useEffect 实现打字效果
  useEffect(() => {
    // 如果不在打字状态，直接返回
    if (!isTyping) return

    // 如果还没打完所有字符
    if (currentIndex < fullText.length) {
      // 使用 setTimeout 延迟添加下一个字符
      const timer = setTimeout(() => {
        // 将当前索引位置的字符追加到显示文本中
        setDisplayText((prev) => prev + fullText[currentIndex])
        // 索引加1，准备下一个字符
        setCurrentIndex((prev) => prev + 1)
      }, speed) // 延迟时间由 speed 控制

      // 清理函数：组件卸载或依赖变化时清除定时器，防止内存泄漏
      return () => clearTimeout(timer)
    } else {
      // 所有字符都打完了，停止打字状态
      setIsTyping(false)
    }
  }, [currentIndex, isTyping, fullText, speed]) // 依赖项：这些值变化时重新执行

  // 开始打字：重置状态并启动
  const handleStart = () => {
    setDisplayText('') // 清空显示文本
    setCurrentIndex(0) // 重置索引到开头
    setIsTyping(true) // 开启打字状态，触发 useEffect
  }

  // 暂停打字：停止 useEffect 中的定时器
  const handleStop = () => {
    setIsTyping(false)
  }

  // 重置：清空所有状态
  const handleReset = () => {
    setDisplayText('')
    setCurrentIndex(0)
    setIsTyping(false)
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* 控制面板卡片 */}
      <Card title="打字效果演示" style={{ marginBottom: '20px' }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          {/* 文本输入区 */}
          <div>
            <label style={{ marginBottom: '8px', display: 'block' }}>
              自定义文本：
            </label>
            <Input.TextArea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="输入要显示的文本"
              rows={3}
              disabled={isTyping} // 打字时禁止修改
            />
          </div>

          {/* 速度控制滑块 */}
          <div>
            <label style={{ marginBottom: '8px', display: 'block' }}>
              打字速度：{speed}ms
            </label>
            <Slider
              min={50}
              max={300}
              value={speed}
              onChange={setSpeed}
              disabled={isTyping} // 打字时禁止调整
            />
          </div>

          {/* 控制按钮组 */}
          <Space>
            <Button type="primary" onClick={handleStart} disabled={isTyping}>
              开始打字
            </Button>
            <Button onClick={handleStop} disabled={!isTyping}>
              暂停
            </Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
        </Space>
      </Card>

      {/* 打字效果展示区 */}
      <Card title="打字效果展示区">
        <div
          style={{
            minHeight: '200px',
            fontSize: '18px',
            lineHeight: '1.8',
            padding: '20px',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            position: 'relative',
          }}
        >
          {/* 显示已打出的文本 */}
          {displayText}
          {/* 光标效果：仅在打字时显示 */}
          {isTyping && (
            <span
              style={{
                display: 'inline-block',
                width: '2px',
                height: '20px',
                backgroundColor: '#1890ff',
                marginLeft: '2px',
                animation: 'blink 1s infinite', // CSS 动画实现闪烁
              }}
            />
          )}
        </div>
      </Card>

      {/* CSS 动画定义：光标闪烁效果 */}
      <style>{`
        @keyframes blink {
          0%, 50% {
            opacity: 1;  /* 前半秒显示 */
          }
          51%, 100% {
            opacity: 0;  /* 后半秒隐藏 */
          }
        }
      `}</style>
    </div>
  )
}

export default TypeWriter
