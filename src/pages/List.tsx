import { Column, Table } from 'react-virtualized'
import 'react-virtualized/styles.css' // 添加样式引入

// 自定义表头渲染器
const headerRenderer = ({ label }: { label: string }) => (
  <div className="header-cell" style={{ fontWeight: 'bold', padding: '5px' }}>
    {label}
  </div>
)

const List = () => {
  // 生成模拟数据
  const list = new Array(10000).fill(null).map((_, index) => ({
    name: `项目 ${index + 1}`,
    description: ` ${index + 1} 的描述`,
  }))

  return (
    <div>
      <Table
        width={1000}
        height={300}
        headerHeight={30} // 增加表头高度
        rowHeight={30}
        rowCount={list.length}
        rowGetter={({ index }) => list[index]}
      >
        <Column
          headerRenderer={headerRenderer}
          dataKey="name"
          label="名称"
          width={500}
        />

        <Column
          headerRenderer={headerRenderer}
          dataKey="description"
          label="描述"
          width={500}
        />
      </Table>
    </div>
  )
}

export default List
