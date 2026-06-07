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

  const p1 = Promise.resolve(1)
  const p2 = Promise.reject('出错了')
  const p3 = new Promise((resolve) => setTimeout(resolve, 1000, 3))
  Promise.allSettled([p1, p2, p3])
    .then((results) => console.log(results))
    .catch((err) => console.error(err))

  return (
    <div className="w[87vw] h[87vh]">
      {/* <div className="w-full h-full flex justify-center items-center">
        <div className="w-50 h-50 bg-red"></div>
      </div> */}
      {/* <div className="w-full h-full grid place-items-center">
        <div className="w-50 h-50 bg-red"></div>
      </div> */}
      {/* <div className="w-full h-full relative">
        <div className="w-50 h-50 bg-red absolute inset-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      </div> */}
      {/* <div className="w-full h-full relative">
        <div className="w-50 h-50 bg-red absolute top-0 left-0 right-0 bottom-0 m-auto"></div>
      </div> */}

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
