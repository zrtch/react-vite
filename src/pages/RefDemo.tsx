import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react'

// 子组件暴露的方法类型定义
export interface ChildRefMethods {
  focus: () => void
  reset: () => void
  getValue: () => string
}

// 子组件属性类型定义
interface ChildProps {
  label: string
  defaultValue?: string
}

// 使用 forwardRef 创建可以接收 ref 的子组件
const ChildInput = forwardRef<ChildRefMethods, ChildProps>((props, ref) => {
  const { label, defaultValue = '' } = props
  const [value, setValue] = useState(defaultValue)
  const inputRef = useRef<HTMLInputElement>(null)

  // 使用 useImperativeHandle 暴露指定的方法给父组件
  useImperativeHandle(ref, () => ({
    // 聚焦输入框
    focus: () => {
      inputRef.current?.focus()
    },
    // 重置输入框内容
    reset: () => {
      setValue('')
      inputRef.current?.focus()
    },
    // 获取当前输入值
    getValue: () => value,
  }))

  return (
    <div style={{ margin: '10px 0' }}>
      <label style={{ marginRight: '10px' }}>{label}</label>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{ padding: '5px' }}
      />
    </div>
  )
})

// 父组件
const RefDemo: React.FC = () => {
  // 创建 ref 引用子组件
  const childRef = useRef<ChildRefMethods>(null)
  const [message, setMessage] = useState('')

  // 演示在特定时机自动聚焦
  useEffect(() => {
    // 组件挂载后自动聚焦
    childRef.current?.focus()
  }, [])

  // 处理按钮点击事件
  const handleFocus = () => {
    childRef.current?.focus()
  }

  const handleReset = () => {
    childRef.current?.reset()
  }

  const handleGetValue = () => {
    const value = childRef.current?.getValue() || ''
    setMessage(`当前输入值: ${value}`)
  }

  return (
    <div style={{ padding: '20px', width: '1000px' }}>
      <h2>useRef 使用场景演示</h2>

      <ChildInput ref={childRef} label="输入内容:" defaultValue="默认文本" />

      <div style={{ marginTop: '20px' }}>
        <button onClick={handleFocus} style={{ marginRight: '10px' }}>
          聚焦输入框
        </button>
        <button onClick={handleReset} style={{ marginRight: '10px' }}>
          重置输入框
        </button>
        <button onClick={handleGetValue}>获取输入值</button>
      </div>

      {message && <p>{message}</p>}

      <div
        style={{
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#f5f5f5',
        }}
      >
        <h3>useRef 主要使用场景:</h3>
        <ol>
          <li>引用 DOM 元素 - 直接操作 DOM (如聚焦、测量尺寸等)</li>
          <li>保存组件实例 - 调用子组件暴露的方法</li>
          <li>保存变量 - 存储不需要触发重新渲染的值</li>
          <li>记忆先前的状态 - 在渲染间保持数据</li>
        </ol>
      </div>
    </div>
  )
}

export default RefDemo
