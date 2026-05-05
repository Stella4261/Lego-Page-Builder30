import { componentMap } from '../components/index'
// 从  localStorage  拿到编辑器存的页面 JSON 结构，递归渲染组件树，实现可视化预览。

function PreviewNode({ node }) {
  const Component = componentMap[node.type]

  if (!Component) {
    return <div className="render-node-error">未知组件: {node.type}</div>;
  }

  return (
    <Component {...node.props}>
      {node.children?.map(child => (
        // key={child.id} React 列表循环必须要有唯一 key，用组件唯一 id 就行。
        <PreviewNode key={child.id} node={child} />
      ))}
    </Component>
  )
}

export default function PreviewPage() {
  //  localStorage.getItem('键名') ：从浏览器本地存储取值
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
    <div className="preview-page">
      <div className="preview-toolbar">
        <span className="preview-toolbar-info">
          👁 预览模式 — {schema.pageName}
        </span>
        <button className="preview-toolbar-btn" onClick={() => window.close()}>
          关闭预览
        </button>
      </div>
      <div className="preview-content">
        <PreviewNode node={schema.root} />
      </div>
    </div>
  );
}