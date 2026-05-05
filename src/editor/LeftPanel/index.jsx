import { useDrag } from 'react-dnd';
import { useSelector, useDispatch } from 'react-redux';
import { addPage, switchPage,deletePage } from '../../store/pageSlice';
// 这是低代码平台的左侧物料面板
// 作用：展示可拖拽的组件列表，让用户能把组件拖到中间画布。



// type ：组件类型（Button/Input/Container/Text）
// label ：显示的文字（带图标）
function DraggableItem({ type, label }) {
// useDrag ：react-dnd 提供的拖拽钩子
//执行后返回两个东西：
// 1.  { isDragging } ：状态 —— 是否正在拖拽
// 2.  drag ：一个 ref —— 绑到 DOM 上，元素才能被拖动
  const [{ isDragging }, drag] = useDrag(() => ({
// 左边拖拽（useDrag）写：
// useDrag(() => ({
//   type: 'COMPONENT', // 👈 这里
// }))
// 右边接收拖拽（useDrop）必须写：
// useDrop(() => ({
//   accept: 'COMPONENT', // 👈 跟这里一模一样
// }))
// 必须完全一样，才能拖得进去！
    type: 'COMPONENT',
// react-dnd 要求 item 必须是一个对象
//  item: { componentType: type }拖拽时带过去的数据
// 当你把它拖到画布，画布那边的  useDrop  会收到这个 item，从而知道你拖过来的是 Button、Input 还是 Container。
    item: { componentType: type },
// monitor  是拖拽监视器
// monitor.isDragging()  → 返回  true/false 
// 用来控制样式：变透明、变颜色等
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  //渲染DOM结构
  return (
    <div
      ref={drag}
      className={`material-item ${isDragging ? 'material-item--dragging' : ''}`}
    >
      {/* {}表示 这里要放 JS 变量/表达式 */}
       {label}   {/* 显示按钮名字 */}
    </div>
  );
}



//定义物料数据
// 它就是一个普通数组，里面放了4个对象，每个对象对应左侧一个可拖拽的组件按钮
const materials = [
  { type: 'Button', label: '🔘 按钮 Button' },
  { type: 'Input', label: '📝 输入框 Input' },
  { type: 'Container', label: '📦 容器 Container' },
  { type: 'Text', label: '🔤 文本 Text' },
  { type: 'Image', label: '🖼 图片 Image'},
];


//渲染左侧面板
export default function LeftPanel() {
  const dispatch = useDispatch();
  const pages = useSelector(state => state.page.present.pages);
  const currentPageId = useSelector(state => state.page.present.currentPageId);

  return (
    <aside className="left-panel">
      <h3>页面列表</h3>
      <div className="page-list">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <button
            className="toolbar-btn toolbar-btn--primary"
            style={{ fontSize: '11px', padding: '2px 8px' }}
            onClick={() => dispatch(addPage())}
          >
            + 新建
          </button>
        </div>
        {pages.map(page => (
          <div key={page.id} className="page-item">
            <div
              className={`page-item-name ${page.id === currentPageId ? 'page-item-name--active' : ''}`}
              onClick={() => dispatch(switchPage(page.id))}
            >
              {page.name}
            </div>
            {pages.length > 1 && (
              <span
                className="page-item-delete"
                onClick={() => dispatch(deletePage(page.id))}
              >
                ×
              </span>
            )}
          </div>
        ))}
      </div>


      {/* 物料库 */}
      <h3 style={{ marginBottom: '16px' }}>物料库</h3>
      {materials.map(m => (
        <DraggableItem key={m.type} type={m.type} label={m.label} />
      ))}
    </aside>
  );
}