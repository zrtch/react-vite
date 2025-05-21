import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { Button, Divider, Card, Typography, Space } from 'antd'

const { Title, Paragraph, Text } = Typography

const EffectCompare: React.FC = () => {
  const [count, setCount] = useState(0)
  const [layoutCount, setLayoutCount] = useState(0)
  const effectTimeRef = useRef<number | null>(null)
  const layoutEffectTimeRef = useRef<number | null>(null)
  const [effectTime, setEffectTime] = useState<number | null>(null)
  const [layoutEffectTime, setLayoutEffectTime] = useState<number | null>(null)

  // 使用 useEffect 示例
  useEffect(() => {
    console.log('useEffect 执行了')
    // 记录执行时间
    const startTime = performance.now()

    // 模拟耗时操作
    if (count % 2 === 0) {
      const element = document.getElementById('effect-block')
      if (element) {
        element.style.transform = `translateX(${count * 10}px)`
        element.style.transition = 'transform 0.5s ease'
      }
    }

    effectTimeRef.current = performance.now() - startTime
    setEffectTime(effectTimeRef.current)

    // 清除函数
    return () => {
      console.log('useEffect 清除函数执行了')
    }
  }, [count])

  // 使用 useLayoutEffect 示例
  useLayoutEffect(() => {
    console.log('useLayoutEffect 执行了')
    // 记录执行时间
    const startTime = performance.now()

    // 模拟相同的耗时操作
    if (layoutCount % 2 === 0) {
      const element = document.getElementById('layout-effect-block')
      if (element) {
        element.style.transform = `translateX(${layoutCount * 10}px)`
        element.style.transition = 'transform 0.5s ease'
      }
    }

    layoutEffectTimeRef.current = performance.now() - startTime
    setLayoutEffectTime(layoutEffectTimeRef.current)

    // 清除函数
    return () => {
      console.log('useLayoutEffect 清除函数执行了')
    }
  }, [layoutCount])

  return (
    <div className="w[87vw] h[87vh] overflow-auto">
      <Title level={2}>useEffect 与 useLayoutEffect 对比</Title>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="执行时机对比">
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <Title level={4}>useEffect</Title>
              <div
                id="effect-block"
                style={{
                  width: '100px',
                  height: '100px',
                  backgroundColor: '#1890ff',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white',
                }}
              >
                {count}
              </div>
              <Paragraph>
                执行时间:{' '}
                {effectTime !== null ? `${effectTime.toFixed(2)}ms` : '未执行'}
              </Paragraph>
              <Button type="primary" onClick={() => setCount(count + 1)}>
                更新 useEffect ({count})
              </Button>
            </div>

            <div style={{ flex: 1 }}>
              <Title level={4}>useLayoutEffect</Title>
              <div
                id="layout-effect-block"
                style={{
                  width: '100px',
                  height: '100px',
                  backgroundColor: '#52c41a',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white',
                }}
              >
                {layoutCount}
              </div>
              <Paragraph>
                执行时间:{' '}
                {layoutEffectTime !== null
                  ? `${layoutEffectTime.toFixed(2)}ms`
                  : '未执行'}
              </Paragraph>
              <Button
                type="primary"
                onClick={() => setLayoutCount(layoutCount + 1)}
              >
                更新 useLayoutEffect ({layoutCount})
              </Button>
            </div>
          </div>
        </Card>

        <Card title="知识点与区别">
          <Title level={4}>执行时机</Title>
          <Paragraph>
            <ul>
              <li>
                <Text strong>useEffect:</Text> 在浏览器完成布局和绘制
                <Text type="danger">之后</Text>异步执行，不会阻塞浏览器渲染。
              </li>
              <li>
                <Text strong>useLayoutEffect:</Text> 在浏览器执行绘制
                <Text type="danger">之前</Text>同步执行，会阻塞浏览器渲染。
              </li>
            </ul>
          </Paragraph>

          <Title level={4}>使用场景</Title>
          <Paragraph>
            <ul>
              <li>
                <Text strong>useEffect:</Text>{' '}
                适用于大多数副作用，特别是不影响DOM布局的操作，如数据获取、事件订阅等。
              </li>
              <li>
                <Text strong>useLayoutEffect:</Text>{' '}
                适用于需要在用户看到更新前进行DOM测量或修改DOM的场景，可以防止闪烁。
              </li>
            </ul>
          </Paragraph>

          <Title level={4}>性能影响</Title>
          <Paragraph>
            <ul>
              <li>
                <Text strong>useEffect:</Text> 不会阻塞渲染，对性能影响较小。
              </li>
              <li>
                <Text strong>useLayoutEffect:</Text>{' '}
                会阻塞渲染，如果操作复杂可能导致页面响应变慢。
              </li>
            </ul>
          </Paragraph>

          <Title level={4}>服务器端渲染</Title>
          <Paragraph>
            <ul>
              <li>
                <Text strong>useEffect:</Text> 在服务器端渲染中不会引发问题。
              </li>
              <li>
                <Text strong>useLayoutEffect:</Text>{' '}
                在服务器端渲染中会产生警告，因为服务器上没有布局环境。
              </li>
            </ul>
          </Paragraph>

          <Title level={4}>清除时机</Title>
          <Paragraph>
            <ul>
              <li>
                <Text strong>useEffect:</Text> 清除函数在下一次渲染后异步执行。
              </li>
              <li>
                <Text strong>useLayoutEffect:</Text>{' '}
                清除函数在下一次渲染前同步执行。
              </li>
            </ul>
          </Paragraph>

          <Divider />

          <Paragraph>
            <Text strong>结论：</Text>{' '}
            除非你需要在DOM更新后、浏览器绘制前进行操作（如测量DOM或防止闪烁），否则应该优先使用
            useEffect 以获得更好的性能。
          </Paragraph>
        </Card>
      </Space>
    </div>
  )
}

export default EffectCompare
