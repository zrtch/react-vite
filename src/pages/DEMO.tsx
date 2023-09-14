import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react'
import { Input } from 'antd'

interface RefProps {
  getA: () => void
  getB: () => void
}

const Guang: React.ForwardRefRenderFunction<RefProps> = (props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null)

  // 用 useImperativeHanlde 自定义了ref对象
  useImperativeHandle(ref, () => {
    return {
      getA() {
        inputRef.current?.focus()
      },
      getB() {
        console.log('this b')
      },
    }
  })

  return (
    <div className="w[100px]">
      <Input ref={inputRef} />
    </div>
  )
}

const WrapedGuang = forwardRef(Guang)

function Demo() {
  const ref = useRef<RefProps>(null)

  useEffect(() => {
    console.log('ref', ref.current)
    ref.current?.getA()
    ref.current?.getB()
  }, [])

  return (
    <div>
      <WrapedGuang ref={ref} />
    </div>
  )
}

export default Demo
