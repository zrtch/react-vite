import { useState, useEffect, useRef } from 'react'
import { Button, Input } from 'antd'

function Hooks() {
  const [count, setCount] = useState(0)
  const [msg, setMsg] = useState('abc')

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

  useEffect(() => {
    console.log('effect回调2')
  })

  useEffect(() => {
    console.log('effect回调3')
  }, [count, msg])

  const inputRef = useRef()
  const handleClick = () => {
    const input = inputRef.current.input
    alert(input.value)
  }

  return (
    <div className="w[87vw] h[87vh]">
      <h2>useState---用来定义状态数据 </h2>
      <p>state.count: {count}</p>
      <Button onClick={() => setCount(count + 1)}>更新count</Button>

      <h2>useEffect---可以在一个组件中多次使用</h2>
      <p>state.msg: {msg}</p>
      <Button onClick={() => setMsg(msg + '+')}>更新msg</Button>

      <h2>useRef---用于得到组件中的某个DOM元素</h2>
      <Input type="text" style={{ width: 304 }} ref={inputRef} />
      <Button onClick={handleClick}>提示输入框的值</Button>
    </div>
  )
}

export default Hooks
