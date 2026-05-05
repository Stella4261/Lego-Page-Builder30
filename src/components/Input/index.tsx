import type { ComponentProps } from '../../types/schema';

interface InputProps extends ComponentProps {
  placeholder?: string;
}

export default function Input({ placeholder, style }: InputProps) {
  return (
    <input
      placeholder={placeholder}
      className="custom-input"
      style={style}
    />
  );
}