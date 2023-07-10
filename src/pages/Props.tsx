import { Button } from 'antd'
import React from 'react'
import FunProps from '../components/props/FunProps'
import ClassProps from '../components/props/ClassProps'
import PubSub from 'pubsub-js'
import Publish from '../components/props/Publish'
class Props extends React.Component {
  state = {
    person: {
      myName: 'tom',
      age: 12,
    },
  }
  list = [
    { key: '参数名1', value: '参数值1' },
    { key: '参数名2', value: '参数值2' },
  ]

  render() {
    const { myName, age } = this.state.person
    return (
      <div className="w[87vw] h[87vh]">
        <p>人员信息: {myName + ' : ' + age}</p>
        <Button
          onClick={() => {
            this.setState({
              person: { myName: myName + '-', age: age + 1 },
            })
          }}
        >
          更新人员信息
        </Button>

        <h2>1.props---外层组件逐级传递给内层组件</h2>
        <FunProps name={myName} age={age} />

        <ClassProps {...this.state.person} />

        <h2>2.context---与任意后代直接通信</h2>

        <h2>3.pubsub---兄弟/任意组件间直接通信</h2>
        <Publish />
        <Button
          onClick={() => {
            PubSub.publish('func1', '通过publish发送过来的!')
          }}
        >
          点击触发publish
        </Button>
      </div>
    )
  }
}

export default Props
