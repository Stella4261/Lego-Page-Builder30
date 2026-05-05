import React from 'react';
import type { ComponentProps } from '../../types/schema';

interface ImageProps extends ComponentProps {
  src?: string;
  alt?: string;
}

export default function Image({ src, alt, style }: ImageProps) {
  // 如果没有图片地址，显示占位图
  if (!src) {
    const placeholderStyle: React.CSSProperties = {
      width: style?.width || '100%',
      height: style?.height || '120px',
      ...style,
    };

    return (
      <div className="custom-image-placeholder" style={placeholderStyle}>
        🖼 请输入图片地址
      </div>
    );
  }

  // 正常显示图片
  return (
    <img
      src={src}
      alt={alt || ''}
      className="custom-image"
      style={style}
    />
  );
}