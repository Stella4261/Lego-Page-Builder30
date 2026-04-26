export const ButtonMeta = {
  type: 'Button',
  displayName: '按钮',
  setters: [
    { name: 'text', label: '按钮文字', type: 'InputSetter' },
    { name: 'variant', label: '内置主题', type: 'SelectSetter', options: [
        { label: '主色调 (Primary)', value: 'primary' },
        { label: '默认白 (Default)', value: 'default' }
    ]},
    // 样式配置块
    { name: 'style.backgroundColor', label: '背景颜色', type: 'ColorSetter' },
    { name: 'style.color', label: '文字颜色', type: 'ColorSetter' },
    { name: 'style.borderRadius', label: '圆角 (px)', type: 'NumberSetter' },
    { name: 'style.width', label: '宽度 (px/%)', type: 'InputSetter' },
    { name: 'style.height', label: '高度 (px)', type: 'InputSetter' },
    { name: 'style.marginTop', label: '上边距 (px)', type: 'NumberSetter' }
  ]
};