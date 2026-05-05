import { createSlice } from '@reduxjs/toolkit';
import type { PageState, PageItem, PageSchema, SchemaNode,RootState } from '../types/schema';

const initialState: PageState = {
  pages: [
    {
      id: 'page_001',
      name: '页面1',
      schema: {
        pageName: '页面1',
        root: {
          id: 'root_001',
          type: 'Container',
          props: {
            className: 'canvas-root',
            style: {
              padding: '20px',
              backgroundColor: '#f5f5f5',
              flexDirection: 'column',  // 默认纵向
            }
          },
          children: [
            {
              id: 'btn_001',
              type: 'Button',
              props: {
                text: '点击提交',
                variant: 'primary'
              },
              children: []
            }
          ]
        }
      }
    }
  ],
  currentPageId: 'page_001',
  selectedId: null,
};

//从整个页面状态中，快速取出当前正在编辑页面的完整 Schema 结构。
function getCurrentSchema(state: PageState) {
//   Array.find ：遍历页面数组，只找匹配的那一个页面
// - 匹配规则：页面的  id  和全局记录的  currentPageId （当前编辑页面ID）相等
// - 找到 → 返回当前页面对象  PageItem 
// - 没找到 → 返回  undefined 
  return state.pages.find(p => p.id === state.currentPageId)?.schema;
}


//创建slice
const pageSlice = createSlice({
  name: 'page', //命名空间，action前会自动加page/
  initialState,
  //reducers:是一个对象，里面是修改状态的方法，每个方法都有一个对应的action类型
  reducers: {
    // 修改页面标题
    //action.payload 是你传进来的数据
//   state 是第一个参数：这个参数是 Redux 自动传进来的，不是你传的， 它代表的就是：当前 Redux 里保存的最新状态数据；
//                      你在方法里直接修改这个  state ，就等于修改全局状态。
    setPageName: (state, action) => {
    const schema = getCurrentSchema(state);
    if (schema) schema.pageName = action.payload;
  },
    // 选中组件
    setSelectedId: (state, action) => {
      state.selectedId = action.payload;
    },

    // 更新属性
// 第二个参数： action
// 就是你  dispatch  发过来的那一条“指令+数据”
// action  里面固定两块：
// 1.  action.type ：动作类型（区分是干啥的）
// 2.  action.payload ：带过来的真实数据（id、newProps）
    updateProps: (state, action) => {
// 在 Redux 里有个规矩：所有要传给 reducer 的业务数据，全都装在  action.payload  里。
// payload 就是：携带的载荷 / 要带过去的数据。
      const { id, newProps } = action.payload;
      const schema = getCurrentSchema(state);
      if (!schema) return;
  //递归查找并更新节点，找到后更新属性，没有找到则继续找子节点
      function updateNode(node) {
      if (node.id === id) {   //node.id:正在检查的这个组件自己的id，id:用户传进来的id，如果相等，说明找到目标组件
          node.props = { ...node.props, ...newProps };  //保留原来的所有属性，只覆盖传过来的新属性
          return;
    }
    //每个子组件都递归调用updateNode函数
    node.children?.forEach(updateNode);
  }
  // 从根节点开始递归查找,第一次调用：传root
  updateNode(schema.root);
},

   //添加节点
    addNode: (state, action) => {
//    派发 action 时要传两个参数：
// -  parentId ：要挂在谁下面（父组件 id）
// -  newNode ：新的组件节点对象（包含 id、type、props、children）
    const { parentId, newNode } = action.payload;
    const schema = getCurrentSchema(state);
    if (!schema) return;
    function insertNode(node: SchemaNode):void { //  any ：任意类型
      if (node.id === parentId) {
        node.children.push(newNode);
        return;
      }
      node.children.forEach(insertNode);
    }
    insertNode(schema.root);
  },

    // 删除节点
    deleteNode: (state, action) => {
      const { id } = action.payload;
      const schema = getCurrentSchema(state);
      if (!schema) return;
      function removeNode(node:SchemaNode):void{
 // filter  会保留 满足条件的孩子
// 条件是： child.id !== id 
// 只要不是要删的，都留下;是要删的，直接过滤掉 = 删除
// ?.  防止没有 children 时报错
//|| []  防止 children 是 undefined，保证永远是数组
        node.children = node.children?.filter(child => child.id !== id) || [];
        node.children.forEach(removeNode);
      }
      removeNode(schema.root);
      //如果你删的组件正好是当前选中的组件,删完之后，选中状态就没用了, 所以把  selectedId  设为 null，取消选中
      if (state.selectedId === id) state.selectedId = null;
    },

    //复制节点
    duplicateNode: (state, action) => {
    const { id } = action.payload;
    const schema = getCurrentSchema(state);
    if (!schema) return;
    //递归克隆节点
    function cloneNode(node:SchemaNode):SchemaNode {
      return {
        ...node,
       //                                              随机4位字符
        id: `${node.type.toLowerCase()}_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,//重新生成唯一 id
        //遍历当前节点的 children，每一个子节点都走一遍 cloneNode，实现整棵子树深度复制。
        children: (node.children || []).map(cloneNode),
        props: { ...node.props }
      };
    }
    //递归查找 + 插入副本
    function insertClone(node: SchemaNode): boolean {  //这个函数执行完必须返回 布尔值 true / false
// findIndex(...)  数组原生方法：遍历数组每一项，满足条件就返回当前下标，全部不满足，返回 -1
      const idx = node.children?.findIndex((c: SchemaNode) => c.id === id);
      if (idx !== undefined && idx !== -1) {
        const cloned = cloneNode(node.children[idx]);
        node.children.splice(idx + 1, 0, cloned); //数组 splice 语法：splice(开始下标, 删除几个, 插入元素)
        return true;
      }
      return node.children?.some(insertClone) || false;
    }
    insertClone(schema.root);
  },

  //拖拽移动节点
  moveNode: (state, action) => {
//  dragId ：正在拖拽的组件ID
//  hoverId ：拖拽悬浮落在哪个组件上的ID
    const { dragId, hoverId } = action.payload;
    if (dragId === hoverId) return;//如果拖拽自己，直接终止，不做任何操作
    const schema = getCurrentSchema(state);
    if (!schema) return;
    //工具函数一：findParentId 递归找父节点ID，功能：传入一个组件  targetId ，找出它直属父节点的 id
    function findParentId(node: SchemaNode, targetId: string): string | null {
      for (const child of node.children || []) {
        if (child.id === targetId) return node.id;
        const found = findParentId(child, targetId);
        if (found) return found;
      }
      return null;
    }
    //工具函数二：findNode 递归按 id 找整个节点对象
    //功能：根据 id，递归在整棵树里找到完整组件节点对象（包含 id、type、props、children）。
    function findNode(node: SchemaNode, id: string): SchemaNode | null {
      if (node.id === id) return node;
      for (const child of node.children || []) {
        const found = findNode(child, id);
        if (found) return found;
      }
      return null;
    }
    // 判断是否【同一个父容器】
    const dragParentId = findParentId(schema.root, dragId);
    const hoverParentId = findParentId(schema.root, hoverId);
    if (!dragParentId || !hoverParentId || dragParentId !== hoverParentId) return;//只允许：同父级内部上下换位，不允许拖到别的容器里。
    // 获取共同父节点 & 两个节点下标
    const parent = findNode(schema.root, dragParentId);
    if (!parent) return;
    const dragIdx = parent.children.findIndex((c: SchemaNode) => c.id === dragId);
    const hoverIdx = parent.children.findIndex((c: SchemaNode) => c.id === hoverId);
    const [removed] = parent.children.splice(dragIdx, 1);//// 从原位置删掉拖拽节点，并取出它
    parent.children.splice(hoverIdx, 0, removed);//// 插入到 hoverIdx 的前面
  },


  //上移节点
  moveNodeUp: (state, action) => {
    const { id } = action.payload;
    const schema = getCurrentSchema(state);
    if (!schema) return;
    function move(node: SchemaNode): boolean {
      const idx = node.children?.findIndex((c: SchemaNode) => c.id === id);
      if (idx !== undefined && idx > 0) {
        // 数组交换写法（解构互换）
        [node.children[idx-1], node.children[idx]] = [node.children[idx], node.children[idx-1]];
        return true;
      }
//  Array.some()  特性：
// 1. 遍历  children  里每一个子节点
// 2. 挨个执行  move(子节点) 
// 3. 只要有一个  move  返回  true ， some  立刻停止遍历，直接返回  true 
// 4. 全部遍历完都没返回 true， some  返回  false 
      return node.children?.some(move) || false;
    }
    move(schema.root);
  },

  //下移节点
   moveNodeDown: (state, action) => {
    const { id } = action.payload;
    const schema = getCurrentSchema(state);
    if (!schema) return;
    function move(node: SchemaNode): boolean {
      const idx = node.children?.findIndex((c: SchemaNode) => c.id === id);
      if (idx !== undefined && idx !== -1 && idx < node.children.length - 1) {
        [node.children[idx], node.children[idx+1]] = [node.children[idx+1], node.children[idx]];
        return true;
      }
      return node.children?.some(move) || false;
    }
    move(schema.root);
  },

  // loadSchema 加载/覆盖页面结构
  // 作用：把导入的 JSON 配置覆盖到当前正在编辑页面的 schema 上，实现导入 JSON 覆盖页面。
  loadSchema: (state, action) => {
    const schema = getCurrentSchema(state);
    // Object.assign(目标, 来源) ：用新对象覆盖原对象的属性
    if (schema) Object.assign(schema, action.payload);
    state.selectedId = null;
  },

  //addPage 新增一个空白页面，自带根容器，自动命名、自动切到新页面、清空选中。
  addPage: (state) => {
    const id = `page_${Date.now()}`;
    state.pages.push({
      id,
      name: `页面${state.pages.length + 1}`,
      schema: {
        pageName: `页面${state.pages.length + 1}`,
        root: {
          id: `root_${Date.now()}`,
          type: 'Container',
          props: { style: { padding: '20px', flexDirection: 'column' } },
          children: []
        }
      }
    });
    state.currentPageId = id;
    state.selectedId = null;
  },

  //切换页面
  switchPage: (state, action) => {
    state.currentPageId = action.payload;
    state.selectedId = null;
  },

  deletePage: (state, action) => {
      if (state.pages.length === 1) return;
         state.pages = state.pages.filter(p => p.id !== action.payload);
      if (state.currentPageId === action.payload) {
         state.currentPageId = state.pages[0].id;
  }
  state.selectedId = null;
},
 },
})

// pageSlice.reducer：仓库用，管怎么改状态
// pageSlice.actions：组件用，管触发改状态

// RTK 自动根据你 reducers 名字，批量生成 action 函数
// 你写：reducers: {
//        addNode: ()=>{},
//       switchPage: ()=>{}
// }
// 它自动生成：pageSlice.actions.addNode()
//            pageSlice.actions.switchPage()
//组件里直接用：ispatch(pageSlice.actions.addNode({ parentId, newNode }))
export const {
  setPageName,deletePage, setSelectedId, updateProps,addNode, deleteNode, duplicateNode,moveNode, moveNodeUp, moveNodeDown,loadSchema, addPage, switchPage
} = pageSlice.actions;
 
// pageSlice.reducer 就是你写的所有 addNode、moveNode、addPage... 一大堆方法合集
// Redux Toolkit 自动把你 reducers 里所有函数打包成标准 reducer
// - 交给 store 注册，用来接收 action、修改 state
// - 配合  redux-undo  包裹后，才多出  past / present / future 
 
// 你永远不会在组件里用它，只给仓库初始化用。
export default pageSlice.reducer;

//拿当前页
export const selectCurrentPage = (state: RootState) => {
  const s = state.page.present; //把 page 仓库的 present 当前状态 别名存到 s
// s.pages ：所有页面的数组  PageItem[] 
// .find(...) ：遍历数组，找出符合条件的那一项
  return s.pages.find((p: PageItem) => p.id === s.currentPageId);
};
//拿当前页的页面结构
export const selectCurrentSchema = (state: RootState) => {
  return selectCurrentPage(state)?.schema;
};
//拿结构里的根容器
export const selectCurrentRoot = (state: RootState) => {
  return selectCurrentSchema(state)?.root;
};