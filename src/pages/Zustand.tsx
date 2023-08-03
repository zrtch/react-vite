import { Button } from 'antd'
import React from 'react'
import useStore from '../store'

const Zustand: React.FC = () => {
  const bears = useStore((state) => state.bears)
  const increasePopulation = useStore((state) => state.increasePopulation)

  // 对象选取，当state.nuts或state.honey改变时，重新渲染组件。
  const { nuts, honey } = useStore((state) => ({
    nuts: state.nuts,
    honey: state.honey,
  }))
  // 数组选取，当state.nuts或state.honey改变时，重新渲染组件。
  const [val1, val2] = useStore((state) => [state.nuts, state.honey])

  return (
    <div className="w[87vw] h[87vh]">
      <h2>Zustand</h2>
      <p>
        {bears} <Button onClick={increasePopulation}>增加</Button>
      </p>
      <p>
        <span>对象：我是{nuts}</span>
        <span>我是{honey}-----</span>
        <span>数组：我是{val1}</span>
        <span>我是{val2}</span>
      </p>
    </div>
  )
}

export default Zustand
