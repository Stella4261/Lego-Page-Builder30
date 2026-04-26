import React from 'react';

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