import type { ComponentMeta } from '../../types/schema';

export const ImageMeta: ComponentMeta = {
  type: 'Image',
  displayName: '🖼 图片',
  setters: [
    { name: 'src', label: '图片地址', type: 'InputSetter' },
    { name: 'alt', label: '图片描述', type: 'InputSetter' },
    { name: 'style.width', label: '宽度', type: 'InputSetter' },
    { name: 'style.height', label: '高度', type: 'InputSetter' },
    { name: 'style.borderRadius', label: '圆角', type: 'NumberSetter' },
    { name: 'style.objectFit', label: '填充方式', type: 'SelectSetter', options: [
      { label: '填充', value: 'cover' },
      { label: '适应', value: 'contain' },
      { label: '拉伸', value: 'fill' }
    ]}
  ]
};