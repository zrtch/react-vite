import useStore from '../store'
import { shallow } from 'zustand/shallow'
import { Button } from 'antd'

function State() {
  const bears = useStore((state) => state.bears)
  const handleAdd = useStore((state) => state.add)
  const handleDelete = useStore((state) => state.delete)
  const handleRemove = useStore((state) => state.remove)

  const [name, age] = useStore((state) => [state.name, state.age], shallow) // 数组选取

  const handleEdit = () => {
    useStore.setState({ age: age - 1 })
  }

  return (
    <div className="w[87vw] h[87vh]">
      <span className="mr-10px">{bears}</span>
      <Button onClick={handleAdd}>递增</Button>
      <Button onClick={handleDelete}>递减</Button>
      <Button onClick={handleRemove}>清空</Button>
      <h3>传递 shallow 构造一个内部要多个状态的对象</h3>
      <div>{name}</div>
      <div>
        {age}
        <Button onClick={handleEdit} className="ml-10px">
          年龄减1
        </Button>
      </div>
    </div>
  )
}

export default State
