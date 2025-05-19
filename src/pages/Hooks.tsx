import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Button, Input, Form } from 'antd'
import Callback from './Callback'
import UseMemo from './UseMemo'

function Hooks() {
  const [count, setCount] = useState(0)
  const [msg, setMsg] = useState('abc')
  const [items, setItems] = useState([1, 2, 3, 4, 5])

  useEffect(() => {
    console.log('effect回调...')
    const timeoutId = setTimeout(() => {
      // setMsg(msg + '+')  // 在setInterval中看到的msg一直都是初始值 => 界面只会更新一次
      setMsg((msg) => msg + '+') // setMsg的回调中的msg是react从内部取出的最新值 => 界面会多次更新
    }, 1000)

    // effect回调返回的函数 相当于 willUnmount
    return () => {
      // 清除定时器
      clearTimeout(timeoutId)
    }
  }, []) // 注意这里要传入空数组

  // useEffect(() => {
  //   console.log('effect回调2')
  // })

  // useEffect(() => {
  //   console.log('effect回调3')
  // }, [count, msg])

  const inputRef = useRef()
  const handleClick = () => {
    const input = inputRef.current.input
    alert(input.value)
  }

  const [form] = Form.useForm()
  const onFinish = (values: any) => {
    console.log(values)
  }

  // 使用 useCallback 记忆函数，避免每次渲染创建新函数引用
  const increment = useCallback(() => {
    setCount((prev) => prev + 1)
  }, [])

  // 使用 useMemo 记忆计算结果，避免每次渲染重新计算
  const filteredItems = useMemo(() => {
    console.log('重新计算items')
    return items.filter((item) => item > 2)
  }, [items])

  return (
    <div className="w[87vw] h[87vh]">
      <h2>useState---用来定义状态数据 </h2>
      <p>state.count: {count}</p>
      <Button onClick={() => setCount(count + 1)}>更新count</Button>

      <h2>useEffect---可以在一个组件中多次使用</h2>
      <p>state.msg: {msg}</p>
      <Button onClick={() => setMsg(msg + '+')}>更新msg</Button>

      <h2>useRef---用于得到组件中的某个DOM元素</h2>
      <Input type="text" ref={inputRef} className="w[300px] m-r[16px]" />
      <Button onClick={handleClick}>提示输入框的值</Button>

      <h2>useCallback</h2>
      <Callback onIncrement={increment} />
      <p>state.count: {count}</p>

      <h2>useMemo</h2>
      <UseMemo data={filteredItems} />

      <h2>登录页面 - 非受控组件</h2>
      <Form layout="inline" form={form} onFinish={onFinish}>
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          登 陆
        </Button>
      </Form>
    </div>
  )
}

export default Hooks
