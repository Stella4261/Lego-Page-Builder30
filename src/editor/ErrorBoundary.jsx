import React from 'react';
// 这是React 类组件实现的错误边界
// 作用：捕获子组件渲染、生命周期、构造函数里的 JS 报错，防止整个页面白屏崩溃，兜底展示错误提示，还能点击重试。

export default class ErrorBoundary extends React.Component {
//   constructor(props) ：类组件构造函数，接收父组件传的  props 
//   super(props) ：必须写，调用父类  React.Component  的构造函数，才能用  this.props 
//   this.state ：组件内部状态
//   hasError: false ：标记是否出错，默认没出错
//   error: null ：存储错误对象，默认空
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

//  这是 React 专属错误边界静态方法，只有类组件能用，函数组件没有
//  作用：子组件报错时自动触发，自动捕获错误
//  参数  error ：捕获到的原生错误对象（包含错误信息、堆栈）
//  返回值会合并到 state：  把  hasError  设为  true  标记出错
//                         把错误对象存到  state.error  里供页面展示
  static getDerivedStateFromError(error) {  //必须静态方法，捕获错误并更新 state
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-title">⚠️ 该组件渲染出错</div>
             <div className="error-boundary-msg">{this.state.error?.message}</div>

          {/* 重试按钮逻辑 */}
          
{/* 点击按钮手动重置 state：把  hasError  改回  false 、清空  error 
    重置后会重新走 render，重新渲染子组件，实现重试效果 */}
          <button className="error-boundary-btn" onClick={() => this.setState({ hasError: false })}>
            重试
          </button>
        </div>
      );
    }
    return this.props.children;// 没出错，正常渲染子组件
  }
}