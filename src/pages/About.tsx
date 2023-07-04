import React from 'react'
import { Button } from 'antd'

class About extends React.Component {
  state = {
    count: 0,
    xxx: 'abc',
  }
  render() {
    const { count } = this.state
    return (
      <div className="w[87vw] h[87vh]">
        <Button
          onClick={() => {
            this.setState({
              count: count + 1,
            })
          }}
        >
          点击按钮
        </Button>
        <span> 点击的次数{count}</span>
      </div>
    )
  }
}

export default About
