import { Button } from 'antd'
import React from 'react'
import FunProps from '../components/props/FunProps'
import ClassProps from '../components/props/ClassProps'

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

        <FunProps name={myName} age={age} />

        <ClassProps {...this.state.person} />
      </div>
    )
  }
}

export default Props
