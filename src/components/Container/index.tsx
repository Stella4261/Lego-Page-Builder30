import React from 'react';

interface ContainerProps {
  style?: React.CSSProperties;
  className?: string;
// React.ReactNode 类型：这是 React 中最宽泛的类型。它意味着 children 可以是：
// 普通的文本字符串。
// HTML 标签（如 <div>, <span>）。
// 其他的自定义 React 组件。
// 甚至是这些东西构成的数组，或者是 null、undefined。
  children?: React.ReactNode;  // children 专用类型
}

const Container = ({ style, className, children, ...props }:ContainerProps) => {
  // 这里就是你想要的“核心重构”逻辑
  const finalStyle = {
    display: 'flex',          // 默认开启 Flex
    flexWrap: 'wrap' as const, 
    minHeight: '60px',        // 防止没内容时看不见
    boxSizing: 'border-box',   // 经验设置：防止 padding 把盒子撑爆
    border: '1px dashed #ccc', // 编辑态方便识别
    ...style                  // 接收来自 Redux 的 style 配置（如 flexDirection, padding 等）
  };

  return (
    <div 
      className={className} 
// style={finalStyle as React.CSSProperties}:
// 原因：TS 默认会把 display: 'flex' 推断为普通的 string。
// 断言：通过 as React.CSSProperties，你强行告诉编辑器：“相信我，这符合 CSS 规范”，从而消除了报错。
      style={finalStyle as React.CSSProperties}
      {...props} // 转发拖拽相关的 ref 或事件
    >
      {children}
    </div>
  );
};

export default Container;