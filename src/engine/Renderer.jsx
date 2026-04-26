import {componentMap} from '../components/index';
import {useSelector,useDispatch} from 'react-redux';
import {setSelectedId, addNode, moveNode} from '../store/pageSlice';
import {useDrop,useDrag} from 'react-dnd';
import EditWrapper from '../editor/Canvas/EditWrapper'; 


// 这是一个低代码平台的核心渲染器：
// 它根据 Redux 里存的JSON 结构（页面 schema），递归渲染出真实 React 组件，
// 并且支持把左侧组件拖拽放进右侧容器里，自动生成节点、存入 Redux。


//工具函数：生成唯一ID
function genId(type){
    return `${type.toLowerCase()}_${Date.now()}`;
}

//默认属性配置
const defaultProps = {
  Button: { text: '新按钮', variant: 'primary' },
  Input: { placeholder: '请输入内容' },
  Container: { style: { padding: '16px', backgroundColor: '#fff', minHeight: '60px' } },
  Text: { text: '双击编辑文本' },
};


// 核心递归函数：拿到一个JSON节点，渲染成对应的React组件
function RenderNode({node}){
  //拿到状态与组件
    const dispatch = useDispatch();
    const Component = componentMap[node.type];

    // ① 让每个节点自己也可以被拖起来（用于排序）
  const [{ isDragging }, drag] = useDrag({
    type: 'SORT_NODE',
    item: { id: node.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });


    //配置拖拽区域
    //isOver ：鼠标拖着东西，正悬停在这个容器上方 → isOver = true， 不在上面 / 松开了 → isOver = false
    const [{ isOver }, drop] = useDrop(() => ({
//  accept: 'COMPONENT', 只接收“带着同样标记”的拖拽物
// 1.  'COMPONENT'  = 自定义的字符串标记
// 2. 左边拖拽项写  type: 'COMPONENT' 
// 3. 右边容器写  accept: 'COMPONENT' 
// 4. 只有标记一样，才能拖放成功
  accept: ['COMPONENT', 'SORT_NODE'],
    //drop 就是-把组件拖到这个容器上，松开鼠标的那一刻，要执行的代码。
    drop: (item, monitor) => {  //item = 你拖过来的那个组件的信息  monitor = 拖放过程的“监控员”
      //如果已经放进去过了，就不要再重复添加
      if (monitor.didDrop()) return;

      const type = monitor.getItemType();

       if (type === 'COMPONENT') {
      //生成一个新组件节点
      const newNode = {
// 1. componentType  不是在当前文件定义的，是左边拖拽组件通过 react-dnd 传过来的。
// 2. 拖拽源和渲染器之间不靠 import 关联，而是靠 react-dnd 做中间桥梁。
// 3. 左边用  useDrag  把  { componentType: 'Button' }  放进拖拽通道。
// 4. 右边用  useDrop  接收同类型的拖拽，自动拿到  item  对象。
        id: genId(item.componentType),
        type: item.componentType,
        props: defaultProps[item.componentType] || {},
        children: [],
      };
      //添加到Redux store
      dispatch(addNode({ parentId: node.id, newNode }));
    }
     if (type === 'SORT_NODE') {
        // 同级排序
        if (item.id !== node.id) {
          dispatch(moveNode({ dragId: item.id, hoverId: node.id }));
        }
      }
    },
    //collect 就是用来从拖放系统里“拿状态”的，你想要什么状态，就从这里  return  出去，外面就能用。
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
 }), [node.id]);

    // 如果JSON里的组件没有在componentMap里注册，红色报错显示
    if(!Component){
        return <div style={{color:'red',padding:'10px'}}>×件{node.type}未注册</div>;
    }


    return (
        <div
//         ref={drop}  = 把这个 div 传给 drop 函数
//                     = drop 函数拿到 DOM 并把它变成可拖放区域
        // ref={drop}
        ref={(el) => drag(drop(el))}
        onClick={(e)=>{
               e.stopPropagation(); //阻止事件冒泡，防止点按钮时连着选中了外层的容器
               dispatch(setSelectedId(node.id));
           }}
         style={{
        opacity: isDragging ? 0.4 : 1,       // 拖起来时半透明
        outline: isOver ? '2px dashed #52c41a' : '2px solid transparent',
        cursor: 'grab',
        position: 'relative',
        backgroundColor: isOver ? 'rgba(82,196,26,0.04)' : 'transparent',
        transition: 'opacity 0.2s',
      }}
      >
           <EditWrapper node={node}>
            {/* 渲染真实组件，并把props传出去 */}
            <Component {...node.props}  id = {node.id}>  {/*Component  是你要渲染的真实组件：Button / Input / Container / Text */}
                {/* 递归调用：如果它有children,继续循环渲染 */}
                {node.children&&node.children.map((child)=>(                  
                    <RenderNode key={child.id} node={child} />
                ))}
            </Component>
            </EditWrapper>
        </div>
    );
}



//对外暴露的入口：从Redux拿到root节点，开始渲染
export default function Renderer() {
  const root = useSelector((state) => state.page.present.schema.root);
  if (!root) return null;
  return <RenderNode node={root} />;
}
