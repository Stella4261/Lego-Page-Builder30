import React from 'react';

export default function InputSetter({ value, onChange }) {
  return (
    <input
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: '6px',
        border: '1px solid #ddd',
        borderRadius: '4px'
      }}
    />
  );
}