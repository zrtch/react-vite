import React from 'react'

interface UseMemoProps {
  data: number[]
}

const UseMemo = React.memo<UseMemoProps>(({ data }) => {
  console.log('UseMemo渲染')
  return <div>{data?.join(',')}</div>
})

export default UseMemo
