import React from 'react'

// 当函数作为 props 传递给子组件（尤其是用 React.memo 包裹的组件）时，避免因函数引用变化导致子组件不必要的重新渲染。
interface CallbackProps {
  onIncrement: () => void
}

const Callback = React.memo<CallbackProps>(({ onIncrement }) => {
  console.log('Child 渲染')
  return <button onClick={onIncrement}>点击</button>
})

export default Callback
