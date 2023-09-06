import React, { useEffect, useState } from 'react'
import { Graph } from '@antv/x6'

const Visualization: React.FC = () => {
  // 初始，mounted生命周期时, container组件还没挂载。
  const [container, setcontainer] = useState<HTMLElement>(
    document.createElement('div'),
  )
  const data = {
    // 节点
    nodes: [
      {
        id: 'node1', // String，可选，节点的唯一标识
        x: 40, // Number，必选，节点位置的 x 值
        y: 40, // Number，必选，节点位置的 y 值
        width: 80, // Number，可选，节点大小的 width 值
        height: 40, // Number，可选，节点大小的 height 值
        label: 'hello', // String，节点标签
      },
      {
        id: 'node2', // String，节点的唯一标识
        x: 160, // Number，必选，节点位置的 x 值
        y: 180, // Number，必选，节点位置的 y 值
        width: 80, // Number，可选，节点大小的 width 值
        height: 40, // Number，可选，节点大小的 height 值
        label: 'world', // String，节点标签
      },
    ],
    // 边
    edges: [
      {
        source: 'node1', // String，必须，起始节点 id
        target: 'node2', // String，必须，目标节点 id
      },
    ],
  }
  // 获取container对象
  const refContainer = (container: HTMLDivElement) => {
    setcontainer(container)
  }
  //官方文档写的是componentDidMount，因为react取消了三个生命周期函数，所以使用useEffect
  useEffect(() => {
    const graph = new Graph({
      container: container,
      width: 800,
      height: 600,
    })
    graph.fromJSON(data)
  })

  return (
    <div>
      <div id="container" ref={refContainer}></div>
    </div>
  )
}

export default Visualization
