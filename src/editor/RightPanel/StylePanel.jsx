import { useDispatch } from 'react-redux';
import { updateProps } from '../../store/pageSlice'; 
import { metaMap } from '../../components'; 
import { setterMap } from './setters'; 



// 最简单流程
// 1. 传进来  node、selectedId 
// 2. 根据组件类型拿它的配置说明书
// 3. 筛选出所有样式配置
// 4. 遍历样式配置，自动匹配对应输入框（Input/选择器）
// 5. 把当前样式值塞进去做回显
// 6. 你一改 → 触发  handleStyleChange 
// 7. 组装新 style → dispatch 更新 Redux
// 8. 全局状态更新 → 页面组件样式自动变
 


// node ：当前选中组件完整信息（type / props / style）
// selectedId ：当前组件唯一 id，用来更新状态时定位
export default function StylePanel({ node, selectedId }) {
  const dispatch = useDispatch();

  if (!node) return null;

  //获取组件元配置
  const componentMeta = metaMap[node.type];

  // 核心逻辑：筛选出所有属于样式属性的配置
  const styleConfigs = componentMeta?.setters?.filter(config => 
    config.target === 'style' || 
    (config.name && config.name.startsWith('style.'))
  ) || [];

  //样式改变统一处理函数
// 1. 把  style.width  这种前缀去掉，只留  width 
// 2. 把旧样式保留，只覆盖当前改的这一项
// 3. 调用  updateProps  去 Redux 里更新这个组件的 style
  const handleStyleChange = (config, newValue) => {
    // 自动识别 key 名：优先取 propName，否则处理 name 字符串
    const rawKey = config.propName || config.name;
    const key = rawKey.replace('style.', '');

    //一次只改一个
    dispatch(updateProps({
      id: selectedId,
      newProps: {
        style: {
          ...(node.props.style || {}), // 加上默认空对象防止报错
          [key]: newValue  
// [key] 是什么？这叫 JS 对象动态属性名
// 但如果属性名存在变量 key 里，就要用方括号：[key]: newValue
// 等价于： 如果 key 是  "width"  → 变成  width: newValue 
//          如果 key 是  "color"  → 变成  color: newValue 
        }
      }
    }));
  };

  //第一个 return：整个  StylePanel  组件的返回，返回整个样式面板 JSX
  return (
    <div className="style-panel" style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
      <h4 style={{ color: '#333', marginBottom: '10px' }}>🎨 通用样式</h4>
      
      {/* 没有样式配置就提示 */}
      {styleConfigs.length === 0 && <p style={{ color: '#999', fontSize: '12px' }}>该组件暂无样式配置</p >}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {/* 循环遍历所有样式配置，自动批量生成一行一行的样式设置项。 */}
        {styleConfigs.map(config => {
          // 兼容 setterType 和 type 两种写法
          const typeName = config.setterType || config.type;
          const Setter = setterMap[typeName];

          if (!Setter) return null;

          const rawKey = config.propName || config.name;
          const key = rawKey.replace('style.', '');

          //第二个 return： map  遍历回调函数里的 return，每次循环返回一个「单个样式设置项」JSX
          return (
            <div key={rawKey}>
              <label style={{ fontSize: '12px', color: '#666', display: 'block' }}>{config.label}</label>
              <Setter 
                {...config}

          // node.props.style  当前组件所有行内样式对象
          // [key]  动态取对应的样式字段，比如  width 、 color
                value={node.props.style?.[key]}  // 回显当前样式值  , 把现在已有的样式值，塞给输入框，让它显示出来
                onChange={(val) => handleStyleChange(config, val)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}