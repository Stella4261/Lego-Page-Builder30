import type { ComponentMeta } from '../../types/schema';

export const ContainerMeta: ComponentMeta = {
  type: 'Container',
  displayName: '📦 Flex容器',
  setters: [
    { name: 'style.flexDirection', label: '排列方向', type: 'SelectSetter', options: [
      { label: '水平', value: 'row' },
      { label: '垂直', value: 'column' }
    ]},
    { name: 'style.justifyContent', label: '主轴对齐', type: 'SelectSetter', options: [
      { label: '起点', value: 'flex-start' },
      { label: '居中', value: 'center' },
      { label: '两端', value: 'space-between' }
    ]},
    { name: 'style.alignItems', label: '交叉轴对齐', type: 'SelectSetter', options: [
      { label: '起点', value: 'flex-start' },
      { label: '居中', value: 'center' },
      { label: '拉伸', value: 'stretch' }
    ]},
    { name: 'style.backgroundColor', label: '背景颜色', type: 'ColorSetter' },
    { name: 'style.padding', label: '内边距', type: 'InputSetter' }
  ]
};