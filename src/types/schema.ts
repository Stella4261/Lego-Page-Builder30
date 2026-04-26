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

// 4. 定义整个页面的 Schema 结构
export interface PageSchema {
  root: SchemaNode;
}

// 5. 定义组件物料元数据 Meta
export interface SetterConfig {
  name: string;
  label: string;
  type: 'InputSetter' | 'SelectSetter' | 'ColorSetter' | 'NumberSetter';
  options?: Array<{ label: string; value: string }>;
}

export interface ComponentMeta {
  type: string;
  displayName: string;
  setters: SetterConfig[];
  defaultProps?: ComponentProps;
}