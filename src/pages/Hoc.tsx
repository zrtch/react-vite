import { useContext } from 'react'
import TestContext from '../store/Context.js'

function Hoc() {
  const ctx = useContext(TestContext)
  return (
    <div className="w[87vw] h[87vh]">
      {ctx?.name} - {ctx.age}
    </div>
  )
}

export default Hoc
