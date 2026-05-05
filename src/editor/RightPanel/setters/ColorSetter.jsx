// ColorSetter：选颜色专用，点开拾色器挑颜色，自动返回颜色代码。
export default function ColorSetter({ value, onChange }) {
  return (
    <div className="setter-color">
      <input
        type="color"
        className="setter-color-input"
        value={value || '#000000'}
        onChange={(e) => onChange(e.target.value)}
      />
      <span className="setter-color-label">{value || '默认颜色'}</span>
    </div>
  );
}