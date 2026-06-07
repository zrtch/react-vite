import React, { useState, useCallback } from 'react'
import { Button, Input } from 'antd'
import {
  FileTextOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  ScissorOutlined,
  AudioOutlined,
  BookOutlined,
  DownloadOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  ConnectionLineType,
  Panel,
  Handle,
  Position,
  getBezierPath,
  EdgeProps,
} from 'reactflow'
import 'reactflow/dist/style.css'

const { TextArea } = Input

// 自定义滚动条样式
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 3px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`

// 注入样式
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style')
  styleElement.innerHTML = scrollbarStyles
  if (!document.head.querySelector('style[data-scrollbar]')) {
    styleElement.setAttribute('data-scrollbar', 'true')
    document.head.appendChild(styleElement)
  }
}

// 自定义边组件 - 动态贝塞尔曲线带渐变
const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const gradientId = `gradient-${id}`

  return (
    <>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4a9eff" stopOpacity="1" />
          <stop offset="50%" stopColor="#7bb8ff" stopOpacity="1" />
          <stop offset="100%" stopColor="#b8d9ff" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <path
        id={id}
        style={{
          ...style,
          strokeWidth: 2,
          stroke: `url(#${gradientId})`,
        }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
    </>
  )
}

const edgeTypes = {
  custom: CustomEdge,
}

/**
 * 自定义节点：文本节点
 * 用于显示文本内容的生成节点
 * @param data - 节点数据，包含 onAddNode 回调函数
 * @param id - 节点唯一标识符
 */
const TextNode = ({ data, id }: { data: any; id: string }) => {
  // 控制加号按钮的显示/隐藏状态
  const [showAddButton, setShowAddButton] = useState(false)

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setShowAddButton(true)} // 鼠标移入显示加号
      onMouseLeave={() => setShowAddButton(false)} // 鼠标移出隐藏加号
    >
      {/* 节点主体容器 */}
      <div
        style={{
          padding: '16px',
          backgroundColor: '#1a1a1a',
          border: '1px solid #444',
          borderRadius: '8px',
          minWidth: '200px',
          maxWidth: '250px',
          color: '#fff',
          fontSize: '13px',
        }}
      >
        {/* 右侧连接点 - 作为源节点连接到其他节点 */}
        <Handle
          type="source"
          position={Position.Right}
          style={{ background: '#555' }}
        />
        {/* 左侧连接点 - 作为目标节点接收其他节点的连接 */}
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: '#555' }}
        />
        {/* 节点标题 */}
        <div style={{ marginBottom: '8px', color: '#999', fontSize: '12px' }}>
          <FileTextOutlined /> 文本
        </div>
        {/* 节点内容 */}
        <div style={{ color: '#ccc' }}>文本内容生成中...</div>
      </div>
      {/* 悬浮时显示的加号按钮 */}
      {showAddButton && (
        <div
          style={{
            position: 'absolute',
            right: '-20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: '32px',
            height: '32px',
            backgroundColor: '#4a9eff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(74, 158, 255, 0.4)',
          }}
          onClick={(e) => {
            e.stopPropagation() // 阻止事件冒泡
            if (data.onAddNode) data.onAddNode(id) // 触发添加节点回调
          }}
        >
          <PlusCircleOutlined style={{ color: '#fff', fontSize: '18px' }} />
        </div>
      )}
    </div>
  )
}

/**
 * 自定义节点：图片节点
 * 用于显示图片生成的节点，包含图片预览区域
 * @param data - 节点数据
 * @param id - 节点唯一标识符
 */
const ImageNode = ({ data, id }: { data: any; id: string }) => {
  const [showAddButton, setShowAddButton] = useState(false)

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setShowAddButton(true)}
      onMouseLeave={() => setShowAddButton(false)}
    >
      <div
        style={{
          padding: '16px',
          backgroundColor: '#1a1a1a',
          border: '1px solid #444',
          borderRadius: '8px',
          minWidth: '200px',
          color: '#fff',
          fontSize: '13px',
        }}
      >
        <Handle
          type="source"
          position={Position.Right}
          style={{ background: '#555' }}
        />
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: '#555' }}
        />
        <div style={{ marginBottom: '8px', color: '#999', fontSize: '12px' }}>
          <PictureOutlined /> 图片
        </div>
        <div
          style={{
            width: '180px',
            height: '120px',
            backgroundColor: '#2a2a2a',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666',
          }}
        >
          图片生成中...
        </div>
      </div>
      {showAddButton && (
        <div
          style={{
            position: 'absolute',
            right: '-20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: '32px',
            height: '32px',
            backgroundColor: '#4a9eff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(74, 158, 255, 0.4)',
          }}
          onClick={(e) => {
            e.stopPropagation()
            if (data.onAddNode) data.onAddNode(id)
          }}
        >
          <PlusCircleOutlined style={{ color: '#fff', fontSize: '18px' }} />
        </div>
      )}
    </div>
  )
}

/**
 * 自定义节点：视频节点
 * 用于显示视频生成的节点，包含视频预览区域
 * @param data - 节点数据
 * @param id - 节点唯一标识符
 */
const VideoNode = ({ data, id }: { data: any; id: string }) => {
  const [showAddButton, setShowAddButton] = useState(false)

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setShowAddButton(true)}
      onMouseLeave={() => setShowAddButton(false)}
    >
      <div
        style={{
          padding: '16px',
          backgroundColor: '#1a1a1a',
          border: '1px solid #444',
          borderRadius: '8px',
          minWidth: '220px',
          color: '#fff',
          fontSize: '13px',
        }}
      >
        <Handle
          type="source"
          position={Position.Right}
          style={{ background: '#555' }}
        />
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: '#555' }}
        />
        <div style={{ marginBottom: '8px', color: '#999', fontSize: '12px' }}>
          <VideoCameraOutlined /> 视频
        </div>
        <div
          style={{
            width: '200px',
            height: '120px',
            backgroundColor: '#2a2a2a',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <VideoCameraOutlined style={{ fontSize: '32px' }} />
          <div>视频生成中...</div>
        </div>
      </div>
      {showAddButton && (
        <div
          style={{
            position: 'absolute',
            right: '-20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: '32px',
            height: '32px',
            backgroundColor: '#4a9eff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(74, 158, 255, 0.4)',
          }}
          onClick={(e) => {
            e.stopPropagation()
            if (data.onAddNode) data.onAddNode(id)
          }}
        >
          <PlusCircleOutlined style={{ color: '#fff', fontSize: '18px' }} />
        </div>
      )}
    </div>
  )
}

/**
 * 自定义节点：音频节点
 * 用于显示音频生成的节点
 * @param data - 节点数据
 * @param id - 节点唯一标识符
 */
const AudioNode = ({ data, id }: { data: any; id: string }) => {
  const [showAddButton, setShowAddButton] = useState(false)

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setShowAddButton(true)}
      onMouseLeave={() => setShowAddButton(false)}
    >
      <div
        style={{
          padding: '16px',
          backgroundColor: '#1a1a1a',
          border: '1px solid #444',
          borderRadius: '8px',
          minWidth: '200px',
          color: '#fff',
          fontSize: '13px',
        }}
      >
        <Handle
          type="source"
          position={Position.Right}
          style={{ background: '#555' }}
        />
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: '#555' }}
        />
        <div style={{ marginBottom: '8px', color: '#999', fontSize: '12px' }}>
          <AudioOutlined /> 音频
        </div>
        <div
          style={{
            padding: '12px',
            backgroundColor: '#2a2a2a',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#ccc',
          }}
        >
          <AudioOutlined style={{ fontSize: '24px' }} />
          <div>音频生成中...</div>
        </div>
      </div>
      {showAddButton && (
        <div
          style={{
            position: 'absolute',
            right: '-20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: '32px',
            height: '32px',
            backgroundColor: '#4a9eff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(74, 158, 255, 0.4)',
          }}
          onClick={(e) => {
            e.stopPropagation()
            if (data.onAddNode) data.onAddNode(id)
          }}
        >
          <PlusCircleOutlined style={{ color: '#fff', fontSize: '18px' }} />
        </div>
      )}
    </div>
  )
}

/**
 * 自定义节点：剧本文本节点
 * 用于显示剧本内容的节点，支持长文本滚动
 * @param data - 节点数据，包含 content（剧本内容）和 onAddNode 回调
 * @param id - 节点唯一标识符
 */
const ScriptNode = ({ data, id }: { data: any; id: string }) => {
  const [showAddButton, setShowAddButton] = useState(false)

  return (
    <div
      style={{
        position: 'relative',
      }}
      onMouseEnter={() => setShowAddButton(true)}
      onMouseLeave={() => setShowAddButton(false)}
    >
      <div
        style={{
          padding: '14px',
          backgroundColor: '#1a1a1a',
          border: '1px solid #444',
          borderRadius: '8px',
          minWidth: '200px',
          maxWidth: '240px',
          color: '#fff',
          fontSize: '12px',
          lineHeight: '1.5',
        }}
      >
        <Handle
          type="source"
          position={Position.Right}
          style={{ background: '#555' }}
        />
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: '#555' }}
        />

        <div style={{ marginBottom: '8px', color: '#999', fontSize: '11px' }}>
          📄 剧本
        </div>
        <div
          className="custom-scrollbar"
          style={{
            maxHeight: '180px',
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
            // wordBreak: 'break-word',
          }}
        >
          {data.content}
        </div>
      </div>

      {/* 悬浮时显示的加号按钮 */}
      {showAddButton && (
        <div
          style={{
            position: 'absolute',
            right: '-20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: '32px',
            height: '32px',
            backgroundColor: '#4a9eff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(74, 158, 255, 0.4)',
          }}
          onClick={(e) => {
            e.stopPropagation()
            if (data.onAddNode) {
              data.onAddNode(id)
            }
          }}
        >
          <PlusCircleOutlined style={{ color: '#fff', fontSize: '18px' }} />
        </div>
      )}
    </div>
  )
}

/**
 * 自定义节点：生成器节点
 * 用于显示脚本生成器的节点，包含网格布局和进度显示
 * @param data - 节点数据，包含 title（标题）和 onAddNode 回调
 * @param id - 节点唯一标识符
 */
const GeneratorNode = ({ data, id }: { data: any; id: string }) => {
  const [showAddButton, setShowAddButton] = useState(false)

  return (
    <div
      style={{
        position: 'relative',
      }}
      onMouseEnter={() => setShowAddButton(true)}
      onMouseLeave={() => setShowAddButton(false)}
    >
      <div
        style={{
          padding: '16px',
          backgroundColor: '#2a2a2a',
          border: '2px solid #444',
          borderRadius: '12px',
          minWidth: '320px',
          color: '#fff',
        }}
      >
        <Handle
          type="source"
          position={Position.Right}
          style={{ background: '#555' }}
        />
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: '#555' }}
        />

        <div
          style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '12px' }}
        >
          {data.title || '脚本生成器'}
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
          }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              style={{
                height: '40px',
                backgroundColor: '#3a3a3a',
                borderRadius: '4px',
              }}
            />
          ))}
        </div>
        <div
          style={{
            marginTop: '12px',
            padding: '8px',
            backgroundColor: '#1a1a1a',
            borderRadius: '4px',
            textAlign: 'center',
            fontSize: '12px',
            color: '#999',
          }}
        >
          生成中 46%...
        </div>
      </div>

      {/* 悬浮时显示的加号按钮 */}
      {showAddButton && (
        <div
          style={{
            position: 'absolute',
            right: '-20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: '32px',
            height: '32px',
            backgroundColor: '#4a9eff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(74, 158, 255, 0.4)',
          }}
          onClick={(e) => {
            e.stopPropagation()
            if (data.onAddNode) {
              data.onAddNode(id)
            }
          }}
        >
          <PlusCircleOutlined style={{ color: '#fff', fontSize: '18px' }} />
        </div>
      )}
    </div>
  )
}

/**
 * 注册所有自定义节点类型
 * 在 ReactFlow 中使用这些节点类型来渲染不同的节点
 */
const nodeTypes = {
  scriptNode: ScriptNode, // 剧本节点
  generatorNode: GeneratorNode, // 生成器节点
  textNode: TextNode, // 文本节点
  imageNode: ImageNode, // 图片节点
  videoNode: VideoNode, // 视频节点
  audioNode: AudioNode, // 音频节点
}

/**
 * 画布编辑器 - 节点流程编辑器
 * 功能：左侧剧本面板 + 中间 ReactFlow 画布 + 右键菜单
 */
const CanvasEditor: React.FC = () => {
  const [promptText, setPromptText] = useState(
    '《我在盐湖等你下》\n\n类型：古风 / 穿越 / 英文漫画\n时长建议：60-90秒\n基调：热血 × 纯黑史诗感 × 英式节奏\n\n【序幕】\n\n【现代·深夜办公室】\n缓慢推进镜头，《我在盐湖等你下》《我在盐湖等你下》《我在盐湖等你下》《我在盐湖等你下》《我在盐湖等你下》《我在盐湖等你下》《我在盐湖等你下》《我在盐湖等你下》《我在盐湖等你下》《我在盐湖等你下》《我在盐湖等你下》《我在盐湖等你下》《我在盐湖等你下》《我在盐湖等你下》《我在盐湖等你下》《我在盐湖等你下》《我在盐湖等你下》《我在盐湖等你下》《我在盐湖等你下》《我在盐湖等你下》《我在盐湖等你下》《我在盐湖等你下》《我在盐湖等你下》《我在盐湖等你下》《我在盐湖等你下》《我在盐湖等你下》《我在盐湖等你下》《我在盐湖等你下》《我在盐湖等你下》',
  )

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([
    {
      id: '1',
      type: 'scriptNode',
      position: { x: 100, y: 150 },
      data: {
        content: promptText,
        onAddNode: handleAddNodeFromNode,
      },
    },
  ])

  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  const [contextMenu, setContextMenu] = useState<{
    visible: boolean
    x: number
    y: number
    sourceNodeId?: string
  }>({ visible: false, x: 0, y: 0 })

  /**
   * 从节点添加新节点的处理函数
   * 当用户点击节点上的加号按钮时触发
   * @param sourceNodeId - 源节点的 ID
   */
  function handleAddNodeFromNode(sourceNodeId: string) {
    const sourceNode = nodes.find((n) => n.id === sourceNodeId)
    if (!sourceNode) return

    // 计算已有的从该节点连接出去的节点数量，用于垂直排列
    const connectedNodes = edges.filter((e) => e.source === sourceNodeId).length

    // 显示右键菜单，位置在源节点右侧，垂直偏移避免重叠
    setContextMenu({
      visible: true,
      x: sourceNode.position.x + 450, // 水平偏移
      y: sourceNode.position.y + connectedNodes * 200, // 垂直偏移，每个节点间隔 200px
      sourceNodeId,
    })
  }

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'custom',
            animated: true,
          },
          eds,
        ),
      )
    },
    [setEdges],
  )

  const onPaneContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault()
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
    })
  }, [])

  /**
   * 处理菜单项点击事件
   * 根据选择的类型创建对应的节点，并自动连接到源节点
   * @param type - 节点类型（text/image/video/audio/script）
   */
  const handleMenuClick = (type: string) => {
    const sourceNodeId = contextMenu.sourceNodeId

    // 根据类型选择节点类型和标题
    let nodeType = 'generatorNode'
    let nodeTitle = '生成器'

    switch (type) {
      case 'text':
        nodeType = 'textNode'
        nodeTitle = '文本'
        break
      case 'image':
        nodeType = 'imageNode'
        nodeTitle = '图片'
        break
      case 'video':
        nodeType = 'videoNode'
        nodeTitle = '视频'
        break
      case 'audio':
        nodeType = 'audioNode'
        nodeTitle = '音频'
        break
      case 'script':
        nodeType = 'scriptNode'
        nodeTitle = '脚本'
        break
      default:
        nodeType = 'generatorNode'
        nodeTitle = '脚本生成器'
    }

    // 创建新节点
    const newNode: Node = {
      id: `${Date.now()}`, // 使用时间戳作为唯一 ID
      type: nodeType,
      position: {
        x: contextMenu.x - 100, // 菜单位置向左偏移 100px
        y: contextMenu.y - 100, // 菜单位置向上偏移 100px
      },
      data: {
        title: nodeTitle,
        content: '新建内容',
        onAddNode: handleAddNodeFromNode, // 传递回调函数，支持继续添加节点
      },
    }

    setNodes((nds) => [...nds, newNode])

    // 如果是从节点创建的，自动连接到源节点
    if (sourceNodeId) {
      const newEdge: Edge = {
        id: `e${sourceNodeId}-${newNode.id}`, // 边的 ID 格式：e源节点ID-目标节点ID
        source: sourceNodeId, // 源节点
        target: newNode.id, // 目标节点
        type: 'custom', // 使用自定义边类型（带渐变效果）
        animated: true, // 启用动画效果
      }
      setEdges((eds) => [...eds, newEdge])
    }

    // 关闭菜单
    setContextMenu({ visible: false, x: 0, y: 0 })
  }

  /**
   * 右键菜单项配置
   * 定义了可以创建的节点类型
   */
  const menuItems = [
    { key: 'text', icon: <FileTextOutlined />, label: '文本' },
    { key: 'image', icon: <PictureOutlined />, label: '图片' },
    { key: 'video', icon: <VideoCameraOutlined />, label: '视频' },
    {
      key: 'compose',
      icon: <ScissorOutlined />,
      label: '视频合成',
      disabled: true, // Beta 功能，暂时禁用
    },
    { key: 'audio', icon: <AudioOutlined />, label: '音频' },
    { key: 'script', icon: <BookOutlined />, label: '脚本', disabled: true }, // Beta 功能
  ]

  return (
    <div
      style={{ display: 'flex', height: '100vh', backgroundColor: '#0a0a0a' }}
    >
      {/* 左侧剧本面板 */}
      <div
        style={{
          width: '320px',
          backgroundColor: '#1a1a1a',
          padding: '20px',
          overflowY: 'auto',
          borderRight: '1px solid #333',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px',
          }}
        >
          <FileTextOutlined style={{ color: '#999' }} />
          <span style={{ color: '#999', fontSize: '14px' }}>剧本</span>
        </div>
        <TextArea
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          placeholder="输入你的创意描述..."
          className="custom-scrollbar"
          style={{
            backgroundColor: '#0a0a0a',
            color: '#fff',
            border: '1px solid #333',
            minHeight: '500px',
            resize: 'vertical',
          }}
        />
        <Button
          type="primary"
          block
          style={{ marginTop: '16px' }}
          onClick={() => {
            const newNode: Node = {
              id: `script-${Date.now()}`,
              type: 'scriptNode',
              position: { x: 100, y: 100 },
              data: {
                content: promptText.slice(0, 200) + '...',
                onAddNode: handleAddNodeFromNode,
              },
            }
            setNodes((nds) => [...nds, newNode])
          }}
        >
          添加到画布
        </Button>
      </div>

      {/* 中间 ReactFlow 画布 */}
      <div style={{ flex: 1, position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onPaneContextMenu={onPaneContextMenu}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          connectionLineType={ConnectionLineType.Bezier}
          defaultEdgeOptions={{
            type: 'custom',
            animated: true,
          }}
          fitView
          style={{ backgroundColor: '#0a0a0a' }}
        >
          <Background color="#333" gap={20} />
          <Controls
            style={{ bottom: 20, left: '50%', transform: 'translateX(-50%)' }}
          />
          <Panel position="top-left" style={{ margin: '10px' }}>
            <Button
              icon={<DownloadOutlined />}
              style={{
                backgroundColor: '#2a2a2a',
                color: '#fff',
                border: 'none',
              }}
            >
              导出
            </Button>
          </Panel>
        </ReactFlow>

        {/* 右键菜单 */}
        {contextMenu.visible && (
          <div
            style={{
              position: 'fixed',
              top: contextMenu.y,
              left: contextMenu.x,
              zIndex: 1000,
            }}
            onMouseLeave={() => setContextMenu({ visible: false, x: 0, y: 0 })}
          >
            <div
              style={{
                backgroundColor: '#2a2a2a',
                border: '1px solid #444',
                borderRadius: '8px',
                padding: '8px',
                minWidth: '200px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
              }}
            >
              <div
                style={{
                  padding: '8px 12px',
                  color: '#999',
                  fontSize: '12px',
                  borderBottom: '1px solid #333',
                  marginBottom: '4px',
                }}
              >
                引用该节点生成
              </div>
              {menuItems.map((item) => (
                <div
                  key={item.key}
                  onClick={() => !item.disabled && handleMenuClick(item.key)}
                  style={{
                    padding: '10px 12px',
                    color: item.disabled ? '#666' : '#fff',
                    cursor: item.disabled ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    borderRadius: '4px',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!item.disabled) {
                      e.currentTarget.style.backgroundColor = '#3a3a3a'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.disabled && (
                    <span
                      style={{
                        marginLeft: 'auto',
                        fontSize: '10px',
                        color: '#666',
                      }}
                    >
                      Beta
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CanvasEditor
