import React from 'react';

interface TextProps {
  text?: string;
  style?: React.CSSProperties;
}

// 接收 style 参数
export default function Text({ text, style }:TextProps) {
  return (
    <span style={{ display: 'inline-block', fontSize: '14px', color: '#333', ...style }}>
      {text}
    </span>
  );
}