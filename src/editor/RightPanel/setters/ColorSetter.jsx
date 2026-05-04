// ColorSetter：选颜色专用，点开拾色器挑颜色，自动返回颜色代码。
export default function ColorSetter({ value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <input
        type="color"
        value={value || '#000000'}
        onChange={(e) => onChange(e.target.value)}
        style={{ cursor: 'pointer', padding: '0', width: '30px', height: '30px', border: 'none' }}
      />
      <span style={{ fontSize: '12px', color: '#666' }}>{value || '默认颜色'}</span>
    </div>
  );
}