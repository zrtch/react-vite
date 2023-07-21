import useBearStore from '../store'

function State() {
  const bears = useBearStore((state) => state.bears)
  const increasePopulation = useBearStore((state) => state.increasePopulation)
  return (
    <div className="w[87vw] h[87vh]">
      <span>{bears}</span>
      <button onClick={increasePopulation}>点我</button>
    </div>
  )
}

export default State
