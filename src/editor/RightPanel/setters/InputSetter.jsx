// InputSetter 是个纯中间包装壳：

// - 接收父给的默认值 → 显示到 input
// - 监听 input 输入变化
// - 把最新输入的字符串抛回给父组件
 
// 它不处理逻辑、不修改样式、不操作 Redux，只负责：展示值 + 把新值往外抛。



// 函数参数：{ value, onChange }
// 这俩不是自己凭空来的，是父组件  <Setter>  给它传过来的。
//   value ：父组件传给它要回显的默认值
//   onChange ：父组件传给它一个回调函数，等着接收新值
export default function InputSetter({ value, onChange }) {
  return (
    <input
      value={value || ''}
// 最左边  onChange ： 是 HTML 原生 input 事件：监听输入框内容有没有变化。
// 箭头函数里的  onChange(e.target.value) ：是 函数入参解构出来的那个 onChange = 父给的回调。
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