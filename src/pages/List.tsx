import { Column, Table } from 'react-virtualized'

// 自定义表头渲染器
const headerRenderer = ({ label }: { label: string }) => (
  <div className="header-cell">{label}</div>
)

const List = () => {
  // 生成模拟数据
  const list = new Array(10000).fill(null).map((_, index) => ({
    name: `项目 ${index + 1}`,
    description: ` ${index + 1} 的描述`,
  }))

  return (
    <Table
      width={1000}
      height={300}
      headerHeight={20}
      rowHeight={30}
      rowCount={list.length}
      rowGetter={({ index }) => list[index]}
    >
      <Column
        headerRenderer={headerRenderer}
        dataKey="name"
        label="名称"
        width={500} // 直接设置固定宽度
      />

      <Column
        headerRenderer={headerRenderer}
        dataKey="description"
        label="描述"
        width={500} // 直接设置固定宽度
      />
    </Table>
  )
}

export default List
