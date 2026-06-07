import React, { useEffect, useMemo, useRef } from 'react'
import * as echarts from 'echarts'
import {
  AlertOutlined,
  ApiOutlined,
  DashboardOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import './AIBatteryManagement.css'

type EChartOption = echarts.EChartsCoreOption

const timeLabels = [
  '00:00',
  '01:00',
  '02:00',
  '03:00',
  '04:00',
  '05:00',
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00',
]

const socData = [
  81.4, 80.8, 79.6, 78.1, 77.3, 78.9, 82.6, 86.4, 89.8, 91.5, 88.6, 84.7, 79.2,
  73.4, 68.1, 65.9, 69.8, 75.6, 82.3, 87.1, 85.4, 83.8, 82.7, 81.6,
]

const sohData = [
  95.8, 95.8, 95.7, 95.7, 95.7, 95.6, 95.6, 95.6, 95.5, 95.5, 95.5, 95.4, 95.4,
  95.4, 95.3, 95.3, 95.3, 95.2, 95.2, 95.2, 95.1, 95.1, 95.1, 95.0,
]

const temperatureData = [
  28.3, 28.1, 27.8, 27.6, 27.4, 27.9, 29.8, 31.6, 33.4, 34.1, 35.8, 37.2, 39.6,
  41.2, 42.8, 41.7, 39.9, 37.5, 35.2, 33.4, 32.1, 30.8, 29.9, 29.1,
]

const voltageData = [
  731, 729, 728, 726, 725, 727, 734, 742, 748, 752, 746, 739, 731, 724, 718,
  716, 721, 729, 738, 744, 741, 737, 734, 732,
]

const devices = [
  {
    name: 'BMS-A17 储能柜',
    site: '上海临港 2# 站',
    status: '在线',
    soc: 82,
    soh: 96,
    temp: 32.6,
    load: 64,
  },
  {
    name: 'PACK-C04 换电仓',
    site: '杭州萧山机场',
    status: '均衡中',
    soc: 68,
    soh: 93,
    temp: 36.8,
    load: 72,
  },
  {
    name: 'BMS-F21 微网柜',
    site: '苏州工业园',
    status: '预警',
    soc: 47,
    soh: 88,
    temp: 43.1,
    load: 81,
  },
]

const alerts = [
  {
    level: '高',
    title: '单体压差持续偏高',
    time: '14:32:18',
    target: 'BMS-F21 / Module-06',
    value: '92mV',
  },
  {
    level: '中',
    title: '温升速率超过模型预测阈值',
    time: '14:18:05',
    target: 'PACK-C04 / Cell-128',
    value: '+2.4℃ / 10min',
  },
  {
    level: '低',
    title: 'SOC 校准建议',
    time: '13:54:41',
    target: 'BMS-A17 / Cluster-02',
    value: '偏差 1.8%',
  },
]

const insights = [
  '未来 6 小时峰值负载预计出现在 19:20，建议提前开启 2 组备用簇。',
  'F21 模组 06 内阻离散度扩大，模型判断 72 小时内需人工复核。',
  'A17 站点可用容量较昨日提升 3.1%，夜间补能策略有效。',
]

const useChart = (option: EChartOption) => {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartRef.current) {
      return undefined
    }

    const chart = echarts.init(chartRef.current)
    chart.setOption(option)

    const resize = () => chart.resize()
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      chart.dispose()
    }
  }, [option])

  return chartRef
}

const TrendChart = () => {
  const option = useMemo<EChartOption>(
    () => ({
      color: ['#29c6a3', '#4f8cff', '#ffb84d'],
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(8, 20, 34, 0.92)',
        borderColor: 'rgba(255, 255, 255, 0.12)',
        textStyle: { color: '#e9f4ff' },
      },
      legend: {
        top: 8,
        right: 8,
        textStyle: { color: '#7f93a8' },
        data: ['SOC', 'SOH', '温度'],
      },
      grid: { left: 42, right: 28, top: 54, bottom: 32 },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: timeLabels,
        axisLine: { lineStyle: { color: 'rgba(127, 147, 168, 0.28)' } },
        axisLabel: { color: '#7f93a8' },
      },
      yAxis: [
        {
          type: 'value',
          min: 40,
          max: 100,
          axisLabel: { color: '#7f93a8', formatter: '{value}%' },
          splitLine: { lineStyle: { color: 'rgba(127, 147, 168, 0.12)' } },
        },
        {
          type: 'value',
          min: 20,
          max: 50,
          axisLabel: { color: '#7f93a8', formatter: '{value}℃' },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: 'SOC',
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: { width: 3 },
          areaStyle: { opacity: 0.14 },
          data: socData,
        },
        {
          name: 'SOH',
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: { width: 3 },
          data: sohData,
        },
        {
          name: '温度',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          symbol: 'none',
          lineStyle: { width: 3 },
          data: temperatureData,
        },
      ],
    }),
    [],
  )
  const chartRef = useChart(option)

  return <div ref={chartRef} className="battery-chart" />
}

const VoltageChart = () => {
  const option = useMemo<EChartOption>(
    () => ({
      color: ['#5b8cff'],
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(8, 20, 34, 0.92)',
        borderColor: 'rgba(255, 255, 255, 0.12)',
        textStyle: { color: '#e9f4ff' },
      },
      grid: { left: 42, right: 18, top: 24, bottom: 28 },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: timeLabels,
        axisLabel: { color: '#7f93a8' },
        axisLine: { lineStyle: { color: 'rgba(127, 147, 168, 0.28)' } },
      },
      yAxis: {
        type: 'value',
        min: 700,
        max: 760,
        axisLabel: { color: '#7f93a8', formatter: '{value}V' },
        splitLine: { lineStyle: { color: 'rgba(127, 147, 168, 0.12)' } },
      },
      series: [
        {
          name: '总压',
          type: 'bar',
          barWidth: 10,
          itemStyle: {
            borderRadius: [5, 5, 0, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#74d6ff' },
              { offset: 1, color: '#3867ff' },
            ]),
          },
          data: voltageData,
        },
      ],
    }),
    [],
  )
  const chartRef = useChart(option)

  return <div ref={chartRef} className="battery-chart battery-chart-small" />
}

const RiskChart = () => {
  const option = useMemo<EChartOption>(
    () => ({
      color: ['#22c55e', '#f59e0b', '#ef4444'],
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(8, 20, 34, 0.92)',
        borderColor: 'rgba(255, 255, 255, 0.12)',
        textStyle: { color: '#e9f4ff' },
      },
      series: [
        {
          name: '风险分布',
          type: 'pie',
          radius: ['58%', '78%'],
          center: ['50%', '54%'],
          avoidLabelOverlap: true,
          label: { color: '#d5e4f2', formatter: '{b}\n{d}%' },
          labelLine: { lineStyle: { color: 'rgba(213, 228, 242, 0.42)' } },
          data: [
            { value: 1264, name: '健康' },
            { value: 96, name: '关注' },
            { value: 18, name: '风险' },
          ],
        },
      ],
    }),
    [],
  )
  const chartRef = useChart(option)

  return <div ref={chartRef} className="battery-chart battery-chart-small" />
}

const AIBatteryManagement: React.FC = () => {
  return (
    <div className="ai-battery-page">
      <section className="battery-topbar">
        <div>
          {/* <span className="battery-kicker">AI Battery Management Platform</span> */}
          <h1>电池管理平台</h1>
          <p>
            基于 BMS
            实时遥测、健康模型和异常检测，统一监控储能站、换电仓与动力电池包。
          </p>
        </div>
        <div className="battery-live">
          <span />
          实时数据流 1.8s
        </div>
      </section>

      <section className="battery-metrics">
        <div className="battery-metric-card">
          <DashboardOutlined />
          <span>在线设备</span>
          <strong>1,378</strong>
          <small>较昨日 +2.6%</small>
        </div>
        <div className="battery-metric-card">
          <ThunderboltOutlined />
          <span>可用容量</span>
          <strong>42.8MWh</strong>
          <small>预测偏差 1.4%</small>
        </div>
        <div className="battery-metric-card">
          <ApiOutlined />
          <span>平均 SOH</span>
          <strong>95.2%</strong>
          <small>健康簇 91.8%</small>
        </div>
        <div className="battery-metric-card battery-metric-card-warn">
          <AlertOutlined />
          <span>活跃告警</span>
          <strong>18</strong>
          <small>高危 3 条</small>
        </div>
      </section>

      <section className="battery-grid">
        <article className="battery-panel battery-panel-wide">
          <div className="battery-panel-head">
            <div>
              <h2>SOC / SOH / 温度趋势</h2>
              <p>24 小时真实工况模拟，包含充放电、温升和健康衰减曲线。</p>
            </div>
            <span>站点聚合</span>
          </div>
          <TrendChart />
        </article>

        <article className="battery-panel">
          <div className="battery-panel-head">
            <div>
              <h2>总压波动</h2>
              <p>母线电压稳定性监测。</p>
            </div>
          </div>
          <VoltageChart />
        </article>

        <article className="battery-panel">
          <div className="battery-panel-head">
            <div>
              <h2>风险分布</h2>
              <p>AI 模型按设备簇输出健康分层。</p>
            </div>
          </div>
          <RiskChart />
        </article>
      </section>

      <section className="battery-bottom-grid">
        <article className="battery-panel">
          <div className="battery-panel-head">
            <div>
              <h2>设备实时状态</h2>
              <p>关键站点的 SOC、SOH、温度与负载。</p>
            </div>
          </div>
          <div className="device-list">
            {devices.map((device) => (
              <div key={device.name} className="device-row">
                <div className="device-main">
                  <strong>{device.name}</strong>
                  <span>{device.site}</span>
                </div>
                <span className={`device-status status-${device.status}`}>
                  {device.status}
                </span>
                <div className="device-stats">
                  <span>SOC {device.soc}%</span>
                  <span>SOH {device.soh}%</span>
                  <span>{device.temp}℃</span>
                  <span>负载 {device.load}%</span>
                </div>
                <div className="device-progress">
                  <i style={{ width: `${device.load}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="battery-panel">
          <div className="battery-panel-head">
            <div>
              <h2>数据告警</h2>
              <p>由规则引擎与 AI 异常检测共同触发。</p>
            </div>
          </div>
          <div className="alert-list">
            {alerts.map((alert) => (
              <div
                key={alert.title}
                className={`alert-row level-${alert.level}`}
              >
                <div>
                  <span>{alert.level}</span>
                  <strong>{alert.title}</strong>
                  <p>{alert.target}</p>
                </div>
                <div>
                  <b>{alert.value}</b>
                  <small>{alert.time}</small>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="battery-panel">
          <div className="battery-panel-head">
            <div>
              <h2>AI 运维建议</h2>
              <p>结合容量预测、热失控风险和均衡策略生成。</p>
            </div>
          </div>
          <div className="insight-list">
            {insights.map((item, index) => (
              <div key={item} className="insight-row">
                <span>{index + 1}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  )
}

export default AIBatteryManagement
