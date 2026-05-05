import pageReducer, { addNode, deleteNode, setSelectedId } from '../store/pageSlice';

const initialState = {
  pages: [{
    id: 'page_001',
    name: '页面一',
    schema: {
      pageName: '页面一',
      root: {
        id: 'root_001',
        type: 'Container',
        props: {},
        children: []
      }
    }
  }],
  currentPageId: 'page_001',
  selectedId: null,
};

describe('pageSlice', () => {
  test('setSelectedId 能正确设置选中组件', () => {
    const state = pageReducer(initialState, setSelectedId('btn_001'));
    expect(state.selectedId).toBe('btn_001');
  });

  test('setSelectedId 传 null 能取消选中', () => {
    const withSelected = { ...initialState, selectedId: 'btn_001' };
    const state = pageReducer(withSelected, setSelectedId(null));
    expect(state.selectedId).toBeNull();
  });

  test('deleteNode 能删除指定组件', () => {
    const withChild = {
      ...initialState,
      pages: [{
        ...initialState.pages[0],
        schema: {
          ...initialState.pages[0].schema,
          root: {
            ...initialState.pages[0].schema.root,
            children: [{ id: 'btn_001', type: 'Button', props: {}, children: [] }]
          }
        }
      }]
    };
    const state = pageReducer(withChild, deleteNode({ id: 'btn_001' }));
    expect(state.pages[0].schema.root.children).toHaveLength(0);
  });
});