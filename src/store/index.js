import {configureStore} from '@reduxjs/toolkit';
import pageReducer from './pageSlice';
import undoable from 'redux-undo';

// src/store/index.js ： 它不是数据本身，而是： 用来创建 Redux 仓库的配置文件
//它的作用只有一个：用 Redux 提供的方法，创建一个全局唯一的store

//调用  configureStore  创建 store 实例
//reducer  里面是所有模块的注册区
//page: pageReducer  的意思是：把 pageSlice 的状态，挂到全局 state 的  page  节点上
export const store = configureStore({
    reducer:{
// 用  pageReducer  管理一块叫 page 的数据区域
// 这个区域一开始是  initialState , 之后每次修改，都是  pageReducer  根据 action 更新这块数据
// 所以： pageReducer 是管理员，不是数据本身。
        // page:pageReducer,

        page:undoable(pageReducer,{
            limit:30, // 最多保存30条操作记录
        })
    },
});

