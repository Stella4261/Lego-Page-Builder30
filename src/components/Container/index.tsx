import React from 'react';

interface ContainerProps {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;  // children 专用类型
}

const Container = ({ style, className, children, ...props }:ContainerProps) => {
  // 这里就是你想要的“核心重构”逻辑
  const finalStyle = {
    display: 'flex',          // 默认开启 Flex
    minHeight: '60px',        // 防止没内容时看不见
    boxSizing: 'border-box',
    border: '1px dashed #ccc', // 编辑态方便识别
    ...style                  // 接收来自 Redux 的 style 配置（如 flexDirection, padding 等）
  };

  return (
    <div 
      className={className} 
      style={finalStyle}
      {...props} // 转发拖拽相关的 ref 或事件
    >
      {children}
    </div>
  );
};

export default Container;