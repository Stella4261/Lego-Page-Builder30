export const TextMeta = {
  type: 'Text',
  displayName: '文本',
  setters: [
    { name: 'text', label: '文本内容', type: 'InputSetter' },
    // 样式配置块
    { name: 'style.color', label: '文字颜色', type: 'ColorSetter' },
    { name: 'style.fontSize', label: '字号 (px)', type: 'NumberSetter' },
    { name: 'style.fontWeight', label: '字重', type: 'SelectSetter', options: [
        { label: '常规', value: 'normal' },
        { label: '加粗', value: 'bold' }
    ]},
    { name: 'style.textAlign', label: '对齐方式', type: 'RadioGroupSetter', options: [
        { label: '左', value: 'left' },
        { label: '中', value: 'center' },
        { label: '右', value: 'right' }
    ]},
    { name: 'style.margin', label: '外边距', type: 'InputSetter' }
  ]
};