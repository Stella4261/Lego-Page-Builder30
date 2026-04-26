import React from 'react';

interface ButtonProps {
  text: string;
  variant?: 'primary' | 'default';
  style?: React.CSSProperties;
}

// 必须在参数里接收 style 属性！
export default function Button({ text, variant, style: incomingStyle }:ButtonProps) {
  const baseStyle = {
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    border: 'none',
    backgroundColor: variant === 'primary' ? '#1677ff' : '#eee',
    color: variant === 'primary' ? '#fff' : '#333',
  };

  return (
    // 关键：用传入的 incomingStyle 覆盖默认样式
    <button style={{ ...baseStyle, ...incomingStyle }}>
      {text}
    </button>
  );
}