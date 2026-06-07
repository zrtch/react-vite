import React, { useState, useEffect } from 'react'
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Progress,
  Space,
  Badge,
} from 'antd'
import {
  DashboardOutlined,
  ApiOutlined,
  SyncOutlined,
  AlertOutlined,
  ThunderboltOutlined,
  ExperimentOutlined,
  StepBackwardOutlined,
  AreaChartOutlined,
  FunnelPlotOutlined,
} from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import './SewageTreatment.css'

// 模拟设备数据类型
interface Device {
  id: string
  name: string
  status: 'running' | 'warning' | 'stopped'
  type: string
  power: number
  flow: number | null
  pressure: number | null
}

// 模拟水质数据类型
interface WaterQuality {
  time: string
  ph: number
  cod: number // 化学需氧量 mg/L
  nh3n: number // 氨氮 mg/L
  ss: number // 悬浮物 mg/L
  do: number // 溶解氧 mg/L
}

const SewageTreatment: React.FC = () => {
  // 实时数据状态
  const [currentTime, setCurrentTime] = useState<string>(
    new Date().toLocaleTimeString(),
  )
  const [totalInflow, setTotalInflow] = useState<number>(12540)
  const [totalOutflow, setTotalOutflow] = useState<number>(11890)
  const [energyConsumption, setEnergyConsumption] = useState<number>(3420)

  // 水质趋势数据
  const [waterQualityData, setWaterQualityData] = useState<WaterQuality[]>([])

  // 设备状态数据
  const [devices, setDevices] = useState<Device[]>([
    {
      id: 'PUMP-01',
      name: '1#进水提升泵',
      status: 'running',
      type: 'pump',
      power: 45,
      flow: 1200,
      pressure: 0.2,
    },
    {
      id: 'PUMP-02',
      name: '2#进水提升泵',
      status: 'warning',
      type: 'pump',
      power: 42,
      flow: 950,
      pressure: 0.18,
    },
    {
      id: 'PUMP-03',
      name: '3#进水提升泵',
      status: 'stopped',
      type: 'pump',
      power: 0,
      flow: 0,
      pressure: 0,
    },
    {
      id: 'BLOWER-01',
      name: '1#曝气鼓风机',
      status: 'running',
      type: 'blower',
      power: 75,
      flow: 2500,
      pressure: 0.6,
    },
    {
      id: 'BLOWER-02',
      name: '2#曝气鼓风机',
      status: 'running',
      type: 'blower',
      power: 78,
      flow: 2600,
      pressure: 0.62,
    },
    {
      id: 'MIXER-01',
      name: '缺氧池搅拌机',
      status: 'running',
      type: 'mixer',
      power: 15,
      flow: null,
      pressure: null,
    },
    {
      id: 'SCRAPER-01',
      name: '二沉池刮泥机',
      status: 'running',
      type: 'scraper',
      power: 5.5,
      flow: null,
      pressure: null,
    },
    {
      id: 'DOSING-01',
      name: 'PAC加药泵',
      status: 'running',
      type: 'dosing',
      power: 2.2,
      flow: 15,
      pressure: 0.3,
    },
  ])

  // 生成初始趋势数据
  useEffect(() => {
    const generateInitialData = () => {
      const data: WaterQuality[] = []
      const now = new Date()
      for (let i = 24; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000)
        data.push({
          time: `${time.getHours()}:00`,
          ph: 7.2 + Math.random() * 0.6 - 0.3,
          cod: 250 + Math.random() * 50 - 25,
          nh3n: 25 + Math.random() * 10 - 5,
          ss: 150 + Math.random() * 40 - 20,
          do: 2.5 + Math.random() * 1.5 - 0.5,
        })
      }
      setWaterQualityData(data)
    }

    generateInitialData()
  }, [])

  // 模拟实时数据刷新
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())

      // 随机波动总数据
      setTotalInflow((prev) => prev + Math.floor(Math.random() * 10) - 4)
      setTotalOutflow((prev) => prev + Math.floor(Math.random() * 9) - 4)
      setEnergyConsumption((prev) => prev + Math.random() * 5 - 2)

      // 随机更新设备运行数据
      setDevices((prev) =>
        prev.map((device) => {
          if (device.status === 'running') {
            return {
              ...device,
              power: device.power + (Math.random() * 2 - 1),
              flow:
                device.flow !== null
                  ? device.flow + (Math.random() * 20 - 10)
                  : null,
              pressure:
                device.pressure !== null
                  ? +(device.pressure + (Math.random() * 0.02 - 0.01)).toFixed(
                      2,
                    )
                  : null,
            }
          }
          return device
        }),
      )
    }, 3000)

    return () => clearInterval(timer)
  }, [])

  // 水质趋势图表配置
  const getQualityChartOption = () => {
    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: '#e8e8e8',
        padding: 12,
        textStyle: { color: '#333' },
        axisPointer: { type: 'line', lineStyle: { color: '#1890ff', type: 'dashed' } },
      },
      legend: {
        data: ['进水COD', '出水COD', '进水氨氮', '出水氨氮'],
        top: 0,
        icon: 'circle',
        itemWidth: 10,
        itemHeight: 10,
      },
      grid: { left: '3%', right: '4%', bottom: '3%', top: 40, containLabel: true },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: waterQualityData.map((item) => item.time),
          axisLine: { lineStyle: { color: '#d9d9d9' } },
          axisLabel: { color: '#8c8c8c' },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: 'COD (mg/L)',
          nameTextStyle: { color: '#8c8c8c', padding: [0, 0, 0, 20] },
          position: 'left',
          alignTicks: true,
          splitLine: { lineStyle: { type: 'dashed', color: '#f0f0f0' } },
          axisLabel: { color: '#5470C6', fontWeight: 'bold' },
        },
        {
          type: 'value',
          name: '氨氮 (mg/L)',
          nameTextStyle: { color: '#8c8c8c', padding: [0, 20, 0, 0] },
          position: 'right',
          alignTicks: true,
          splitLine: { show: false },
          axisLabel: { color: '#91CC75', fontWeight: 'bold' },
        },
      ],
      series: [
        {
          name: '进水COD',
          type: 'line',
          smooth: true,
          symbolSize: 0,
          data: waterQualityData.map((item) => item.cod.toFixed(1)),
          itemStyle: { color: '#5470C6' },
          lineStyle: { width: 3, shadowColor: 'rgba(84,112,198,0.3)', shadowBlur: 10, shadowOffsetY: 5 },
          areaStyle: {
            color: {
              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [{ offset: 0, color: 'rgba(84,112,198,0.4)' }, { offset: 1, color: 'rgba(84,112,198,0.05)' }],
            },
          },
        },
        {
          name: '出水COD',
          type: 'line',
          smooth: true,
          symbolSize: 0,
          data: waterQualityData.map((item) => (item.cod * 0.15).toFixed(1)),
          itemStyle: { color: '#73c0de' },
          lineStyle: { width: 3, shadowColor: 'rgba(115,192,222,0.3)', shadowBlur: 10, shadowOffsetY: 5 },
          areaStyle: {
            color: {
              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [{ offset: 0, color: 'rgba(115,192,222,0.4)' }, { offset: 1, color: 'rgba(115,192,222,0.05)' }],
            },
          },
        },
        {
          name: '进水氨氮',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          symbolSize: 0,
          data: waterQualityData.map((item) => item.nh3n.toFixed(1)),
          itemStyle: { color: '#91CC75' },
          lineStyle: { width: 3, shadowColor: 'rgba(145,204,117,0.3)', shadowBlur: 10, shadowOffsetY: 5 },
        },
        {
          name: '出水氨氮',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          symbolSize: 0,
          data: waterQualityData.map((item) => (item.nh3n * 0.1).toFixed(1)),
          itemStyle: { color: '#fac858' },
          lineStyle: { width: 3, shadowColor: 'rgba(250,200,88,0.3)', shadowBlur: 10, shadowOffsetY: 5 },
        },
      ],
    }
  }

  // 能耗分析图表配置
  const getEnergyChartOption = () => {
    return {
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: '#e8e8e8',
        textStyle: { color: '#333' },
        formatter: '{a} <br/>{b}: {c} kWh ({d}%)',
      },
      legend: {
        orient: 'vertical',
        right: '5%',
        top: 'center',
        icon: 'circle',
        itemWidth: 10,
        itemHeight: 10,
        textStyle: { color: '#595959' },
      },
      series: [
        {
          name: '能耗分布',
          type: 'pie',
          radius: ['45%', '75%'],
          center: ['35%', '50%'],
          roseType: 'radius',
          itemStyle: {
            borderRadius: 6,
            borderColor: '#fff',
            borderWidth: 2,
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            shadowBlur: 10,
          },
          label: { show: false },
          emphasis: {
            label: { show: true, fontSize: 16, fontWeight: 'bold', color: '#333' },
            itemStyle: {
              shadowBlur: 15,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.2)',
            },
          },
          data: [
            { value: 2335, name: '生化池曝气', itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{offset: 0, color: '#91CC75'}, {offset: 1, color: '#73a35c'}] } } },
            { value: 1048, name: '提升泵房', itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{offset: 0, color: '#5470C6'}, {offset: 1, color: '#3d5291'}] } } },
            { value: 580, name: '污泥脱水', itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{offset: 0, color: '#fac858'}, {offset: 1, color: '#c9a047'}] } } },
            { value: 484, name: '加药间', itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{offset: 0, color: '#ee6666'}, {offset: 1, color: '#ba5050'}] } } },
            { value: 300, name: '厂区照明', itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{offset: 0, color: '#73c0de'}, {offset: 1, color: '#5895ad'}] } } },
          ].sort((a, b) => b.value - a.value),
        },
      ],
    }
  }

  // 运行工艺图配置 (使用关系图模拟工艺流程)
  const getProcessChartOption = () => {
    const waterColor = {
      type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
      colorStops: [{ offset: 0, color: '#36cfc9' }, { offset: 1, color: '#08979c' }]
    }
    const poolColor = {
      type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
      colorStops: [{ offset: 0, color: '#40a9ff' }, { offset: 1, color: '#096dd9' }]
    }
    const sludgeColor = {
      type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
      colorStops: [{ offset: 0, color: '#ff7a45' }, { offset: 1, color: '#d4380d' }]
    }
    const outlineColor = {
      type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
      colorStops: [{ offset: 0, color: '#bae7ff' }, { offset: 1, color: '#69c0ff' }]
    }

    return {
      tooltip: { formatter: '{b}' },
      animationDurationUpdate: 1500,
      animationEasingUpdate: 'quinticInOut',
      series: [
        {
          type: 'graph',
          layout: 'none',
          symbol: 'roundRect',
          symbolSize: [65, 35],
          roam: true,
          label: {
            show: true,
            position: 'inside',
            formatter: '{b}',
            fontSize: 12,
            color: '#fff',
            fontWeight: 'bold',
          },
          edgeSymbol: ['none', 'arrow'],
          edgeSymbolSize: [0, 10],
          edgeLabel: {
            fontSize: 11,
            color: '#8c8c8c',
            backgroundColor: '#fff',
            padding: [2, 4],
            borderRadius: 4
          },
          itemStyle: {
            borderRadius: 4,
            borderColor: '#fff',
            borderWidth: 1.5,
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            shadowBlur: 8,
            shadowOffsetY: 3,
          },
          data: [
            { name: '粗格栅', x: 50, y: 150, itemStyle: { color: waterColor } },
            { name: '提升泵', x: 150, y: 150, itemStyle: { color: waterColor } },
            { name: '细格栅', x: 250, y: 150, itemStyle: { color: waterColor } },
            { name: '沉砂池', x: 350, y: 150, itemStyle: { color: waterColor } },
            { name: '厌氧池', x: 450, y: 150, itemStyle: { color: poolColor } },
            { name: '缺氧池', x: 550, y: 150, itemStyle: { color: poolColor } },
            { name: '好氧池', x: 650, y: 150, itemStyle: { color: poolColor } },
            { name: '二沉池', x: 750, y: 150, itemStyle: { color: poolColor } },
            { name: '消毒池', x: 850, y: 150, itemStyle: { color: waterColor } },
            { name: '出水', x: 950, y: 150, itemStyle: { color: outlineColor } },
            { name: '污泥浓缩', x: 750, y: 250, itemStyle: { color: sludgeColor } },
            { name: '脱水机房', x: 850, y: 250, itemStyle: { color: sludgeColor } },
            { name: '泥饼外运', x: 950, y: 250, itemStyle: { color: sludgeColor } },
          ],
          links: [
            { source: '粗格栅', target: '提升泵' },
            { source: '提升泵', target: '细格栅' },
            { source: '细格栅', target: '沉砂池' },
            { source: '沉砂池', target: '厌氧池' },
            { source: '厌氧池', target: '缺氧池' },
            { source: '缺氧池', target: '好氧池' },
            { source: '好氧池', target: '二沉池' },
            { source: '二沉池', target: '消毒池' },
            { source: '消毒池', target: '出水' },
            {
              source: '二沉池',
              target: '污泥浓缩',
              lineStyle: { curveness: 0.1, color: '#ff9c6e', type: 'dashed' },
              label: { show: true, formatter: '排泥' },
            },
            {
              source: '二沉池',
              target: '缺氧池',
              lineStyle: { curveness: -0.4, color: '#95de64', type: 'dashed' },
              label: { show: true, formatter: '污泥回流' },
            },
            {
              source: '好氧池',
              target: '缺氧池',
              lineStyle: { curveness: -0.6, color: '#95de64', type: 'dashed' },
              label: { show: true, formatter: '硝化液回流' },
            },
            { source: '污泥浓缩', target: '脱水机房', lineStyle: { color: '#ff9c6e' } },
            { source: '脱水机房', target: '泥饼外运', lineStyle: { color: '#ff9c6e' } },
          ],
          lineStyle: {
            opacity: 0.8,
            width: 3,
            curveness: 0,
            color: '#69c0ff',
            join: 'round'
          },
        },
      ],
    }
  }

  const columns = [
    {
      title: '监测点位',
      dataIndex: 'point',
      key: 'point',
    },
    {
      title: 'pH',
      dataIndex: 'ph',
      key: 'ph',
      render: (val: number) => {
        let color = 'green'
        if (val < 6 || val > 9) color = 'red'
        return <Tag color={color}>{val.toFixed(2)}</Tag>
      },
    },
    {
      title: 'COD (mg/L)',
      dataIndex: 'cod',
      key: 'cod',
      render: (val: number) => {
        let color = 'green'
        if (val > 50) color = 'red'
        else if (val > 40) color = 'orange'
        return (
          <span
            style={{
              color: color !== 'green' ? color : 'inherit',
              fontWeight: color !== 'green' ? 'bold' : 'normal',
            }}
          >
            {val.toFixed(1)}
          </span>
        )
      },
    },
    {
      title: '氨氮 (mg/L)',
      dataIndex: 'nh3n',
      key: 'nh3n',
    },
    {
      title: '总磷 (mg/L)',
      dataIndex: 'tp',
      key: 'tp',
    },
    {
      title: '悬浮物 (mg/L)',
      dataIndex: 'ss',
      key: 'ss',
    },
    {
      title: '更新时间',
      dataIndex: 'time',
      key: 'time',
    },
  ]

  const tableData = [
    {
      key: '1',
      point: '进水口',
      ph: 7.24,
      cod: 256.4,
      nh3n: 28.5,
      tp: 4.2,
      ss: 168,
      time: currentTime,
    },
    {
      key: '2',
      point: '厌氧池出水',
      ph: 7.02,
      cod: 185.2,
      nh3n: 29.1,
      tp: 5.8,
      ss: 145,
      time: currentTime,
    },
    {
      key: '3',
      point: '缺氧池出水',
      ph: 7.15,
      cod: 120.5,
      nh3n: 15.2,
      tp: 4.5,
      ss: 1890,
      time: currentTime,
    },
    {
      key: '4',
      point: '好氧池出水',
      ph: 7.35,
      cod: 45.8,
      nh3n: 1.2,
      tp: 3.8,
      ss: 2250,
      time: currentTime,
    },
    {
      key: '5',
      point: '总排口(国标排放)',
      ph: 7.42,
      cod: 18.5,
      nh3n: 0.8,
      tp: 0.35,
      ss: 8,
      time: currentTime,
    },
  ]

  // 渲染设备图标
  const renderDeviceIcon = (status: string, type: string) => {
    let iconClass = 'device-icon-wrapper '
    if (status === 'running') iconClass += 'device-icon-running'
    else if (status === 'warning') iconClass += 'device-icon-warning'
    else iconClass += 'device-icon-stopped'

    let Icon = ApiOutlined
    if (type === 'pump') Icon = SyncOutlined
    else if (type === 'blower') Icon = DashboardOutlined
    else if (type === 'mixer') Icon = SyncOutlined
    else if (type === 'scraper') Icon = RetweetOutlined

    return (
      <div className={iconClass}>
        <Icon spin={status === 'running' && type !== 'pump'} />
      </div>
    )
  }

  // 为没有RetweetOutlined提供一个替代方案，因为可能没有导入
  const RetweetOutlined = SyncOutlined

  return (
    <div className="sewage-dashboard">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <h2 style={{ margin: 0 }}>智慧水务 - 污水处理监控中心</h2>
        <Tag color="blue" icon={<SyncOutlined spin />}>
          系统运行正常
        </Tag>
      </div>

      <Row gutter={[16, 16]}>
        {/* 顶部统计卡片 */}
        <Col span={6}>
          <Card className="stat-card" bordered={false}>
            <Statistic
              title="当前进水总量 (m³)"
              value={totalInflow}
              precision={0}
              prefix={<FunnelPlotOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: 8 }}>
              <Progress percent={75} showInfo={false} strokeColor="#1890ff" />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 12,
                  color: '#8c8c8c',
                  marginTop: 4,
                }}
              >
                <span>设计处理能力: 15,000 m³/d</span>
                <span>负载率: 75%</span>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="stat-card" bordered={false}>
            <Statistic
              title="当前出水总量 (m³)"
              value={totalOutflow}
              precision={0}
              prefix={<StepBackwardOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ marginTop: 8 }}>
              <Progress percent={95} showInfo={false} strokeColor="#52c41a" />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 12,
                  color: '#8c8c8c',
                  marginTop: 4,
                }}
              >
                <span>
                  产水率: {((totalOutflow / totalInflow) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="stat-card" bordered={false}>
            <Statistic
              title="今日累计能耗 (kWh)"
              value={energyConsumption}
              precision={1}
              prefix={<ThunderboltOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
            <div style={{ marginTop: 8 }}>
              <Progress percent={45} showInfo={false} strokeColor="#faad14" />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 12,
                  color: '#8c8c8c',
                  marginTop: 4,
                }}
              >
                <span>
                  吨水能耗: {(energyConsumption / totalInflow).toFixed(3)}{' '}
                  kWh/m³
                </span>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card className="stat-card" bordered={false}>
            <Statistic
              title="报警事件 (今日)"
              value={3}
              prefix={<AlertOutlined style={{ color: '#f5222d' }} />}
              valueStyle={{ color: '#f5222d' }}
            />
            <div style={{ marginTop: 8 }}>
              <Space>
                <Tag color="red">1 严重</Tag>
                <Tag color="orange">2 警告</Tag>
              </Space>
              <div
                style={{
                  fontSize: 12,
                  color: '#8c8c8c',
                  marginTop: 4,
                  textAlign: 'right',
                }}
              >
                最近更新: {currentTime}
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 左侧工艺图与图表 */}
        <Col span={18}>
          <Card
            title={
              <>
                <ExperimentOutlined /> 污水处理工艺全流程组态图
              </>
            }
            className="chart-card"
            bordered={false}
            extra={<Badge status="processing" text="实时同步中" />}
          >
            <ReactECharts
              option={getProcessChartOption()}
              style={{ height: '300px' }}
            />
          </Card>

          <Row gutter={16}>
            <Col span={16}>
              <Card
                title={
                  <>
                    <AreaChartOutlined /> 进出水水质趋势分析 (24h)
                  </>
                }
                className="chart-card"
                bordered={false}
              >
                <ReactECharts
                  option={getQualityChartOption()}
                  style={{ height: '320px' }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card
                title={
                  <>
                    <ThunderboltOutlined /> 能耗分布分析
                  </>
                }
                className="chart-card"
                bordered={false}
              >
                <ReactECharts
                  option={getEnergyChartOption()}
                  style={{ height: '320px' }}
                />
              </Card>
            </Col>
          </Row>

          <Card
            title={
              <>
                <ExperimentOutlined /> 各工艺段实时在线监测数据
              </>
            }
            className="chart-card"
            bordered={false}
            style={{ marginTop: 16 }}
          >
            <Table
              columns={columns}
              dataSource={tableData}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* 右侧设备列表 */}
        <Col span={6}>
          <Card
            title={
              <>
                <ApiOutlined /> 核心设备IoT状态
              </>
            }
            className="chart-card"
            bordered={false}
            bodyStyle={{
              padding: '12px 16px',
              height: '915px',
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                marginBottom: 16,
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span className="status-badge">
                <Badge status="success" /> 运行:{' '}
                {devices.filter((d) => d.status === 'running').length}
              </span>
              <span className="status-badge">
                <Badge status="warning" /> 警告:{' '}
                {devices.filter((d) => d.status === 'warning').length}
              </span>
              <span className="status-badge">
                <Badge status="error" /> 停止:{' '}
                {devices.filter((d) => d.status === 'stopped').length}
              </span>
            </div>

            {devices.map((device) => (
              <div key={device.id} className="device-item">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {renderDeviceIcon(device.status, device.type)}
                  <div className="device-info">
                    <span className="device-name">{device.name}</span>
                    <span className="device-param">
                      {device.status === 'running' ||
                      device.status === 'warning' ? (
                        <>
                          功率: {device.power.toFixed(1)} kW |
                          {device.flow !== null &&
                            ` 流量: ${device.flow.toFixed(0)} m³/h`}
                        </>
                      ) : (
                        '设备离线/停机'
                      )}
                    </span>
                  </div>
                </div>
                <div>
                  {device.status === 'running' && (
                    <Tag color="blue">运行中</Tag>
                  )}
                  {device.status === 'warning' && (
                    <Tag color="orange">电流偏高</Tag>
                  )}
                  {device.status === 'stopped' && (
                    <Tag color="default">已停止</Tag>
                  )}
                </div>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default SewageTreatment
