import { useState } from 'react'
import DeepMemoUserProfile from './DeepMemoUserProfile'

const App = () => {
  const [count, setCount] = useState(0)
  const [user] = useState({ id: 1, name: '张三', role: 'admin' })

  return (
    <div style={{ width: '500px' }}>
      <button onClick={() => setCount((c) => c + 1)}>计数器: {count}</button>
      {/* 自定义比较（避免重复渲染） */}
      <DeepMemoUserProfile user={user} lastLogin="2023-05-17T10:00:00Z" />
    </div>
  )
}

export default App
