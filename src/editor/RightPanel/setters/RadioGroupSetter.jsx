import React from 'react';
//  RadioGroupSetter：单选按钮，几个选项并排点选，只能选一个（比如左对齐/居中/右对齐）。
export default function RadioGroupSetter({ value, onChange, options = [] }) {
  const groupName = React.useId();
  return (
    <div className="radio-group">
      {options.map(opt => (
        <label key={opt.value} className="radio-label">
          <input
            type="radio"
            className="radio-input"
            name={groupName}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}