import InputSetter from './InputSetter'; // 对应你的 InputSetter.jsx
import SelectSetter from './SelectSetter';
import ColorSetter from './ColorSetter';
import RadioGroupSetter from './RadioGroupSetter';
import NumberSetter from './NumberSetter';

export const setterMap = {
  InputSetter,     // 这里改了，Renderer 才能找到它
  SelectSetter,
  ColorSetter,
  RadioGroupSetter,
  NumberSetter
};