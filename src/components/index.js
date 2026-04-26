import Button from './Button/Button';
import Input from './Input';
import Text from './Text';
import Container from './Container';
import Image from './Image';

// 1. 引入对应的 Meta 配置
import { ButtonMeta } from './Button/meta';
import { InputMeta } from './Input/meta';
import { ContainerMeta } from './Container/meta';
import { TextMeta } from './Text/meta';
import { ImageMeta } from './Image/meta';

// 物料注册中心：编辑器能拖的所有组件，都在这里注册
// 后续你写了 Button、Input 组件，就 import 进来，挂到 componentMap 上
export const componentMap = {
  Input:Input,
  Text:Text,
  Button:Button,
//   //   匿名组件：定义了一个叫 Container 的容器组件，它本质就是一个带最小高度的 div，能显示内部嵌套的内容。
// //Container:  这里的 Container 是“key”（字典里的名字）
// //后面的  () => <div>...</div>  才是组件本身
// //这个组件本身没有名字，所以叫匿名组件
//   Container:({style,className,children})=>(
//     <div className={className} style={{ minHeight: '60px', ...style }}>
//         {children}
//     </div>
//   ),
   Container, 
   Image,
};

/**
 * 元数据映射表：用于 RightPanel 属性面板的自动生成
 */
/**
 * 2. 元数据映射表：用于 RightPanel 属性面板的自动化生成
 * 按照你截图的格式：name 对应属性路径，type 对应 Setter 类型
 */
// 导出元数据映射
export const metaMap = {
    Button: ButtonMeta,
    Input: InputMeta,
    Container: ContainerMeta,
    Text: TextMeta,
    Image:ImageMeta,
};