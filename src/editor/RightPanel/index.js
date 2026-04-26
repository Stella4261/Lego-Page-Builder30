import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProps, deleteNode } from '../../store/pageSlice';
import { metaMap } from '../../components';
import { setterMap } from './setters';
import StylePanel from './StylePanel'; // 引入通用样式面板


// 这是低代码平台的右侧属性面板：
// 1. 从 Redux 拿到当前选中的组件 id
// 2. 在整个页面的组件树里找到这个组件
// 3. 把组件的所有属性自动生成输入框
// 4. 用户改输入框 → 自动同步到 Redux → 画布组件跟着变


// 根据 id 找到对应的组件。
function findNodeById(node, id) {
  if (node.id === id) return node
// 有些组件没有子组件， node.children  是  undefined  或  null ,如果直接循环  undefined ，JS 会报错崩溃
// 所以加了  || [] ： 循环空数组就啥也不执行，安全不报错
  for (const child of node.children || []) {
    const found = findNodeById(child, id)
    if (found) return found
  }
  return null
}



export default function RightPanel() {
  const dispatch = useDispatch();
  const selectedId = useSelector(state => state.page.present.selectedId);
  const root = useSelector(state => state.page.present.schema.root);

  if (!selectedId) return <aside className="right-panel" style={{ padding: 20 }}><h3>请选择画布中的组件</h3></aside>;

  const node = findNodeById(root, selectedId);
  if (!node) return null;


//   //定义修改属性的方法
//   const handleChange = (key, value) => {
//     dispatch(updateProps({ id: selectedId, newProps: { [key]: value } }))
//   }

//   const handleDelete = () =>{
//     //root节点不允许删除
//     if(selectedId === 'root_001'){
//         alert('根节点不允许删除')
//         return
//     }
//     dispatch(deleteNode({id:selectedId}))
//   }

//   // 渲染属性面板
//   return (
//     <aside className="right-panel">
//       <h3>属性面板</h3>
//       <p style={{ fontSize: '12px', color: '#1677ff', marginBottom: '16px' }}>
//         当前组件：{node.type}（{node.id}） {/*先显示当前组件的信息 */}
//       </p >

// {/*再遍历组件属性 */}
// {/* Object.entries(...) :把一个对象，转成 [键, 值] 组成的二维数组 */}
//       {Object.entries(node.props).map(([key, value]) => {
//         //  如果属性值是对象 / 数组, 就不渲染输入框（直接跳过）, 避免界面出问题
//         if (typeof value === 'object') return null
//         return (
//   // 1. 等号左边的  key= : 这是 React 自带的固定属性，必须写在循环里：用来标识列表每一项 不写就报错、渲染可能乱掉 这是 React 规定的关键词
//           <div key={key} style={{ marginBottom: '12px' }}>
//             <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>
//               {key}
//             </label>
//             {/* 生成输入框 */}
//             <input
//             //  前面的  value ：是 input 标签自带的属性，用来显示框里的文字
//               value={value}
//               //修改同步到 Redux
//               onChange={(e) => handleChange(key, e.target.value)}  //onChange  是输入框内容一改变就触发
//               style={{
//                 width: '100%',
//                 padding: '6px 8px',
//                 border: '1px solid #d9d9d9',
//                 borderRadius: '4px',
//                 fontSize: '13px',
//                 boxSizing: 'border-box',
//               }}
//             />
//           </div>
//         )
//       })}
//       {/* 删除按钮 */}
//       <button 
//       onClick = {handleDelete}
//       style={{
//         width:'100%',
//         padding:'8px',
//         marginTop:'24px',
//         backgroundColor:'#ff4d4f',
//         color:'#fff',
//         border:'none',
//         borderRadius:'4px',
//         cursor:'pointer',
//         fontSize:'13px',
//       }}
//       >删除组件 
//       </button>
//     </aside>
//   )
// }
  // 1. 获取当前组件的元数据
 const meta = metaMap[node.type];

  // 专属属性（Props）渲染器
  const renderPropsPanel = () => {
    // 过滤掉写在 meta.js 里以 style. 开头的旧配置（向后兼容）
    const propSetters = meta?.setters.filter(s => !s.name.startsWith('style.')) || [];
    
    return propSetters.map(config => {
      const SetterComponent = setterMap[config.type];
      return (
        <div key={config.name} style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: '#666' }}>{config.label}</label>
          <SetterComponent
            value={node.props[config.name]}
            options={config.options}
            onChange={(newVal) => {
              dispatch(updateProps({ id: selectedId, newProps: { [config.name]: newVal } }));
            }}
          />
        </div>
      );
    });
  };

  return (
    <aside className="right-panel" style={{ width: '300px', padding: '15px', borderLeft: '1px solid #ddd', overflowY: 'auto' }}>
      <h3>{meta?.displayName || node.type} 配置</h3>
      
      {/* 专属属性区 */}
      <div className="props-section">
        {renderPropsPanel()}
      </div>

      {/* 通用样式区 */}
      <StylePanel node={node} selectedId={selectedId} />

      <button 
        onClick={() => dispatch(deleteNode({id: selectedId}))} 
        style={{ width: '100%', marginTop: '20px', padding: '10px', background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        🗑️ 删除当前组件
      </button>
    </aside>
  );
}