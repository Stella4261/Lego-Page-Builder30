import InputSetter from './InputSetter'; // 对应你的 InputSetter.jsx
import SelectSetter from './SelectSetter';
import ColorSetter from './ColorSetter';
import RadioGroupSetter from './RadioGroupSetter';
import NumberSetter from './NumberSetter';


// 这5个 Setter 就是五种现成的输入模板：
// 右侧样式面板要用哪种输入方式，直接调用对应的模板就行，不用自己从零写输入框。

export const setterMap = {
  InputSetter,    
  SelectSetter,
  ColorSetter,
  RadioGroupSetter,
  NumberSetter
};