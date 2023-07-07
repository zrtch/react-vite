import React from 'react'
interface ClassPropsProp {
  myName: string
  age: number
}

export default class ClassProps extends React.Component<ClassPropsProp> {
  render() {
    const { myName, age } = this.props
    return (
      <h2>
        类组件 - : 姓名: {myName}, 年龄: {age}
      </h2>
    )
  }
}
