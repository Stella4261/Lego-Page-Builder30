// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {Provider} from 'react-redux';
import {store} from './store/index';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from  'react-dnd-html5-backend';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import PreviewPage from './preview/PreviewPage';

// src/index.js 是干嘛的？
// 它是 React 的入口，作用：
// - 找到  public/index.html  里的  #root 
// - 把  <App />  组件渲染进去

const rootElement = document.getElementById('root'); 
//const root = ReactDOM.createRoot(dom元素)->让 React 创建一个 根控制器，再由它去渲染
//它的作用是： 接管那个 div，控制整个 React 应用的渲染，开启 React 18 新特性
const root = ReactDOM.createRoot(rootElement);
root.render(
//     2.  store={store}  是什么意思？ 
// 前面的  store → 是 Provider 要求必须传的属性名
//  后面的  store → 是自己在 ./store/index.js 里创建的 Redux 仓库
   <Provider store={store}>
{/* 1. DndProvider
- 来自  react-dnd （拖拽库）
- 意思：拖拽功能的提供者
- 不包这一层，你的组件里不能用拖拽
2. backend={HTML5Backend}
-  backend  是固定属性名
-  HTML5Backend  是底层拖拽引擎
- 作用：让拖拽基于浏览器原生 HTML5 拖放 API 工作 */}
    <DndProvider backend={HTML5Backend}>
      <BrowserRouter>
      <Routes>
        <Route path = "/" element = {<App />}/>
        <Route path = "/preview"  element = {<PreviewPage/>} />
      </Routes>
      </BrowserRouter>
    </DndProvider>
  </Provider>
);