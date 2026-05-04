import { useEffect ,useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ActionCreators } from 'redux-undo'
import './global.css'
import {setSelectedId} from './store/pageSlice';
import ErrorBoundary from './editor/ErrorBoundary';
import { selectCurrentSchema } from './store/pageSlice';
import Toolbar from './editor/Toolbar'
import LeftPanel from './editor/LeftPanel'
import RightPanel from './editor/RightPanel'
import Renderer from './engine/Renderer'

export default function App() {
  const dispatch = useDispatch()
  const schema = useSelector(selectCurrentSchema);
  const pageName = schema?.pageName;
  const [zoom, setZoom] = useState(100);
  const handleZoomIn = () => setZoom(z => Math.min(z + 10, 150));
  const handleZoomOut = () => setZoom(z => Math.max(z - 10, 50));
  const handleZoomReset = () => setZoom(100);

  // Ctrl+Z 撤销 / Ctrl+Y 重做
 useEffect(() => {
  // 定义键盘按下事件的处理函数
  const handleKeyDown = (e) => {
    // 如果按下了 Ctrl + Z
    if (e.ctrlKey && e.key === 'z') {
      e.preventDefault()        // 阻止浏览器默认行为（比如浏览器自带的撤销输入）
      dispatch(ActionCreators.undo())  // 派发 Redux 撤销动作
    }
    // 如果按下了 Ctrl + Y
    if (e.ctrlKey && e.key === 'y') {
      e.preventDefault()        // 阻止浏览器默认行为
      dispatch(ActionCreators.redo())  // 派发 Redux 重做动作
    }
  }

  // 给整个 window 绑定键盘监听
  window.addEventListener('keydown', handleKeyDown)

  // 组件卸载时，清除监听，防止内存泄漏
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [dispatch])  // 依赖项：dispatch 变化时才会重新执行useEffect
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>

      {/* 顶部工具栏 */}
      <Toolbar
         zoom={zoom}
         onZoomIn={handleZoomIn}
         onZoomOut={handleZoomOut}
         onZoomReset={handleZoomReset}
      />

      {/* 三栏编辑区 */}
      <div className="editor-layout" style={{ flex: 1, overflow: 'visible' }}>

        {/* 左侧物料库 */}
        <LeftPanel />

        {/* 中间画布 */}
<main
  className="canvas"
  onClick={() => dispatch(setSelectedId(null))}
  style={{
    flex: 1,
    overflow: 'auto',
    display: 'flex',
    justifyContent: 'center',  // 水平居中
    alignItems: 'flex-start',  // 顶部对齐
    padding: '40px',
    backgroundColor: '#f0f2f5',
  }}
>
  <div style={{
    width: '900px',
    minHeight:'600px',
    flexShrink: 0,
    transform: `scale(${zoom / 100})`,
    transformOrigin: 'top center',  // 以自身中心为基点缩放
    transition: 'transform 0.2s',
  }}>
    <div className="canvas-container">
      <h2 style={{ marginBottom: '20px', fontSize: '14px', color: '#999' }}>
        {pageName}
      </h2>
      <ErrorBoundary>
        <Renderer />
      </ErrorBoundary>
    </div>
  </div>
</main>
        {/* 右侧属性面板 */}
        <RightPanel />

      </div>
    </div>
  )
}