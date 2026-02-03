import './KafkaSync.css'

const highlights = [
  {
    title: '统一事实日志',
    desc: 'Kafka 将每个训练阶段的状态变更写入可追加日志，所有参与方只需消费同一条时间线即可对齐视角。',
  },
  {
    title: '顺序与可重放',
    desc: '分区内严格有序，允许重放和回溯，训练出错时可以从任意 checkpoint 继续。',
  },
  {
    title: '高吞吐扩展',
    desc: '顺序磁盘写 + 批量传输让状态广播具备百万级事件吞吐，适配大规模集群。',
  },
  {
    title: '强韧性与持久化',
    desc: '多副本 + ISR 保障关键训练状态不丢失，故障节点可快速追平进度。',
  },
]

const reasons = [
  {
    label: '训练进度',
    detail: 'Step / Epoch / LR 调度 / Loss 统计统一写入，实时对齐。',
  },
  {
    label: '模型权重',
    detail: '权重快照索引化，结合对象存储只传元信息，不拖慢训练。',
  },
  {
    label: '资源编排',
    detail: '弹性扩缩容时，让新节点快速复盘历史状态，避免冷启动。',
  },
  {
    label: '异常处理',
    detail: '失败回滚、暂停、恢复等控制信号可即时广播并安全落盘。',
  },
]

const architecture = [
  {
    title: '训练节点',
    items: ['产生日志', '提交心跳', '消费控制指令'],
  },
  {
    title: 'Kafka 主题',
    items: ['state-events', 'control-signals', 'metrics-stream'],
  },
  {
    title: '编排服务',
    items: ['实时监控', '自动伸缩', '异常处理'],
  },
  {
    title: '可视化/告警',
    items: ['Dashboard', 'SLA 告警', '趋势分析'],
  },
]

const comparisons = [
  {
    title: '数据库轮询',
    value: '延迟高、锁竞争、难以应对高频状态。',
  },
  {
    title: '点对点同步',
    value: '连接复杂、难扩展、容错差。',
  },
  {
    title: '自研消息总线',
    value: '运维成本高、生态薄弱、难以稳定扩展。',
  },
]

const KafkaSync = () => {
  return (
    <div className="kafka-sync">
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">模型训练 · 状态同步 · 实时协作</p>
          <h1>Kafka 是训练状态同步的最优解</h1>
          <p className="subtitle">
            分布式训练需要跨节点、跨服务的实时一致状态。Kafka 以可追加日志、强韧性复制、
            高吞吐实时流，提供对齐全局训练态的最佳基础设施。
          </p>
          <div className="hero-metrics">
            <div>
              <strong>毫秒级</strong>
              <span>状态传播</span>
            </div>
            <div>
              <strong>百万级</strong>
              <span>事件吞吐</span>
            </div>
            <div>
              <strong>多副本</strong>
              <span>容错保障</span>
            </div>
          </div>
        </div>
        <div className="hero-panel">
          <div className="pulse" />
          <div className="panel-card">
            <h3>统一训练时间线</h3>
            <p>所有训练节点在同一条日志上协作，节省 60% 以上状态对齐成本。</p>
            <div className="panel-tags">
              <span>Exactly-Once</span>
              <span>Rebalance</span>
              <span>Replay</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>核心价值</h2>
          <p>训练状态同步从“同步数据”升级为“同步时间线”。</p>
        </div>
        <div className="grid">
          {highlights.map((item) => (
            <article key={item.title} className="card">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section split">
        <div>
          <div className="section-header">
            <h2>同步范围全覆盖</h2>
            <p>统一管理训练态、资源态和控制态，确保调度逻辑简洁可靠。</p>
          </div>
          <div className="pill-list">
            {reasons.map((item) => (
              <div key={item.label} className="pill">
                <h4>{item.label}</h4>
                <p>{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="comparison">
          <h3>替代方案痛点</h3>
          {comparisons.map((item) => (
            <div key={item.title} className="comparison-row">
              <span>{item.title}</span>
              <p>{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>参考架构</h2>
          <p>围绕 Kafka 构建训练状态同步的标准管线。</p>
        </div>
        <div className="architecture">
          {architecture.map((block) => (
            <div key={block.title} className="arch-card">
              <h4>{block.title}</h4>
              <ul>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="cta">
        <div>
          <h2>让训练状态从“各自为战”变成“共同时间线”</h2>
          <p>在高并发、跨机房、跨集群场景下，Kafka 仍能提供稳定的顺序、可追溯与可扩展能力。</p>
        </div>
        <button type="button">查看最佳实践清单</button>
      </section>
    </div>
  )
}

export default KafkaSync
