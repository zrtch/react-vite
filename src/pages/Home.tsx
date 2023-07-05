import { Button } from 'antd'

function Home() {
  const isloading = false
  const courses = [
    { id: 1, name: 'React' },
    { id: 3, name: 'Vue' },
    { id: 5, name: '小程序' },
  ]
  function handleClick(event: any) {
    alert(event.target.innerHTML)
  }

  return (
    <div className="w[87vw] h[87vh]">
      <h4>条件判断</h4>
      <div>{isloading ? <h2>正在加载中2...</h2> : <div>加载完成啦2!</div>}</div>

      <h4>列表渲染</h4>
      <ul>
        {courses.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>

      <h4>样式处理</h4>
      <div className="color-red text-30px">我是行内样式</div>
      <div>我是行内样式</div>

      <h4>
        函数组件又叫做无状态组件(不产生实例)，类组件又叫做有状态组件(有实例)
      </h4>

      <h4>事件处理</h4>
      <Button onClick={handleClick}>我就是提示文本</Button>
    </div>
  )
}
export default Home
