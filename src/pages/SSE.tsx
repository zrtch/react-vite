import { Input, Button, Space, message, Card, Typography, Empty } from 'antd'
import { useState, useRef, useCallback, useEffect } from 'react'
import { SendOutlined, StopOutlined, DeleteOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

/**
 * SSE (Server-Sent Events) Streaming Component
 * This component demonstrates how to handle streaming data from a fetch request.
 */
const SSE = () => {
  const [text, setText] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)

  // Use a ref to store the AbortController so we can cancel the request
  const abortControllerRef = useRef<AbortController | null>(null)
  // Ref for the output container to handle auto-scrolling
  const outputRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when text updates
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [text])

  /**
   * Stop the current streaming request
   */
  const stopStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setLoading(false)
      message.info('已停止生成')
    }
  }, [])

  /**
   * Main fetch function for streaming
   */
  const streamFetch = useCallback(async () => {
    const trimmedInput = inputValue.trim()
    if (!trimmedInput) {
      message.warning('请输入内容')
      return
    }

    // Reset state and cancel existing requests
    stopStream()
    setText('')
    setLoading(true)

    // Create a new AbortController for this request
    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      const response = await fetch(
        'https://10.2.31.10:21006/aipaas-cgw/ai-paas/stream/v2/knowledge/generate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer xxx',
            Cookie:
              'baas-authLink-Token=eyJKV1QiOiJKV1QiLCJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJiYWFzTG9naW5UaW1lIjoxNzY4OTE0NDU1OTM0LCJsb2dpblZlcnNpb24iOjEsInVzZXJJZCI6MjYwNTYzNjAyMTQ5NTA3ODkxMiwiaWF0IjoxNzY4OTE0NDU1LCJqdGkiOiI2MDBkNDBjN2YwNjk0NzczOTg5YTQzNTIyOTNmNzQ3MyIsInVzZXJBZ2VudE1kNSI6IjhlNTk1ODQ1NjQwZTUwN2EiLCJ0b2tlbiI6IjE4YTVlOGI5Mzg1ZWY1OTkxMWFhZjgwNTkzOTNjN2E3N2E2YmM3MjkxZmNhZjAyN2NiYmJjZTRjYmQ2Yjg1N2JiIn0.M3uQrM5AE5MIMdxAkAVhh6ACvFS-C5BcIfUjpVHzqtk; timeStamp=1768914455934; uid=2605636021495078912; token=18a5e8b9385ef59911aaf8059393c7a77a6bc7291fcaf027cbbbce4cbd6b857bb; admin_login=%7B%22uid%22%3A%222605636021495078912%22%2C%22ts%22%3A%221768914455934%22%7D; orgId=11336',
          },
          body: JSON.stringify({ prompt: trimmedInput }),
          signal: controller.signal,
        },
      )

      if (!response.ok) {
        throw new Error(`请求失败: ${response.status} ${response.statusText}`)
      }

      if (!response.body) {
        throw new Error('浏览器不支持 ReadableStream')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder('utf-8')

      // Read the stream
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })

        /**
         * Note: If your backend uses standard SSE format (data: ...),
         * you might need to parse the chunks here.
         * For example:
         * const lines = chunk.split('\n')
         * lines.forEach(line => { if(line.startsWith('data:')) ... })
         */
        setText((prev) => prev + chunk)
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('User aborted the request')
      } else {
        console.error('Streaming error:', error)
        message.error(error.message || '未知错误')
      }
    } finally {
      setLoading(false)
      abortControllerRef.current = null
    }
  }, [inputValue, stopStream])

  return (
    <div className="w[87vw] h[87vh]">
      <Title level={3} style={{ marginBottom: 24, textAlign: 'center' }}>
        AI 流式对话演示
      </Title>

      <Space.Compact style={{ width: '80%', marginBottom: 24 }}>
        <Input
          size="large"
          placeholder="请输入您的问题..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onPressEnter={streamFetch}
          disabled={loading}
          prefix={<SendOutlined style={{ color: '#bfbfbf' }} />}
        />
        {loading ? (
          <Button
            size="large"
            type="primary"
            danger
            icon={<StopOutlined />}
            onClick={stopStream}
          >
            停止
          </Button>
        ) : (
          <Button
            size="large"
            type="primary"
            onClick={streamFetch}
            disabled={!inputValue.trim()}
          >
            发送
          </Button>
        )}
      </Space.Compact>

      <Card
        title="回答结果"
        bordered={false}
        className="shadow-sm"
        extra={
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => setText('')}
            disabled={!text}
          >
            清空
          </Button>
        }
        styles={{ body: { padding: 0 } }}
      >
        <div
          ref={outputRef}
          style={{
            height: 400,
            overflowY: 'auto',
            padding: 20,
            backgroundColor: '#f9f9f9',
            borderRadius: '0 0 8px 8px',
            fontSize: 16,
            lineHeight: 1.8,
            color: '#333',
            whiteSpace: 'pre-wrap',
            scrollBehavior: 'smooth',
          }}
        >
          {text ? (
            text
          ) : (
            <div
              style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Empty description="暂无对话内容" />
            </div>
          )}
        </div>
      </Card>

      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <Text type="secondary" italic style={{ fontSize: 12 }}>
          基于 Server-Sent Events 实现数据实时流式交互
        </Text>
      </div>
    </div>
  )
}

export default SSE
