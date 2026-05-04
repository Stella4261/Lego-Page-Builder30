import { createSlice } from '@reduxjs/toolkit';

interface PageSchema {
  pageName: string;
  root: {
    id: string;
    type: string;
    props: Record<string, any>;
    children: any[];
  };
}

interface PageItem {
  id: string;
  name: string;
  schema: PageSchema;
}

interface PageState {
  pages: PageItem[];
  currentPageId: string;
  selectedId: string | null;
}

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


function getCurrentSchema(state: PageState) {
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
    const { parentId, newNode } = action.payload;
    const schema = getCurrentSchema(state);
    if (!schema) return;
    function insertNode(node: any) {
      if (node.id === parentId) {
        node.children.push(newNode);
        return;
      }
      node.children?.forEach(insertNode);
    }
    insertNode(schema.root);
  },
    // 删除节点
    deleteNode: (state, action) => {
      const { id } = action.payload;
      const schema = getCurrentSchema(state);
      if (!schema) return;
      function removeNode(node) {
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

    duplicateNode: (state, action) => {
    const { id } = action.payload;
    const schema = getCurrentSchema(state);
    if (!schema) return;
    function cloneNode(node: any): any {
      return {
        ...node,
        id: `${node.type.toLowerCase()}_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
        children: (node.children || []).map(cloneNode),
        props: { ...node.props }
      };
    }
    function insertClone(node: any): boolean {
      const idx = node.children?.findIndex((c: any) => c.id === id);
      if (idx !== undefined && idx !== -1) {
        const cloned = cloneNode(node.children[idx]);
        node.children.splice(idx + 1, 0, cloned);
        return true;
      }
      return node.children?.some(insertClone) || false;
    }
    insertClone(schema.root);
  },

  moveNode: (state, action) => {
    const { dragId, hoverId } = action.payload;
    if (dragId === hoverId) return;
    const schema = getCurrentSchema(state);
    if (!schema) return;
    function findParentId(node: any, targetId: string): string | null {
      for (const child of node.children || []) {
        if (child.id === targetId) return node.id;
        const found = findParentId(child, targetId);
        if (found) return found;
      }
      return null;
    }
    function findNode(node: any, id: string): any {
      if (node.id === id) return node;
      for (const child of node.children || []) {
        const found = findNode(child, id);
        if (found) return found;
      }
      return null;
    }
    const dragParentId = findParentId(schema.root, dragId);
    const hoverParentId = findParentId(schema.root, hoverId);
    if (!dragParentId || !hoverParentId || dragParentId !== hoverParentId) return;
    const parent = findNode(schema.root, dragParentId);
    if (!parent) return;
    const dragIdx = parent.children.findIndex((c: any) => c.id === dragId);
    const hoverIdx = parent.children.findIndex((c: any) => c.id === hoverId);
    const [removed] = parent.children.splice(dragIdx, 1);
    parent.children.splice(hoverIdx, 0, removed);
  },


  moveNodeUp: (state, action) => {
    const { id } = action.payload;
    const schema = getCurrentSchema(state);
    if (!schema) return;
    function move(node: any): boolean {
      const idx = node.children?.findIndex((c: any) => c.id === id);
      if (idx !== undefined && idx > 0) {
        [node.children[idx-1], node.children[idx]] = [node.children[idx], node.children[idx-1]];
        return true;
      }
      return node.children?.some(move) || false;
    }
    move(schema.root);
  },

   moveNodeDown: (state, action) => {
    const { id } = action.payload;
    const schema = getCurrentSchema(state);
    if (!schema) return;
    function move(node: any): boolean {
      const idx = node.children?.findIndex((c: any) => c.id === id);
      if (idx !== undefined && idx !== -1 && idx < node.children.length - 1) {
        [node.children[idx], node.children[idx+1]] = [node.children[idx+1], node.children[idx]];
        return true;
      }
      return node.children?.some(move) || false;
    }
    move(schema.root);
  },

    loadSchema: (state, action) => {
    const schema = getCurrentSchema(state);
    if (schema) Object.assign(schema, action.payload);
    state.selectedId = null;
  },

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

  switchPage: (state, action) => {
    state.currentPageId = action.payload;
    state.selectedId = null;
  },
 },
})



// 1. 你写的  reducers :是一个对象，里面放你写的修改状态的方法
//作用：告诉 Redux 收到 action 后怎么改数据
// 2. 自动生成的  actions  :是一个对象，里面是和上面同名的方法
//作用：你调用时，把参数包成 action 对象{ type: 'xxx', payload: 你传的东西 }
 
export const {
  setPageName, setSelectedId, updateProps,addNode, deleteNode, duplicateNode,moveNode, moveNodeUp, moveNodeDown,loadSchema, addPage, switchPage
} = pageSlice.actions;
//你写的是方法清单 reducers，导出的是 RTK 自动生成的完整函数 reducer。 导出它，才能在  store  里注册，Redux 才能用
export default pageSlice.reducer;

export const selectCurrentPage = (state: any) => {
  const s = state.page.present;
  return s.pages.find((p: PageItem) => p.id === s.currentPageId);
};

export const selectCurrentSchema = (state: any) => {
  return selectCurrentPage(state)?.schema;
};

export const selectCurrentRoot = (state: any) => {
  return selectCurrentSchema(state)?.root;
};