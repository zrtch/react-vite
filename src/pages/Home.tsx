import styles from './styles.less?inline'

function Home() {
  const isloading = false
  const courses = [
    { id: 1, name: 'React' },
    { id: 3, name: 'Vue' },
    { id: 5, name: '小程序' },
  ]

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
      <div className={styles.title}>我是行内样式</div>
    </div>
  )
}
export default Home
