import { useDispatch, useSelector } from 'react-redux'
import { ActionCreators } from 'redux-undo'
import { loadSchema } from '../../store/pageSlice'


export default function Toolbar({ zoom, onZoomIn, onZoomOut, onZoomReset }) {
  const dispatch = useDispatch();
// 这是  redux-undo  固定结构：
// state.page.past ：历史操作数组
// 有内容 → 可以撤销
// 长度 >0 →  canUndo = true 
// state.page.future ：撤销后可恢复的操作
// 有内容 → 可以重做
// 长度 >0 →  canRedo = true
  const canUndo = useSelector(state => state.page.past.length > 0)
  const canRedo = useSelector(state => state.page.future.length > 0)
  //  schema ：整个页面的结构（所有组件、嵌套、属性），是一个大对象
  const schema = useSelector(state => state.page.present.schema)
  //导出JSON :把页面结构转成JSON字符串 → 包装成文件 → 生成临时地址 → 创建下载链接 → 模拟点击 → 下载到电脑
  const handleExport = () => {
// 第一个参数： schema --要转成 JSON 字符串的 对象/数据
// 第二个参数： null 
// 叫 replacer，可以是：
// - 一个函数：过滤、修改要序列化的内容
// - 一个数组：只保留指定字段
// 这里写  null  的意思就是：不做任何过滤，全部正常转成 JSON。
// 第三个参数： 2 -- 叫 space，表示 缩进空格数
// 作用： 让 JSON 格式化、换行、缩进对齐，变得好看可读。
    const json = JSON.stringify(schema,null,2)
// Blob ：浏览器里表示文件内容的对象
// 把上面那段 json 文本，包装成一个文件
// type: 'application/json' ：告诉浏览器这是 JSON 文件
    const blob = new Blob([json],{type:'application/json'})
    const url = URL.createObjectURL(blob)  //根据上面的文件（Blob），生成一个临时的本地地址- 这个地址可以用来下载文件
    const a = document.createElement('a') //用 JS 动态创建一个  <a>  标签
    a.href = url // 把链接地址，设为刚才生成的临时文件地址
//  给  <a>  标签设置  download  属性--意思是：点击这个链接不是跳转，是下载,  下载后的文件名叫  schema.json
    a.download = 'schema.json'
    a.click()  //JS 自动模拟点击，实现自动下载，不用人工再点击
    URL.revokeObjectURL(url) //释放刚才创建的临时地址,清理内存，避免浪费
  }
// 导入 JSON
  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const json = JSON.parse(evt.target.result)
        dispatch(loadSchema(json))
      } catch {
        alert('JSON 格式错误')
      }
    }
    reader.readAsText(file)
  }

  // 预览：先存 localStorage，再开新 tab
  const handlePreview = () => {
    localStorage.setItem('preview_schema', JSON.stringify(schema))
    window.open('/preview', '_blank')
  }

  return (
    <header style={{
      height: '48px',
      backgroundColor: '#1f1f1f',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: '8px',
      flexShrink: 0,
    }}>
      <span style={{ color: '#fff', fontWeight: 'bold', marginRight: '16px' }}>
        🧱 Lego Builder
      </span>

      <button
        onClick={() => dispatch(ActionCreators.undo())}
        disabled={!canUndo}
        style={btnStyle(canUndo)}
      >
        ↩ 撤销
      </button>

      <button
        onClick={() => dispatch(ActionCreators.redo())}
        disabled={!canRedo}
        style={btnStyle(canRedo)}
      >
        ↪ 重做
      </button>

  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '8px' }}>
  <button onClick={onZoomOut} style={btnStyle(zoom > 50)}>－</button>
  <span
    onClick={onZoomReset}
    style={{
      color: '#aaa',
      fontSize: '12px',
      minWidth: '44px',
      textAlign: 'center',
      cursor: 'pointer',
    }}
  >
    {zoom}%
  </span>
  <button onClick={onZoomIn} style={btnStyle(zoom < 150)}>＋</button>
</div>

      <div style={{ flex: 1 }} />

      <label style={{ ...btnStyle(true), cursor: 'pointer' }}>
        📂 导入 JSON
        <input
          type="file"
          accept=".json"
          onChange={handleImport}
          style={{ display: 'none' }}
        />
      </label>

      <button onClick={handleExport} style={btnStyle(true)}>
        💾 导出 JSON
      </button>

      <button
        onClick={handlePreview}
        style={{ ...btnStyle(true), backgroundColor: '#1677ff', borderColor: '#1677ff' }}
      >
        🔍 预览
      </button>
    </header>
  )
}

function btnStyle(enabled) {
  return {
    padding: '6px 12px',
    backgroundColor: enabled ? '#333' : '#2a2a2a',
    color: enabled ? '#fff' : '#555',
    border: '1px solid #444',
    borderRadius: '4px',
    cursor: enabled ? 'pointer' : 'not-allowed',
    fontSize: '12px',
  }
}