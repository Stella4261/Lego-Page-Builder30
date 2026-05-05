import { useDispatch, useSelector } from 'react-redux'
import { ActionCreators } from 'redux-undo'
import { loadSchema } from '../../store/pageSlice'
import { selectCurrentSchema } from '../../store/pageSlice';

// 这个组件是低代码编辑器顶部工具栏，整合了：撤销/重做、画布缩放、导入JSON、导出JSON、页面预览 全套功能，基于 React + Redux 开发。

// 父组件传进来4个props：
// 1.  zoom ：当前画布缩放比例（如 100、120、80）
// 2.  onZoomIn ：放大画布方法
// 3.  onZoomOut ：缩小画布方法
// 4.  onZoomReset ：重置缩放为100%方法
export default function Toolbar({ zoom, onZoomIn, onZoomOut, onZoomReset }) {
  const dispatch = useDispatch();
// 这是  redux-undo  固定结构：
// state.page.past ：历史操作数组
// 有内容 → 可以撤销
// 长度 >0 →  canUndo = true 
// state.page.future ：撤销后可恢复的操作
// 有内容 → 可以重做
// 长度 >0 →  canRedo = true
  const canUndo = useSelector(state => state.page.past.length > 0)
  const canRedo = useSelector(state => state.page.future.length > 0)
  //  schema ：整个页面的结构（所有组件、嵌套、属性），是一个大对象
  const schema = useSelector(selectCurrentSchema);

  //导出JSON :把页面结构转成JSON字符串 → 包装成文件 → 生成临时地址 → 创建下载链接 → 模拟点击 → 下载到电脑
  const handleExport = () => {
// 第一个参数： schema --要转成 JSON 字符串的 对象/数据
// 第二个参数： null 
// 叫 replacer，可以是：
// - 一个函数：过滤、修改要序列化的内容
// - 一个数组：只保留指定字段
// 这里写  null  的意思就是：不做任何过滤，全部正常转成 JSON。
// 第三个参数： 2 -- 叫 space，表示 缩进空格数
// 作用： 让 JSON 格式化、换行、缩进对齐，变得好看可读。
    const json = JSON.stringify(schema,null,2)
// Blob ：浏览器里表示文件内容的对象
// 把上面那段 json 文本，包装成一个文件
// type: 'application/json' ：告诉浏览器这是 JSON 文件
    const blob = new Blob([json],{type:'application/json'})
    const url = URL.createObjectURL(blob)  //根据上面的文件（Blob），生成一个临时的本地地址- 这个地址可以用来下载文件
    const a = document.createElement('a') //用 JS 动态创建一个  <a>  标签
    a.href = url // 把链接地址，设为刚才生成的临时文件地址
//  给  <a>  标签设置  download  属性--意思是：点击这个链接不是跳转，是下载,  下载后的文件名叫  schema.json
    a.download = 'schema.json'
    a.click()  //JS 自动模拟点击，实现自动下载，不用人工再点击
    URL.revokeObjectURL(url) //释放刚才创建的临时地址,清理内存，避免浪费
  }

// 导入 JSON
  const handleImport = (e) => {
    const file = e.target.files[0] // 获取上传的第一个文件
    if (!file) return
    const reader = new FileReader() //FileReader  浏览器文件读取器
    reader.onload = (evt) => {
      try {
        const json = JSON.parse(evt.target.result) //把文本转回JS对象
        dispatch(loadSchema(json)) //派发Redux action，用导入的JSON覆盖当前页面配置
      } catch {
        alert('JSON 格式错误')
      }
    }
    reader.readAsText(file) //以文本格式读取JSON文件
  }

  // 预览：把当前编辑器的页面配置 schema 存到浏览器本地缓存  localStorage ，
  //      然后新开一个浏览器标签页跳转到  /preview  预览页面，实现低代码页面实时预览。
  const handlePreview = () => {
//  localStorage.setItem(key, value)  往浏览器本地存储里存数据
// - 键名： preview_schema 
// - 值：序列化后的页面配置 JSON 字符串，原因： localStorage  只能存字符串，不能直接存对象
// - 特点：永久存储，关闭浏览器也还在，不清缓存就一直有
    localStorage.setItem('preview_schema', JSON.stringify(schema))
//  window.open(路由, '_blank') 
// - _blank  固定含义：在新标签页打开
// - 跳转到项目路由  /preview  预览页面
    window.open('/preview', '_blank')
  }

  return (
    <header className="toolbar">
      <span className="toolbar-logo">🧱 Lego Builder</span>

      <button
// ActionCreators  是 redux-undo 库自带的对象
// 里面固定自带 5 个方法：
// ActionCreators.undo()       // 撤销
// ActionCreators.redo()       // 重做
// ActionCreators.jump(n)      // 跳几步历史
// ActionCreators.jumpToPast() // 跳到某个历史记录
// ActionCreators.clearHistory() // 清空撤销重做历史
// 调用  ActionCreators.undo()  本质是：它内部帮你生成了一个固定 type 的 action： { type: "@redux-undo/UNDO" }
//                                     redo()  就是：{ type: "@redux-undo/REDO" }
 
         className="toolbar-btn"
        onClick={() => dispatch(ActionCreators.undo())}
        disabled={!canUndo}
      >
        ↩ 撤销
      </button>
      <button
        className="toolbar-btn"
        onClick={() => dispatch(ActionCreators.redo())}
        disabled={!canRedo}
      >
        ↪ 重做
      </button>

  <div className="toolbar-zoom">
    {/* onZoomOut  是父组件传进来的缩小函数，按钮被点击 → 执行缩小画布逻辑 */}
  <button className="toolbar-btn" onClick={onZoomOut}>－</button>
   {/* 点击这个百分比文字，就会触发  onZoomReset ，把画布缩放恢复默认（一般是 100%） */}
  <span className="toolbar-zoom-value" onClick={onZoomReset}>{zoom}%</span>
  <button className="toolbar-btn" onClick={onZoomIn}>＋</button>
</div>

{/* 作用：把左边所有按钮挤到最左，把右边导入/导出/预览按钮全部顶到最右侧 */}
{/* 原理：父容器是  display: flex  弹性布局；子元素写  flex: 1  的意思是：自己占满剩余所有空白空间。 */}
{/* <div style={{ flex: 1 }} />  */}

      <div className="toolbar-spacer" />

      <label className="toolbar-btn toolbar-btn--label">
        📂 导入 JSON
        <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
      </label>
      <button className="toolbar-btn" onClick={handleExport}>💾 导出 JSON</button>
      <button className="toolbar-btn toolbar-btn--primary" onClick={handlePreview}>🔍 预览</button>
    </header>
  );
}
