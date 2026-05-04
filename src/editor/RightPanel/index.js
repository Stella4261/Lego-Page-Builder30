import { useSelector, useDispatch } from 'react-redux';
import { updateProps, deleteNode } from '../../store/pageSlice';
import { metaMap } from '../../components';
import { setterMap } from './setters';
import StylePanel from './StylePanel'; // 引入通用样式面板
import { selectCurrentRoot } from '../../store/pageSlice';


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
  const dispatch = useDispatch();  //拿到派发函数，用来触发Redux修改
  const selectedId = useSelector(state => state.page.present.selectedId);
  const root = useSelector(selectCurrentRoot);

  if (!selectedId) return <aside className="right-panel" style={{ padding: 20 }}><h3>请选择画布中的组件</h3></aside>;

  const node = findNodeById(root, selectedId);
  if (!node) return null;

  // 1. 获取当前组件的元数据
 const meta = metaMap[node.type];

  // 专属属性（Props）渲染器
  const renderPropsPanel = () => {
    // 过滤掉写在 meta.js 里以 style. 开头的旧配置（向后兼容）
    const propSetters = meta?.setters.filter(s => !s.name.startsWith('style.')) || [];
    
// return
// 位置： renderPropsPanel  函数最外层
// 它是：把 map 生成的一整批 JSX 数组，返回出去
// 关键点: 后面没有尖括号，只有一个数组, 👉 只返回数据，不渲染页面
// 形象理解: 第一层造好一个个 UI 零件, 第二层把所有零件打包成一箱递出去
    return propSetters.map(config => {//config  本质上就是  meta.setters  数组里的每一项。
      //SetterComponent  就是根据  config.type ，从  setterMap  里拿到的对应组件
      const SetterComponent = setterMap[config.type];
//（最里面）return
// 位置：map 回调函数里面
// 它是：给 map 返回一个 JSX 元素
// 作用:每循环一条 config，就造出一个 UI 小行（一行属性配置）。
// 关键点:它后面紧跟  <div>  → 是 JSX 结构
// 什么时候才算真正渲染？ 必须等到： {renderPropsPanel()} 这一行，把整个零件数组放进最外层组件的 return 里：
      return (
        <div key={config.name} style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: '#666' }}>{config.label}</label>
          <SetterComponent
// 低代码里重新定义了：
// 这里的 node.props 不再是组件传参，而是：
// 当前组件自己的「配置仓库」
// 低代码的底层逻辑
// 画布每一个组件，都被存成一个 JSON 对象（组件树节点）：
 
// js
// // schema: {
//     pageName: "我的第一个页面", // 同步文字
//     root: {
//       id: "root_001",
//       type: "Container", 
//     //   组件属性
//       props: {
//         className: "canvas-root", // 加上你定义的类名
//         style: {
//           padding: "20px",
//           backgroundColor: "#f5f5f5" // 同步你选的灰色背景
//         }
//       },
//     //   子组件数组
//       children: [
//         {
//           id: "btn_001",
//           type: "Button",
//           props: {
//             text: "点击提交", // 同步按钮文字
//             variant: "primary"
//           },
//           children: []
//         }
//       ]
//     }
//   },
// 这里的  props  只是起名沿用了 React 的习惯，本质是：
// 这个组件自己的所有配置项、属性值的容器。


// node.props[config.name] 
// 中括号是对象动态取值：
// 拿  config.name  当key，去  node.props  里找对应的值。
            value={node.props[config.name]}
            options={config.options}
            // onChange 不是点击事件，它是你传给子组件的一个自定义回调函数。
            onChange={(newVal) => {            
// updateProps  就是 Redux 里的 Action Creator（动作创建函数） ,它是一个函数，专门用来生成一个 action 对象。
// dispatch 发出去之后，产生的那个对象才叫 Action
// {
//   type: 'UPDATE_COMPONENT_PROPS',
//   payload: { id, newProps }
// }
// 👉 这个纯对象才叫 Action

//  执行顺序：
// 1. 先执行  updateProps(...)  → 生成一个 action 对象
// 2. dispatch 把这个 action 对象 发给 reducer
// 3. reducer 根据 type 修改全局状态
              dispatch(updateProps({ id: selectedId, newProps: { [config.name]: newVal } }));
            }}
          />
        </div>
      );
    });
  };

//  这是 整个 RightPanel 组件最外层的 return,  这是真正唯一最终渲染到页面的 return
  return (
    <aside className="right-panel" style={{ width: '300px', padding: '15px', borderLeft: '1px solid #ddd', overflowY: 'auto' }}>
      <h3>{meta?.displayName || node.type} 配置</h3>
      
      {/* 专属属性区 */}
      <div className="props-section">
        {renderPropsPanel()}
      </div>

      {/* 通用样式区 */}
      {/*  node = 单个组件的完整信息对象 */}
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