import React, { useState } from 'react'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons'
import { Layout, Menu, Button, theme } from 'antd'
import Home from './pages/Home'
import About from './pages/About'
import Props from './pages/Props'
import Hooks from './pages/Hooks'
import Uploads from './pages/Uploads'

const { Header, Sider, Content } = Layout

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const [activeMenuItem, setActiveMenuItem] = useState('5')
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
              key: '5',
              icon: <UploadOutlined />,
              label: 'Upload',
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
          {activeMenuItem === '5' && <Uploads />}
        </Content>
      </Layout>
    </Layout>
  )
}

export default App
