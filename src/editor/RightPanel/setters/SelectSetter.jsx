// SelectSetter：下拉选择框，选项多的时候用，点开列表选一个（比如实线/虚线、字体）。


export default function SelectSetter({ value, options, onChange }) {
  return (
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      style={{ width: '100%', padding: '6px' }}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}