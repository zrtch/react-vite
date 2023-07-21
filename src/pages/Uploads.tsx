import { Upload, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import useBearStore from '../store'

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
  const bears = useBearStore((state) => state.bears)
  return (
    <div className="w[87vw] h[87vh]">
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>

      <h2>zustand</h2>
      <p>接收的值：{bears}</p>
    </div>
  )
}

export default Uploads
