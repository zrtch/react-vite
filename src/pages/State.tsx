import useBearStore from '../store'
import { Button } from 'antd'

function State() {
  const bears = useBearStore((state) => state.bears)
  const handleAdd = useBearStore((state) => state.add)
  const handleDelete = useBearStore((state) => state.delete)
  const handleRemove = useBearStore((state) => state.remove)
  return (
    <div className="w[87vw] h[87vh]">
      <span className="mr-10px">{bears}</span>
      <Button onClick={handleAdd}>递增</Button>
      <Button onClick={handleDelete}>递减</Button>
      <Button onClick={handleRemove}>清空</Button>
    </div>
  )
}

export default State
