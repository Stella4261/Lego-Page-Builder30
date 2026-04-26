import React from 'react';

export default function RadioGroupSetter({ value, onChange, options = [] }) {
  // 生成随机 name，确保多组 Radio 互不干扰
  const groupName = React.useId(); 

  return (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      {options.map(opt => (
        <label key={opt.value} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '13px', color: '#555' }}>
          <input
            type="radio"
            name={groupName}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            style={{ marginRight: '6px', cursor: 'pointer' }}
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}