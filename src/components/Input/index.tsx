//页面上真实的输入框组件
//{ placeholder }：从外面传进来的属性

interface InputProps {
  placeholder?: string;
  style?: React.CSSProperties;
}

export default function Input({ placeholder, style }:InputProps) {
  return (
    <input 
      placeholder={placeholder} 
      style={{ padding: '4px 8px', ...style }} // 确保 style 被应用
    />
  );
}