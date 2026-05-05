import React from 'react';
import type { ComponentProps } from '../../types/schema';

interface ContainerProps extends ComponentProps {
  children?: React.ReactNode;
}
// React.ReactNode 类型：这是 React 中最宽泛的类型。它意味着 children 可以是：
// 普通的文本字符串。
// HTML 标签（如 <div>, <span>）。
// 其他的自定义 React 组件。
// 甚至是这些东西构成的数组，或者是 null、undefined。
  

export default function Container({ style, className, children, ...props }: ContainerProps) {
  return (
    <div
      className={`component-container ${className || ''}`}
// style={finalStyle as React.CSSProperties}:
// 原因：TS 默认会把 display: 'flex' 推断为普通的 string。
// 断言：通过 as React.CSSProperties，你强行告诉编辑器：“相信我，这符合 CSS 规范”，从而消除了报错。
      style={style}
      {...props} // 转发拖拽相关的 ref 或事件
    >
      {children}
    </div>
  );
}
