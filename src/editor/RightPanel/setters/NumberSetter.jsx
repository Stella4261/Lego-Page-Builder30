// NumberSetter： 改尺寸专用（宽、高、字号、边距、圆角），只输数字，自动帮你补  px/rem  单位。

// 解构默认值（重点）
// 语法： { suffix = 'px' , options = [] } 
// - meta 配置里有这个字段 → 用配置传过来的值
// - meta 里没写这个字段 → 用参数上给的默认值兜底
// 不用每个配置都重复写，防报错、省代码。

export default function NumberSetter({ value, onChange, suffix = 'px' }) {
  const numValue = value ? parseInt(value) : '';
  return (
    <div className="setter-number">
      <input
        type="number"
        className="setter-number-input"
        value={numValue}
        onChange={(e) => {
          const val = e.target.value;
          onChange(val === '' ? undefined : `${val}${suffix}`);
        }}
      />
      <span className="setter-number-suffix">{suffix}</span>
    </div>
  );
}