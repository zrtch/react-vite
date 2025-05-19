import { Column, Table } from 'react-virtualized'
import { faker } from '@faker-js/faker'

const TOTAL_WIDTH = 500

// 定义列宽比例
const widths = {
  name: 0.2,
  location: 0.3,
  description: 0.5,
}

// 自定义表头渲染器
const headerRenderer = ({ label }: { label: string }) => (
  <div className="header-cell">{label}</div>
)

const List = () => {
  // 生成模拟数据
  const list = new Array(10000).fill(null).map((_, index) => ({
    name: `项目 ${index + 1}`,
    // description: index + 1, // 更新为新的 API
    // location: index * 2, // 更新为新的 API
  }))

  return (
    <Table
      width={TOTAL_WIDTH}
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
        width={widths.name * TOTAL_WIDTH}
      />
      <Column
        headerRenderer={headerRenderer}
        dataKey="location"
        label="位置"
        width={widths.location * TOTAL_WIDTH}
      />
      <Column
        headerRenderer={headerRenderer}
        dataKey="description"
        label="描述"
        width={widths.description * TOTAL_WIDTH}
      />
    </Table>
  )
}

export default List
