import React from 'react'

export default class ClassProps extends React.Component {
  render() {
    const { myName, age } = this.props
    return (
      <h2>
        类组件 - 个人信息: 姓名: {myName}, 年龄: {age}
      </h2>
    )
  }
}
