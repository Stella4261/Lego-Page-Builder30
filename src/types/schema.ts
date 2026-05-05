// 1. 定义基础样式接口
export interface ComponentStyle extends React.CSSProperties {
  width?: string | number;
  height?: string | number;
  backgroundColor?: string;
  padding?: string | number;
  margin?: string | number;
  // 专门给 Container 用的 Flex 属性
  display?: 'flex' | 'block' | 'inline-block';
  flexDirection?: 'row' | 'column';
  justifyContent?: 'flex-start' | 'center' | 'space-between' | 'flex-end';
  alignItems?: 'flex-start' | 'center' | 'stretch';
}

// 2. 定义组件的 Props 接口
export interface ComponentProps {
  style?: ComponentStyle;
  className?: string;
  [key: string]: any; // 允许组件有自己独特的 props（如 Button 的 text）
}

// 3. 🎯 核心：定义 AST 节点（虚拟 DOM 节点）
export interface SchemaNode {
  id: string;             // 唯一标识 UUID
  type: string;           // 组件类型，如 'Button', 'Container'
  props: ComponentProps;  // 组件属性
  children?: SchemaNode[];// 子节点，构成树形结构
}

// 5. 定义组件物料元数据 Meta
export interface SetterConfig {
  name: string;
  label: string;
  type: 'InputSetter' | 'SelectSetter' | 'ColorSetter' | 'NumberSetter' | 'RadioGroupSetter';
  options?: Array<{ label: string; value: string }>;
}

export interface ComponentMeta {
  type: string;
  displayName: string;
  setters: SetterConfig[];
  defaultProps?: ComponentProps;
}
export interface PageSchema {
  pageName: string;
  root: SchemaNode;
}

//把一个页面包装成一条记录
export interface PageItem {
  id: string;
  name: string;
  schema: PageSchema;//绑定上面定义的页面结构  PageSchema 
}

//页面模块根状态
export interface PageState {
  pages: PageItem[]; //所有页面列表，数组支持多页面管理（编辑器可以创建/切换多个页面）
  currentPageId: string; //当前正在编辑的页面ID，用来定位当前页面
  selectedId: string | null; //selectedId ：画布中选中的组件ID
}

export interface RootState {
  page: {
    present: PageState;
    past: PageState[];
    future: PageState[];
  };
}