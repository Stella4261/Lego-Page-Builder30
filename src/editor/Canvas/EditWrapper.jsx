import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedId, deleteNode, duplicateNode, moveNodeUp, moveNodeDown } from '../../store/pageSlice';

//这个  EditWrapper 
//它是低代码画布里所有组件的统一外包装壳。
//你拖到画布上的按钮、输入框、文本、容器……外面全部自动包一层这个组件，
// 专门管「选中、高亮、工具栏、右键菜单、删/复/移动组件」，不负责渲染组件本身的内容。
export default function EditWrapper({ node, children }) {
  const dispatch = useDispatch();
  const selectedId = useSelector((state) => state.page.present.selectedId);
  const isContainer = node.type === 'Container';
  const isSelected = node.id === selectedId; // 判断：当前这个组件是不是被选中
// contextMenu ：状态变量，存右键菜单的信息
// setContextMenu ：修改这个状态的函数
// useState(null) ：初始默认值是  null ，null  在这里的含义代表：右键菜单默认不显示
  const [contextMenu, setContextMenu] = useState(null);

  //左键点击选中
  const handleClick = (e) => {
    e.stopPropagation(); //阻止事件冒泡，防止点击组件时，事件往上飘被画布空白层捕获
    dispatch(setSelectedId(node.id)); //派发 Redux：把当前组件 id 设为全局选中 id
  };

  //删除组件
  const handleDelete = (e) => {
    e?.stopPropagation();
    dispatch(deleteNode({ id: node.id })); //通知 Redux 删除当前节点
    dispatch(setSelectedId(null));//清空选中状态
    setContextMenu(null);
  };
 
  //复制/克隆组件
  const handleDuplicate = (e) => {
    e?.stopPropagation();
    dispatch(duplicateNode({ id: node.id }));
    setContextMenu(null); //关闭右键菜单
  };

  //上移 / 下移 调整层级
  const handleMoveUp = (e) => {
    e?.stopPropagation();
    dispatch(moveNodeUp({ id: node.id }));
    setContextMenu(null); // 操作后自动关闭右键菜单
  };

  const handleMoveDown = (e) => {
    e?.stopPropagation();
    dispatch(moveNodeDown({ id: node.id }));
    setContextMenu(null);
  };

  // 右键唤起自定义菜单
  const handleContextMenu = (e) => {
    e.preventDefault(); //禁用浏览器原生右键菜单
    e.stopPropagation();
    dispatch(setSelectedId(node.id));
    setContextMenu({ x: e.clientX, y: e.clientY }); //记录鼠标坐标，用来定位自定义右键菜单
  };

  //右键菜单弹出后，点击页面任意空白处，自动关闭菜单
  useEffect(() => {
  // 1. 前置判断：菜单没打开时，直接退出，不执行后续逻辑
  if (!contextMenu) return;

  // 2. 定义关闭菜单的核心函数：重置状态，让菜单消失
  const close = () => setContextMenu(null);

  // 3. 给全局window绑定点击事件：监听整个页面的所有点击
  window.addEventListener('click', close);

  // 4. 副作用清理函数：移除事件监听，避免内存泄漏/重复绑定
  return () => window.removeEventListener('click', close);

// 5. 依赖数组：只有contextMenu变化时，才重新执行副作用
}, [contextMenu]);

  return (

    <div
  // 左键单击事件
  onClick={handleClick}
  // 鼠标右键事件
  onContextMenu={handleContextMenu}
   className={`edit-wrapper ${isContainer ? 'edit-wrapper--block' : 'edit-wrapper--inline'}`}
      style={{
        // 只保留动态样式
        outline: isSelected ? '2px solid #1677ff' : '1px solid transparent',
      }}
    >
      {/* 选中时顶部工具栏 */}
      {/* {isSelected && (...)}  核心
    isSelected  为  true （组件被选中）→ 渲染里面整个工具栏
    isSelected  为  false （没选中）→ 直接什么都不渲染，工具栏消失
一句话：只有选中组件，才显示顶部操作栏；不选中就完全隐藏。 */}

{/* 用了 绝对定位  position: absolute 
    父容器有  position: relative 
    所以这个盒子死死贴在当前组件的最头顶上方，悬浮显示，不占正常文档流，不会把页面挤乱。 */}
      {isSelected && (
        <div className="edit-wrapper-toolbar">
          <span className="edit-wrapper-toolbar-name">{node.type}</span>
          <span className="edit-wrapper-toolbar-btn" onClick={handleMoveUp} title="上移">↑</span>
          <span className="edit-wrapper-toolbar-btn" onClick={handleMoveDown} title="下移">↓</span>
          <span className="edit-wrapper-toolbar-btn" onClick={handleDuplicate} title="复制">📋</span>
          <span className="edit-wrapper-toolbar-btn edit-wrapper-toolbar-btn--danger" onClick={handleDelete} title="删除">✕</span>
        </div>
      )}

{/* EditWrapper  是外壳容器
  children  就是被你包裹在里面的真正组件，比如按钮、输入框、文本、容器……
作用：外壳只管选中、高亮、顶部工具栏、右键菜单；真正要渲染的页面内容，全部放在  {children}  这里显示。 */}
      {children}

      {/* 右键菜单 */}
      {/* {contextMenu && (...)} 
           React 条件渲染： contextMenu  有值（右键点击了组件，存了鼠标坐标）→ 显示右键菜单
                           contextMenu  是  null  → 菜单直接不渲染、看不见 */}

      {contextMenu && (
// 外层 div  fixed 固定定位 
// position: fixed  相对于整个浏览器窗口定位
// 不跟着父组件走，直接固定在鼠标右键点击的屏幕坐标上
// 所以菜单能精准出现在鼠标旁边，不会被父容器限制住。
         <div className="context-menu" style={{ top: contextMenu.y, left: contextMenu.x }}>
          <div className="context-menu-item" onClick={handleMoveUp}>↑ 上移</div>
          <div className="context-menu-item" onClick={handleMoveDown}>↓ 下移</div>
          <div className="context-menu-item" onClick={handleDuplicate}>📋 复制</div>
          <div className="context-menu-item context-menu-item--danger" onClick={handleDelete}>🗑 删除</div>
        </div>
      )}
    </div>
  );
}
