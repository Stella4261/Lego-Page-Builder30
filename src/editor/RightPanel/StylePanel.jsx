import React from 'react';
import { useDispatch } from 'react-redux';

// 1. 回退两级到 src，然后进入 store 找 pageSlice (注意没有 s)
import { updateProps } from '../../store/pageSlice'; 

// 2. 回退两级到 src，然后进入 components
import { metaMap } from '../../components'; 

// 3. setters 就在 RightPanel 目录下，和 StylePanel 是平级兄弟，所以用 ./
import { setterMap } from './setters'; 

export default function StylePanel({ node, selectedId }) {
  const dispatch = useDispatch();

  if (!node) return null;

  const componentMeta = metaMap[node.type];

  // 核心逻辑：筛选出所有属于样式属性的配置
  const styleConfigs = componentMeta?.setters?.filter(config => 
    config.target === 'style' || 
    (config.name && config.name.startsWith('style.'))
  ) || [];

  const handleStyleChange = (config, newValue) => {
    // 自动识别 key 名：优先取 propName，否则处理 name 字符串
    const rawKey = config.propName || config.name;
    const key = rawKey.replace('style.', '');

    dispatch(updateProps({
      id: selectedId,
      newProps: {
        style: {
          ...(node.props.style || {}), // 加上默认空对象防止报错
          [key]: newValue
        }
      }
    }));
  };

  return (
    <div className="style-panel" style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
      <h4 style={{ color: '#333', marginBottom: '10px' }}>🎨 通用样式</h4>
      
      {styleConfigs.length === 0 && <p style={{ color: '#999', fontSize: '12px' }}>该组件暂无样式配置</p >}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {styleConfigs.map(config => {
          // 兼容 setterType 和 type 两种写法
          const typeName = config.setterType || config.type;
          const Setter = setterMap[typeName];

          if (!Setter) return null;

          const rawKey = config.propName || config.name;
          const key = rawKey.replace('style.', '');

          return (
            <div key={rawKey}>
              <label style={{ fontSize: '12px', color: '#666', display: 'block' }}>{config.label}</label>
              <Setter 
                {...config}
                value={node.props.style?.[key]} 
                onChange={(val) => handleStyleChange(config, val)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}