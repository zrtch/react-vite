import { Upload, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { shallow } from 'zustand/shallow'

import useStore from '../store'

const props: UploadProps = {
  name: 'file',
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList)
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`)
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`)
    }
  },
}

function Uploads() {
  const bears = useStore((state) => state.bears)

  const [name, age] = useStore((state) => [state.name, state.age], shallow) // 数组选取
  const handleAdd = () => {
    useStore.setState({ age: age + 1 })
  }

  return (
    <div className="w[87vw] h[87vh]">
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>

      <h2>zustand</h2>
      <p>接收的值：{bears}</p>
      <p>
        接受的年龄：{age}
        <Button onClick={handleAdd} className="ml-10px">
          年龄加1
        </Button>
      </p>
      <p>接受的年龄：{name}</p>
    </div>
  )
}

export default Uploads
