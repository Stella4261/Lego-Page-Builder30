import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setSelectedId, deleteNode, duplicateNode, 
  moveNodeUp, moveNodeDown 
} from '../../store/pageSlice';

export default function EditWrapper({ node, children }) {
  const dispatch = useDispatch();
  const selectedId = useSelector((state) => state.page.present.selectedId);
  const isSelected = node.id === selectedId;
  const [contextMenu, setContextMenu] = useState(null);

  const handleClick = (e) => {
    e.stopPropagation();
    dispatch(setSelectedId(node.id));
  };

  const handleDelete = (e) => {
    e?.stopPropagation();
    dispatch(deleteNode({ id: node.id }));
    dispatch(setSelectedId(null));
    setContextMenu(null);
  };

  const handleDuplicate = (e) => {
    e?.stopPropagation();
    dispatch(duplicateNode({ id: node.id }));
    setContextMenu(null);
  };

  const handleMoveUp = (e) => {
    e?.stopPropagation();
    dispatch(moveNodeUp({ id: node.id }));
    setContextMenu(null);
  };

  const handleMoveDown = (e) => {
    e?.stopPropagation();
    dispatch(moveNodeDown({ id: node.id }));
    setContextMenu(null);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(setSelectedId(node.id));
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    if (!contextMenu) return;
    const close = () => setContextMenu(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [contextMenu]);

  return (
    <div
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      style={{
        position: 'relative',
        outline: isSelected ? '2px solid #1677ff' : '1px solid transparent',
        transition: 'outline 0.15s',
        cursor: 'pointer',
      }}
    >
      {/* 选中时顶部工具栏 */}
      {isSelected && (
        <div style={{
          position: 'absolute',
          top: '-28px',
          left: '0',
          backgroundColor: '#1677ff',
          color: '#fff',
          fontSize: '12px',
          padding: '2px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 100,
          borderTopLeftRadius: '4px',
          borderTopRightRadius: '4px',
          whiteSpace: 'nowrap',
          userSelect: 'none',
        }}>
          <span style={{ fontWeight: 'bold' }}>{node.type}</span>
          <span style={iconBtn} onClick={handleMoveUp} title="上移">↑</span>
          <span style={iconBtn} onClick={handleMoveDown} title="下移">↓</span>
          <span style={iconBtn} onClick={handleDuplicate} title="复制">📋</span>
          <span 
            style={{ ...iconBtn, color: '#ffb3b3' }} 
            onClick={handleDelete} 
            title="删除"
          >✕</span>
        </div>
      )}

      {children}

      {/* 右键菜单 */}
      {contextMenu && (
        <div style={{
          position: 'fixed',
          top: contextMenu.y,
          left: contextMenu.x,
          backgroundColor: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: '6px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          zIndex: 9999,
          overflow: 'hidden',
          minWidth: '140px',
        }}>
          {[
            { label: '↑ 上移', action: handleMoveUp },
            { label: '↓ 下移', action: handleMoveDown },
            { label: '📋 复制', action: handleDuplicate },
            { label: '🗑 删除', action: handleDelete, danger: true },
          ].map((item) => (
            <div
              key={item.label}
              onClick={item.action}
              onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              style={{
                padding: '9px 16px',
                cursor: 'pointer',
                fontSize: '13px',
                color: item.danger ? '#ff4d4f' : '#333',
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
const iconBtn = {
  cursor: 'pointer',
  padding: '1px 3px',
  borderRadius: '3px',
};