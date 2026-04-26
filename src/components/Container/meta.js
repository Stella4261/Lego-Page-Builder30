export const ContainerMeta = {
  type: 'Container',
  displayName: '📦 Flex 容器',
  setters: [
    {
      name: 'style.flexDirection',
      label: '排列方向',
      type: 'SelectSetter',
      options: [
        { label: '水平排列 (Row)', value: 'row' },
        { label: '垂直排列 (Column)', value: 'column' }
      ]
    },
    {
      name: 'style.justifyContent',
      label: '主轴对齐',
      type: 'SelectSetter',
      options: [
        { label: '起点对齐 (flex-start)', value: 'flex-start' },
        { label: '居中对齐 (center)', value: 'center' },
        { label: '两端对齐 (space-between)', value: 'space-between' }
      ]
    },
    {
      name: 'style.alignItems',
      label: '交叉轴对齐',
      type: 'SelectSetter',
      options: [
        { label: '起点对齐 (flex-start)', value: 'flex-start' },
        { label: '居中 (center)', value: 'center' },
        { label: '拉伸 (stretch)', value: 'stretch' }
      ]
    },
    { name: 'style.backgroundColor', label: '背景颜色', type: 'ColorSetter' }
  ]
};
