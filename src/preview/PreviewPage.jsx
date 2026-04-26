import { componentMap } from '../components/index'

function PreviewNode({ node }) {
  const Component = componentMap[node.type]

  if (!Component) {
    return <div style={{ color: 'red' }}>未知组件: {node.type}</div>
  }

  return (
    <Component {...node.props}>
      {node.children?.map(child => (
        <PreviewNode key={child.id} node={child} />
      ))}
    </Component>
  )
}

export default function PreviewPage() {
  const raw = localStorage.getItem('preview_schema')
  const schema = raw ? JSON.parse(raw) : null

  if (!schema) {
    return (
      <div style={{ padding: '40px', color: '#999' }}>
        没有可预览的内容，请先在编辑器中搭建页面。
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff' }}>

      {/* 预览顶栏 */}
      <div style={{
        height: '40px',
        backgroundColor: '#1f1f1f',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        justifyContent: 'space-between',
      }}>
        <span style={{ color: '#999', fontSize: '12px' }}>
          👁 预览模式 — {schema.pageName}
        </span>
        <button
          onClick={() => window.close()}
          style={{
            padding: '4px 12px',
            backgroundColor: '#333',
            color: '#fff',
            border: '1px solid #555',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          关闭预览
        </button>
      </div>

      {/* 页面内容：纯渲染 schema */}
      <div style={{ padding: '24px' }}>
        <PreviewNode node={schema.root} />
      </div>

    </div>
  )
}