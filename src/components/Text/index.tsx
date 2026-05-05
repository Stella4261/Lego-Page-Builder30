import type { ComponentProps } from '../../types/schema';

interface TextProps extends ComponentProps {
  text?: string;
}

export default function Text({ text, style }: TextProps) {
  return (
    <span className="custom-text" style={style}>
      {text}
    </span>
  );
}