import React, { useState } from 'react'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ThunderboltOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  ExperimentOutlined,
} from '@ant-design/icons'
import { Layout, Menu, Button, theme } from 'antd'
import Home from './pages/Home'
import About from './pages/About'
import Props from './pages/Props'
import Hooks from './pages/Hooks'
import Zustand from './pages/Zustand'
import Context from './pages/TestContext'
import State from './pages/State'
import Visualization from './pages/Visualization'
import Flow from './pages/Flow'
import Demo from './pages/DEMO'
import Code from './pages/Code'
import Memo from './pages/Memo'
import List from './pages/List'
import RefDemo from './pages/RefDemo'
import EffectCompare from './pages/EffectCompare'
import SSE from './pages/SSE'
import KafkaSync from './pages/KafkaSync'
import TypeWriter from './pages/TypeWriter'
import ChatTypeWriter from './pages/ChatTypeWriter'
import CanvasEditor from './pages/CanvasEditor'
import AIBatteryManagement from './pages/AIBatteryManagement'
import SewageTreatment from './pages/SewageTreatment'
import Gomoku from './pages/Gomoku'

const { Header, Sider, Content } = Layout

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [activeMenuItem, setActiveMenuItem] = useState('20')
  const handleMenuClick = (key: string) => {
    setActiveMenuItem(key)
  }

  const {
    token: { colorBgContainer },
  } = theme.useToken()

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[activeMenuItem]}
          onClick={({ key }) => handleMenuClick(key as string)}
          items={[
            {
              key: '1',
              icon: <UserOutlined />,
              label: 'React基础',
            },
            {
              key: '2',
              icon: <VideoCameraOutlined />,
              label: '类组件',
            },
            {
              key: '3',
              icon: <UploadOutlined />,
              label: 'Props传值',
            },
            {
              key: '4',
              icon: <UploadOutlined />,
              label: 'Hooks',
            },
            {
              key: '12',
              icon: <UploadOutlined />,
              label: 'Memo',
            },
            {
              key: '6',
              icon: <UploadOutlined />,
              label: 'Context',
            },
            {
              key: '7',
              icon: <UploadOutlined />,
              label: '状态管理',
            },
            {
              key: '5',
              icon: <UploadOutlined />,
              label: 'Zustand',
            },
            {
              key: '8',
              icon: <UploadOutlined />,
              label: '可视化',
            },
            {
              key: '9',
              icon: <UploadOutlined />,
              label: '可视化2',
            },
            {
              key: '10',
              icon: <UploadOutlined />,
              label: 'DEMO合集',
            },
            {
              key: '11',
              icon: <UploadOutlined />,
              label: '优秀代码',
            },
            {
              key: '13',
              icon: <UploadOutlined />,
              label: '虚拟列表',
            },
            {
              key: '14',
              icon: <UploadOutlined />,
              label: 'useRef示例',
            },
            {
              key: '15',
              icon: <UploadOutlined />,
              label: 'Effect对比',
            },
            {
              key: '16',
              icon: <UploadOutlined />,
              label: 'SSE',
            },
            {
              key: '17',
              icon: <UploadOutlined />,
              label: 'Kafka同步',
            },
            {
              key: '18',
              icon: <UploadOutlined />,
              label: '打字效果',
            },
            {
              key: '19',
              icon: <UploadOutlined />,
              label: '聊天打字机',
            },
            {
              key: '20',
              icon: <UploadOutlined />,
              label: '画布编辑器',
            },
            {
              key: '21',
              icon: <ThunderboltOutlined />,
              label: 'AI电池管理',
            },
            {
              key: '22',
              icon: <ExperimentOutlined />,
              label: '污水处理系统',
            },
            {
              key: '23',
              icon: <ExperimentOutlined />,
              label: '五子棋',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            padding: 24,
            minHeight: 865,
            width: 'auto',
            background: colorBgContainer,
          }}
        >
          {activeMenuItem === '1' && <Home />}
          {activeMenuItem === '2' && <About />}
          {activeMenuItem === '3' && <Props />}
          {activeMenuItem === '4' && <Hooks />}
          {activeMenuItem === '5' && <Zustand />}
          {activeMenuItem === '6' && <Context />}
          {activeMenuItem === '7' && <State />}
          {activeMenuItem === '8' && <Visualization />}
          {activeMenuItem === '9' && <Flow />}
          {activeMenuItem === '10' && <Demo />}
          {activeMenuItem === '11' && <Code />}
          {activeMenuItem === '12' && <Memo />}
          {activeMenuItem === '13' && <List />}
          {activeMenuItem === '14' && <RefDemo />}
          {activeMenuItem === '15' && <EffectCompare />}
          {activeMenuItem === '16' && <SSE />}
          {activeMenuItem === '17' && <KafkaSync />}
          {activeMenuItem === '18' && <TypeWriter />}
          {activeMenuItem === '19' && <ChatTypeWriter />}
          {activeMenuItem === '20' && <CanvasEditor />}
          {activeMenuItem === '21' && <AIBatteryManagement />}
          {activeMenuItem === '22' && <SewageTreatment />}
          {activeMenuItem === '23' && <Gomoku />}
        </Content>
      </Layout>
    </Layout>
  )
}

export default App
