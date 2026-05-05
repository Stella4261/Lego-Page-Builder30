import {configureStore} from '@reduxjs/toolkit';
import pageReducer from './pageSlice';
import undoable from 'redux-undo';

// src/store/index.js ： 它不是数据本身，而是： 用来创建 Redux 仓库的配置文件
//它的作用只有一个：用 Redux 提供的方法，创建一个全局唯一的store

//调用  configureStore  创建 store 实例
//reducer  里面是所有模块的注册区
export const store = configureStore({
// reducer: {
//   page: xxx
// }
// 等于在大仓库里，开辟了一块命名为 page 的专属空间。
// 将来所有数据都挂在： state.page
    reducer:{
// 用 pageReducer 管理一块叫 page 的数据区域
// 这个区域一开始是 initialState , 之后每次修改，都是 pageReducer 根据 action 更新这块数据
// 所以： pageReducer 是管理员，不是数据本身。
//  pageReducer  就是你  pageSlice.reducer 
// 它的职责：
// - 定义 page 这块区域初始数据长什么样（initialState）
// - 接收各种 action（addNode、moveNode、addPage...）
// - 根据 action 修改 page 区域的数据
        page:undoable(pageReducer,{
            limit:30, // 最多保存30条操作记录
        })
// undoable 包装
// 把 pageReducer 包了一层壳，用来做撤销/重做。
// 被  undoable()  包装后，原来 page 的原始数据，被自动塞进了  present  里
// 结构变成：
// state.page = {
//   past: [...历史操作记录],
//   present: { 这里才是你真正的 initialState 数据 },
//   future: [...重做记录]
// }
// 所以取值必须写：
// state.page.present.pages
// state.page.present.currentPageId

// present 不是你定义的，是 undoable 强行给你加上的固定结构
 
    },
});

// 完整层级结构图
 
// plaintext
  
// store 全局大仓库
// └── page 分区
//     ├── past      （撤销历史）
//     ├── present   【真正业务数据】
//     │    ├── pages: []
//     │    ├── currentPageId
//     │    └── selectedId
//     └── future    （重做历史）