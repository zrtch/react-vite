import { useRef } from 'react'

export default function Demo() {
  const usernameRef = useRef()
  const passwordRef = useRef()

  const onSubmit = (e) => {
    e.preventDefault()
    const params = {
      name: usernameRef?.current?.value,
      password: passwordRef?.current?.value,
    }
    console.log(params)
  }

  return (
    <div style={{ width: 800, height: 500 }}>
      <form onSubmit={onSubmit}>
        <label htmlFor="name">名字</label>
        <input type="text" ref={usernameRef} />
        <br />
        <label htmlFor="password">密码</label>
        <input type="text" ref={passwordRef} />
        <br />
        <button type="submit">提交</button>
      </form>
    </div>
  )
}
