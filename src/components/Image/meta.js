export const ImageMeta = {
  type: 'Image',
  displayName: '🖼 图片',
  setters: [
    { name: 'src', label: '图片地址', type: 'InputSetter' },
    { name: 'alt', label: '图片描述', type: 'InputSetter' },
    { name: 'style.width', label: '宽度', type: 'InputSetter' },
    { name: 'style.height', label: '高度', type: 'InputSetter' },
    { name: 'style.borderRadius', label: '圆角', type: 'NumberSetter' },
    { name: 'style.objectFit', label: '填充方式', type: 'SelectSetter', options: [
      { label: '填充 (cover)', value: 'cover' },
      { label: '适应 (contain)', value: 'contain' },
      { label: '拉伸 (fill)', value: 'fill' },
    ]},
    { name: 'style.opacity', label: '透明度 (0~1)', type: 'InputSetter' },
  ]
};