export const ButtonMeta = {
  type: 'Button', //type ：组件唯一标识，内部用来识别是哪个组件
  displayName: '按钮', //displayName ：编辑器左侧组件库、画布上展示的中文名称
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


// 1. Meta 写配置
// name: 'text'
// name: 'variant'
// name: 'style.backgroundColor'
// 2. 引擎根据 meta 生成 props 对象  ----是根据 右侧编辑器 用户配置的值 + meta 的name路径 生成的
// 平台拼出：
// {
//   text: '用户输入的文字',
//   variant: 'primary',
//   style: { backgroundColor: '#fff' }
// }
// 3. 组件接收 props
// function Button({ text, variant, style }: ButtonProps) {
//   // 这里的 text/variant/style 就是引擎传过来的
// }
//  