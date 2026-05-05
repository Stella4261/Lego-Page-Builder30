import type { ComponentMeta } from '../../types/schema';

export const InputMeta: ComponentMeta = {
  type: 'Input',
  displayName: '输入框',
  setters: [
    { name: 'placeholder', label: '占位提示', type: 'InputSetter' },
    { name: 'style.width', label: '宽度', type: 'InputSetter' },
    { name: 'style.borderColor', label: '边框颜色', type: 'ColorSetter' },
    { name: 'style.backgroundColor', label: '背景色', type: 'ColorSetter' },
    { name: 'style.borderRadius', label: '圆角', type: 'NumberSetter' },
    { name: 'style.fontSize', label: '字体大小', type: 'NumberSetter' }
  ]
};