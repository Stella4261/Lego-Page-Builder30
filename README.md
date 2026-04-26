# 🧱 Lego Page Builder

一个基于 React 的低代码可视化页面搭建工具。

## 功能

- 🖱 拖拽放置：从左侧物料库拖拽组件到画布
- ✏️ 属性编辑：右侧面板实时修改组件属性和样式
- ↩ 撤销重做：Ctrl+Z / Ctrl+Y 操作历史
- 📋 复制组件：一键复制当前选中组件
- 🔀 排序：↑↓ 调整同级组件顺序，支持拖拽排序
- 🔍 预览：新窗口纯净预览搭建结果
- 💾 导入/导出：JSON Schema 持久化
- 🔎 画布缩放：50% ~ 150% 自由缩放
- 🛡 错误边界：组件出错不影响整体页面

## 组件物料

| 组件      | 说明                          |
| --------- | ----------------------------- |
| Button    | 按钮，支持主色/默认两种主题   |
| Input     | 输入框，支持边框/背景色自定义 |
| Text      | 文本，支持颜色/字号/对齐方式  |
| Container | Flex 容器，支持嵌套拖拽       |
| Image     | 图片，支持 URL 输入和填充方式 |

## 技术栈

- React 18
- Redux Toolkit + redux-undo
- TypeScript
- react-dnd（HTML5 拖拽）
- Webpack 5 + Babel

## 本地运行

npm install
npm start

## 设计思路

页面结构以 JSON Schema 树形存储在 Redux 中，
Renderer 递归遍历节点树渲染真实组件。
RightPanel 通过读取各组件的 meta 配置自动生成
属性面板，无需为每个组件单独写编辑 UI。
