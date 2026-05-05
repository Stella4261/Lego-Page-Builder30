import type { ComponentProps } from '../../types/schema';
// TS 接口，用来约束组件能接收哪些参数、是什么类型：
// 1.  text: string 
// - 必传
// - 按钮显示的文字，必须是字符串
// 2.  variant?: 'primary' | 'default' 
// -  ?  代表可选不传
// - 只能传固定两个值： primary  /  default ，用来区分按钮主题色
// 3.  style?: React.CSSProperties 
// - 可选
// - 接收 React 行内样式对象（和普通 button 的 style 写法一致）

interface ButtonProps extends ComponentProps {
  text: string;
  variant?: 'primary' | 'default';
}
  // React.CSSProperties  是 React 内置的 TS 类型，专门用来约束 JSX 行内 style 对象 的类型。
//   ① 属性强制驼峰
// 和普通 CSS 不一样：
// - CSS： background-color、font-size、border-radius 
// - React Style： backgroundColor、fontSize、borderRadius 

// ② 自动类型校验
// - 宽高、间距：传字符串  '10px' / '2rem' 
// - 颜色： '#fff' / 'red' 
// - 错误写法会直接红线报错，杜绝样式写错。

// 必须在参数里接收 style 属性！
// style: incomingStyle
// 把外部传进来的  style  改名叫  incomingStyle ，方便区分：
// -  baseStyle ：组件内部写好的默认基础样式
// -  incomingStyle ：外部使用者传进来的自定义样式

export default function Button({ text, variant = 'default', style }: ButtonProps) {
  const variantClass = variant === 'primary' ? 'custom-button-primary' : 'custom-button-default';
  //组件里的 return，就是渲染出口
  return (
    // 关键：用传入的 incomingStyle 覆盖默认样式
    <button 
      className={`custom-button ${variantClass}`} 
      style={style}
    >
      {text}
    </button>
  );
}