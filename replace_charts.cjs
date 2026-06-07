const fs = require('fs');
const path = './src/pages/SewageTreatment.tsx';
let content = fs.readFileSync(path, 'utf-8');

const newCharts = `  // 水质趋势图表配置
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
`;

const startIndex = content.indexOf('  // 水质趋势图表配置');
const endIndex = content.indexOf('  const columns = [');

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + newCharts + "\n" + content.substring(endIndex);
  fs.writeFileSync(path, content);
  console.log('Successfully replaced charts.');
} else {
  console.log('Could not find the target text blocks.');
}
