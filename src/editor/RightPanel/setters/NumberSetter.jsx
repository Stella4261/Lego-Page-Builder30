// NumberSetter： 改尺寸专用（宽、高、字号、边距、圆角），只输数字，自动帮你补  px/rem  单位。

// 解构默认值（重点）
// 语法： { suffix = 'px' , options = [] } 
// - meta 配置里有这个字段 → 用配置传过来的值
// - meta 里没写这个字段 → 用参数上给的默认值兜底
// 不用每个配置都重复写，防报错、省代码。

export default function NumberSetter({ value, onChange, suffix = 'px' }) {
  // 从 '16px' 中提取数字 '16'
  const numValue = value ? parseInt(value) : '';

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <input
        type="number"
        value={numValue}
        onChange={(e) => {
          const val = e.target.value;
          // 如果清空了输入，就传 undefined，否则拼上单位(如 '20px')
          onChange(val === '' ? undefined : `${val}${suffix}`);
        }}
        style={{ width: '100%', padding: '6px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
      />
      <span style={{ marginLeft: '8px', fontSize: '13px', color: '#888' }}>{suffix}</span>
    </div>
  );
}