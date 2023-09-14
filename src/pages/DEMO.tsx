import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react'
import { Input } from 'antd'

interface RefProps {
  aaa: () => void
  getb: () => void
}

const Guang: React.ForwardRefRenderFunction<RefProps> = (props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useImperativeHandle(ref, () => {
    return {
      aaa() {
        inputRef.current?.focus()
      },
      getb() {
        console.log('this b')
      },
    }
  })

  return (
    <div>
      <Input ref={inputRef} />
    </div>
  )
}

const WrapedGuang = forwardRef(Guang)

function Demo() {
  const ref = useRef<RefProps>(null)

  useEffect(() => {
    console.log('ref', ref.current)
    ref.current?.aaa()
    ref.current?.getb()
  }, [])

  return (
    <div className="w[87vw] h[87vh]">
      <WrapedGuang ref={ref} />
    </div>
  )
}

export default Demo
