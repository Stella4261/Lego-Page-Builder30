import React from 'react';

interface ImageProps {
  src?: string;
  alt?: string;
  style?: React.CSSProperties;
}

export default function Image({ src, alt, style }: ImageProps) {
  if (!src) {
    return (
      <div style={{
        width: style?.width || '100%',
        height: style?.height || '120px',
        backgroundColor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#999',
        fontSize: '13px',
        border: '1px dashed #ccc',
        ...style
      }}>
        🖼 请输入图片地址
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt || ''}
      style={{
        display: 'block',
        maxWidth: '100%',
        ...style
      }}
    />
  );
}