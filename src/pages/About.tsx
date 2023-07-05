import React from 'react'
import { Button } from 'antd'

class About extends React.Component {
  constructor() {
    super()
    // 初始化state
    this.state = {
      count: 0,
    }
  }
  handle1() {
    console.log(this) // this是undefined
    this.setState({
      // 报错
      count: this.state.count + 1,
    })
  }
  handle2() {
    console.log(this)
    this.setState({
      count: this.state.count + 2,
    })
  }
  handle3() {
    console.log(this)
    this.setState({
      count: this.state.count + 3,
    })
  }
  /* 
  解决办法3 - 箭头函数
  原因: 改为箭头函数后, 变为了给组件对象添加属性, 且是在构造器中执行的, 用的就是构造函数中的this
  */
  handle4 = () => {
    console.log(this)
    this.setState({
      count: this.state.count + 4,
    })
  }
  render() {
    // 读取state数据
    const { count } = this.state

    return (
      <div className="w[87vw] h[87vh]">
        <h3> 点击的次数 {count}</h3>
        <Button onClick={this.handle1}>点击报错,this问题</Button>
        <Button onClick={() => this.handle2()}>1 - 包裹箭头函数</Button>
        <Button onClick={this.handle3.bind(this)}>2 - bind绑定this</Button>
        <Button onClick={this.handle4}>3 - 箭头函数</Button>
      </div>
    )
  }
}

export default About
