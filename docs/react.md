# React 进阶实践
参考文档：[二公子](https://www.yuque.com/ergz/web/gzitt4)

## 认识jsx
`jsx`语法实现来源于`babel`插件
> @babel/plugin-syntax-jsx : 有效的解析`JSX`语法\
> @babel/plugin-transform-react-jsx：将`JSX`语法转换为js能够识别的 `createElement` 格式

新版本React不再需要引入`createElement`,这种模式来源于`Automatic Runtime`。

`fiber`是React16引入的一种新的架构，它的核心思想是将组件的渲染过程拆分成多个小的任务，每个任务称为一个`fiber`。

在 React 15 及更早版本，更新机制是同步递归 Diff：
> 1. 触发更新（`setState`、`props` 变化）；
> 2. React 立刻开始对比新旧 `Virtual DOM`，递归遍历整个组件树；
> 3. 这个过程一旦开始，就不能停，必须从头到尾执行完；
> 4. 执行期间会完全霸占浏览器主线程，`JS` 引擎没空做渲染、响应用户点击、输入、滚动。

如果组件树很大、逻辑复杂，Diff 耗时超过 16ms（浏览器一帧大概 16.67ms），就会出现：
> 1. 输入框打字卡顿
> 2. 按钮点击没反应
> 3. 滚动掉帧、页面卡死
> 4. 动画不流畅

这就是所谓的 “卡顿瓶颈”，旧架构天生无法解决。

**简单说：**

> 旧版：递归虚拟 DOM 树 → 不可中断；\
> Fiber 版：链表结构的 Fiber 树 → 循环遍历，随时可以暂停。

**优势：**

> 1. 时间切片
> 2. 优先级调度
> 3. 可中断、可恢复、可复用
> 4. 为新特性打下基础

## Component
组件分为两类：类(Class)组件和函数(Function)组件

**Class类组件：**

> 1. 继承了`React.Component`类
> 2. 底层还加入了`updater`对象
> 3. 调用`setState` 和 `forceUpdate` 方法时，本质是调用了`updater`对象上的`enqueueSetState`和`enqueueForceUpdate`方法。

**Function函数组件：**

> 可以做类组件一起能做的事情

**本质区别：**

> 类组件：底层只需要实例化一次，实例中保存了组件的state等状态,只需要调用render或者对应的生命周期就可以了
> 函数组件：每次更新都是一次新的调用，里面的变量会重新声明

**通信方式：**

1. props 和 callback方式
2. ref方式
3. React-redux 或React-mobx状态管理方式
4. context 上下文方式
5. event bus事件总线

## state

> state到底是同步还是异步的？
> 答：回答出battchUpdate的概念，以及批量更新被打破的条件,将来被颠覆

React有多种模式：
> 1. legacy模式
> 2. concurrent模式 (未来的稳定默认版本)


1. 类组件中的state
```js
setState(obj,callback)
obj: 
    - 对象，则为即将合并的state
    - 函数，参数：state和props 作为参数， 返回值用于合并新的state

callback: 可选参数，状态更新完成后的回调函数

this.setState({count: this.state.count + 1}, () => {
  console.log(this.state.count); // 1
});
this.setState((state, props) => ({
  count: state.count + props.step
}));
```

类组件如何限制state更新视图？

> 1. pureComponent 可以对state和props进行浅比较，如果没有发生变化，那么组件不更新
> 2. shouldComponentUpdate 生命周期可以判断前后state变化来决定组件需不需要更新，需要返回true,否则不更新

**setState原理揭秘**

1. enqueueSetState到底做了什么？
![enqueueSetState](/enqueueSetState.png)

创建一个update,放入当前fiber对象的待更新队列中，最后开启调度更新，进行批量更新。
batchdEventUpdates方法：
setTimeout里面的就会被打破
批量更新方法：unstable_batchedUpdates

```js
ReactDOM.flushSync(()=> {
    this.setState({count: this.state.count + 1});
})
```
flusync中的setState > 正常执行上下文中的setState > setTimeout中的setState > 微任务中(promise)的setState

**useState的用法**

```js
const [state, dispatch] = useState(initData);
state: 渲染视图的数据源
dispatch: 
    - 非函数, 作为新的值，赋值给state,作为下一次渲染使用
    - 函数，参数（dreducer,reducer）返回值作为新的state
initData: 
    - 初始值
    - 函数，返回初始值
```

## props

### props 可以是什么？
1. 子组件渲染数据源
2. 通知父组件的回调函数
3. 单纯的组件传递
4. 渲染函数
5. render props, 和4的区别是放在了children属性上
6. render component 插槽组件

### 如何定义props?
1. 组件层级：可以把数据层传递给子组件去渲染消费，也可以通过callback向父组件传递信息
2. 更新机制中：diff是他的驱动器，变化即更新，于是有了pureComponent,memo等性能优化方案
3. 插槽：组件的闭合标签里的插槽，转化为Children属性

### 监听props改变

类组件中：

1. componentWillReceiveProps 生命周期方法，在props改变时调用,但是已经不推荐使用
2. getDerivedStateFromProps 静态方法，在props改变时调用，返回值用于更新state

函数组件中：
1. 使用useEffect钩子函数，监听props变化， 初始化会默认执行一次
```js
useEffect(() => {
    // 处理props变化的逻辑
}, [props.someProp]);
```

### props+children模式

1. props插槽组件
```js
<container>
    <Children />
</container>
```
2. 操作props小技巧

抽象props: 不需要指定props的名称，将props直接传入或者抽离到子组件中\
抽离props: const { children, ...rest } = props;\
注入props\
显示注入props\
隐式注入props

## lifeCycle
React的两个重要阶段：\
render阶段：深度遍历fiber树，发现diff,对于变化的组件，就会执行render函数\
commit阶段：将render阶段的结果，渲染到真实DOM上
```js
function undateClassComponent() {
    let sholdUpdate;
    const instance = worInProgress.stateNode;
    if(instance === null) {
        constructClassInstance(worInProgress, Component, nextProps);
        mountClassInstance(worInProgress, instance, nextProps, renderExpirationTime);
        shouldUpdate = true;
    } else {
        shouldUpdate = updateClassInstance(worInProgress, instance, nextProps, nextState, renderExpirationTime);
    }
    if (shouldUpdate) {
        nextCurrent = instance.render();
        reconcileChildren(current, workInProgress, nextCurrent, renderExpirationTime);
    }
}
instace 类组件对应实例
workInProgress树：正在调和的fiber树
current树：初始化更新中，current=null, 在第一次fiber调和之后，会将workInProgress赋值给current
Component 就是项目中的class组件
nextProps 作为组件在一次更新中新的props
renderExpirationTime 渲染过期时间
```
mountClassInstance和updateClassInstance：
1. mountClassInstance：组件挂载时调用，初始化组件的state和props
2. updateClassInstance：组件更新时调用，根据新的props和state，更新组件的视图

1. 初始化阶段：
    - 调用构造函数 constructor
    - getDerivedStateFromProps 静态方法，初始化state / 调用 componentWillMount 生命周期方法
    - 调用 render 方法
    - 调用 componentDidMount 生命周期方法
2. 更新阶段：
    - 调用 componentWillReceiveProps 生命周期方法
    - getDerivedStateFromProps 静态方法，更新state
    - 调用 shouldComponentUpdate 生命周期方法，判断是否需要更新
    - 调用 componentWillUpdate 生命周期方法
    - 调用 render 方法
    - getSnapshotBeforeUpdate 静态方法，获取更新前的快照
    - 调用 componentDidUpdate 生命周期方法
3. 销毁阶段：
    - 调用 componentWillUnmount 生命周期方法

## 各阶段生命周期能做些什么？
1. constructor:
    - 初始化state和props
    - 绑定事件处理函数
    - 必要生命周期的劫持，渲染劫持，更适合反向继承的HOC
2. getDerivedStateFromProps（nextProps, prevState）:
    - 根据props更新state
    - 代替componentWillMount和componentWillReceiveProps
    - 返回值和state合并完，可以作为shouldComponentUpdate的第二个参数newState, 用于判断是否需要更新组件
3. componentWillMount:
    - 组件挂载前调用
    - UNSAFE_componentWillMount: 不推荐使用，未来会被移除
4. render:
    - 渲染组件的视图
    - createElement创建元素，cloneElement克隆元素,React.children遍历children的操作
5. componentDidMount:
    - 组件挂载后调用
6. componentWillReceiveProps:
    - 在props改变时调用
    - UNSAFE_componentWillReceiveProps: 不推荐使用，未来会被移除
    - 在props不变的前提下，PureComponent组件能否阻止componentWillReceiveProps的调用？
    - 答案：不能，因为PureComponent只对props和state进行浅比较，而componentWillReceiveProps是在props改变时调用的
7. shouldComponentUpdate:
    - 判断是否需要更新组件
8. componentWillUpdate:
    - 在组件更新前调用
    - UNSAFE_componentWillUpdate: 不推荐使用，未来会被移除
9. getSnapshotBeforeUpdate:
    - 在组件更新前调用，返回值作为componentDidUpdate的第三个参数
10. componentDidUpdate:
    - 在组件更新后调用
11. componentWillUnmount:
    - 在组件卸载前调用

## react hooks 
1. useEffect 和 useLayoutEffect 区别
    - useEffect：在组件挂载后和更新后异步执行，不会阻塞浏览器渲染，浏览器绘制之后执行
    - useLayoutEffect：在组件挂载后和更新后同步执行，会阻塞浏览器渲染, DOM更新之后，浏览器绘制之前，浏览器只绘制一次，
修改DOM，改变布局就用useLayoutEffect, 其他情况用useEffect
```js
useEffect(() => {
    // 处理副作用的逻辑
    return destory;
}, [dependency]);

第一个参数callback, 副作用的处理函数
第二个参数dependency, 依赖数组，当依赖数组中的值发生变化时，才会执行副作用的处理函数
```
问：React.useEffect 和componentDidMount/ componentDidUpdate 执行时机有什么区别？

答：
useEffect： 组件挂载后和更新后异步执行，不会阻塞浏览器渲染，浏览器绘制之后执行
componentDidMount/ componentDidUpdate： 他们两个是同步执行的，时机上和useLayoutEffect更类似

useInsertionEffect：执行时机比useLayoutEffect更早，在DOM更新之前执行,主要解决css-in-js在渲染中注入样式的性能问题。

## Ref
> Ref对象的创建：用createRef或useRef创建出来的对象
> React本身对Ref的处理

**注意： 不要在函数组件中使用createRef,否则会造成Ref对象的丢失**

```js
# 一个标准的ref对象
{
    current: null
}
export function createRef() { # 一般用于类组件创建Ref对象 
    return {
        current: null
    }
}
```
1. 类组件React.createRef
```js
class Index extends React.Component {
    constructor(props) {
        super(props);
        this.currentDom = React.createRef(null);
    }
    componentDidMount() {
        console.log(this.currentDom.current); // { current: div }
    }
    render = () => {
        return <div ref={ this.currentDom }>ref对象模式获取元素或组件</div>
    }
}
```
2. 函数组件useRef
```js
export default function Index() {
    const currentDom = React.useRef(null);
    React.useEffect(() => {
        console.log(currentDom.current); // <div>ref对象模式获取元素或组件</div>
    }, []);
    return <div ref={currentDom}>ref对象模式获取元素或组件</div>
}
```

- 类组件有示例instance能够维护像ref这种信息
- 函数组件是每次更新都是一个新的开始，所有变量重新声明
- 所以useRef不能像createRef把ref对象直接暴露出去，
- 如果这样，每次函数组件执行，都会重新声明Ref，ref就会随着函数组件执行被重置，
- 这就解释了为啥函数组件中不能用createRef的原因

- 为了解决这个问题，hooks和函数组件对应的fiber对象建立起关联，将userRef产生的ref对象挂到函数组件对应的fiber上，函数组件每次执行，只要组件不销毁，函数组件对应的fiber对象一直存在，所以ref等信息就会被保存下来

3. 标记ref
问题： DOM元素和组件实例必须用ref对象获取吗？
答： 不是，提供了多种方法获取DOM元素和组件实例

**类组件获取ref的三种方式**
- ref属性是一个字符串
```js
class Children extends React.Component {
    render = () => <div>hello,world</div>
}
export default class Index extends React.Component {
    componentDidMount() {
        console.log(this.refs);
    }
    render = () => <div>
        <div ref="currentDom">字符串模式获取元素或组件</div>
        <Children ref="currentComInstance" />
    </div>
}
```
- ref属性是一个函数
```js
class Children extends React.Component {
    render = () => <div>hello,world</div>
}
export default class Index extends React.Component {
    currentDom = null;
    currentComInstance = null;
    componentDidMount() {
        console.log(this.currentDom); // <div>字符串模式获取元素或组件</div>
        console.log(this.currentComInstance); // <Children />
    }
    render = () => <div>
        <div ref={ref => this.currentDom = ref}>字符串模式获取元素或组件</div>
        <Children ref={node => this.currentComInstance = node} />
    </div>
}
``` 
- ref属性是一个ref对象
```js
class Children extends React.Component {
    render = () => <div>hello,world</div>
}
export default class Index extends React.Component {
    currentDom = React.createRef(null);
    currentComInstance = React.createRef(null);
    componentDidMount() {
        console.log(this.currentDom.current); // <div>字符串模式获取元素或组件</div>
        console.log(this.currentComInstance.current); // <Children />
    }
    render = () => <div>
        <div ref={this.currentDom}>ref对象模式获取元素或组件</div>
        <Children ref={this.currentComInstance} />
    </div>
}

``` 
### 高阶用法
1. forwardRef 转发Ref
> 初衷：解决ref不能跨层级捕获和传递的问题
> 解决： 类组件 / 函数组件无法直接接收 ref、ref 无法自动跨层级传递

- 场景一：跨层级获取
```js
// 孙组件
function Son(props) {
    const { grandRef } = props;
    return <div>
        <div>i am alien</div>
        <span ref={grandRef} >这个是想要获取元素</span>
    </div>
}
class Father extends React.Component{
    constructor(props) {
        super(props);
    }
    render() {
        return <div>
            <Son grandRef={this.props.grandRef} />
        </div>
    }
}
const NewFather = React.forwardRef((props, ref) => <Father grandRef={ref} {...props} />)

class GrandFather extends React.Component{
    constructor(props) {
        super(props);
    }
    node = null
    componentDidMount() {
        console.log(this.node);
    }
    render() {
        return <div>
            <NewFather ref={node => this.node = node} />
        </div>
    }
}
```
如果不用forwardRef，只能通过自定义props传递ref
```js
import React, { Component, createRef } from 'react';

// 孙组件：接收自定义props绑定ref
function Son(props) {
  // 使用自定义属性名 domRef，避免和原生ref冲突
  const { domRef } = props;
  return (
    <div>
      <div>i am alien</div>
      <span ref={domRef}>这个是想要获取元素</span>
    </div>
  );
}

// 父组件：逐层传递自定义props
class Father extends Component {
  render() {
    // 把祖父传下来的 domRef 继续传递给 Son
    return (
      <div>
        <Son domRef={this.props.domRef} />
      </div>
    );
  }
}

// 祖父组件：创建ref，通过自定义props传递
class GrandFather extends Component {
  // 用 createRef 创建标准ref对象（推荐写法，替代回调ref）
  spanRef = createRef();

  componentDidMount() {
    // 直接获取到span DOM元素
    console.log('获取到的DOM元素：', this.spanRef.current);
    // 可以操作DOM：修改文本、样式等
    if (this.spanRef.current) {
      this.spanRef.current.style.color = 'red';
    }
  }

  render() {
    // 通过自定义属性 domRef 传递ref，不使用系统ref
    return (
      <div>
        <Father domRef={this.spanRef} />
      </div>
    );
  }
}

export default GrandFather;
```
- 场景2：合并转发ref
    - 不要理解为只能用来直接获取组件实例，DOM元素，
    - 也可以用来传递合并之后的自定义的ref
```js
class Form extends React.Component {
    render() {
        return <div>...</div>
    }
}
class Index extends React.Component {
    componentDidMount() {
        const { forwardRef } = this.props;
        forwardRef.current = {
            form: this.form,
            index: this,
            button: this.button
        }
    }
    render() {
        const { forwardRef } = this.props;
        return <div>
            <Form ref={ref => this.form = ref} />
            <button ref={ref => this.button = ref}>提交</button>
        </div>
    }
}
const ForwardRefIndex = React.forwardRef((props, ref) => <Index {...props} forwardRef={ref} />)
export default function Home () {
    const ref = React.useRef(null);
    useEffect(() => {
        console.log(ref.current);
    }, []);
    return <ForwardRefIndex ref={ref} />
}
```

ref实现组件通信

1. 类组件ref
```js
class Son extends React.Component {
    state = {
        fatherMes: '',
        sonMes: ''
    }
    fatherSay = (fatherMes) => this.setState({ fatherMes })
    render() {
        const { fatherMes, sonMes } = this.state;
        return <div>
            <p>父组件对我说：{fatherMes}</p>
            <div className="label">
                <input onChange={(e) => this.setState({ sonMes: e.target.value })} className="input" />
                <button onClick={() => this.props.toFather(sonMes)}>发送</button>
            </div>
        </div>
    }
}
export default function Father() {
    const [sonMes, setSonMes] = React.useState('');
    const sonInstance = React.useRef(null);
    const [ fatherMes, setFatherMes ] = React.useState('');
    const toSon = () => sonInstance.current.fatherSay(fatherMes);
    return <div>
        <p>子组件对我说：{sonMes}</p>
        <div className="label">
            <input onChange={(e) => setFatherMes(e.target.value)} className="input" />
            <button onClick={toSon}>发送</button>
        </div>
        <Son ref={sonInstance} toFather={setSonMes} />
    </div>
}
```
- 场景3：高阶组件转发
    - 高阶组件包裹一个原始类组件，就会产生一个问题，
    - 如果高阶组件HOC没有处理ref,高阶本身返回一个新组件，
    - 当使用HOC包装后的组件的时候，标记的ref会指向HOC返回的组件，而不是HOC包裹的原始类组件
```js
function HOC(Component) {
    class Wrap extends React.Component {
        render() {
            const { forwardedRef, ...otherprops } = this.props;
            return <Component {...otherprops} ref={forwardedRef} />
        }
    }
    return React.forwardRef((props, ref) => <Wrap {...props} forwardedRef={ref} />)
}
class Index extends React.Component {
    render() {
        return <div>hello world</div>
    }
}
const HocIndex = HOC(Index);
export default () => {
    const node = useRef(null);
    useEffect(() => {
        console.log(node.current);
    }, []);
    return <div>
        <HocIndex ref={node} />
    </div>
}
```

2. 函数组件 forwardRef + useImperativeHandle

useImperativeHandle
- 第一个参数ref: 接受forWardRef传递过来的ref
- 第二个参数createHandle: 处理函数，返回值作为暴露给父组件的ref对象
- 第三个参数deps: 依赖项deps, 依赖项更改形成新的ref对象

```js
function Son(props, ref) {
    const inputRef = React.useRef(null);
    const [inputValue, setInputValue] = React.useState('');
    useImperativeHandle(ref, () => ({
        focus: () => inputRef.current.focus(),
        onChangeValue(value) {
            setInputValue(value);
        }
    }), []);
    return <div>
        <input ref={inputRef} value={inputValue} className="input" />
    </div>
}
const ForwardSon = React.forwardRef(Son);
class Index extends React.Component {
    cur = null;
    handerClick() {
        const { onFocus, onChangeValue } = this.cur;
        onFocus();
        onChangeValue('hello world');
    }
    render() {
        return <div>
            <ForwardSon ref={ref => this.cur = ref} />
            <button onClick={() => this.handerClick.bind(this)}>点击</button>
        </div>
    }
}
```
3. 函数组件缓存数据
useRef 创建一个ref原始对象，只要组件没有销毁，ref对象就一直存在
```js
const toLearn = [ { type: 1, mes: '123' }, { type: 2, mes: '456' }];
export default function Index({ id }) {
    const typeInfo = React.useRef(null);
    const changeType = (info) => {
        typeInfo.current = info;
    };
    useEffect(() => {
        if(typeInfo.current.type === 1) {

        }
    }, [id]);
    return <div>
        {
            toLearn.map(item => <button key={item.type} onClick={ changeType.bind(null, item) }>{ item.mes }</button>)
        }
    </div>
}
```
## context

> Provider提供者注入theme,consumer消费者形式去除theme,
> 提供者永远要在消费者上层

旧版本
```js
import propsTypes from "proptypes"
class ProviderDemo extends React.Component {
    getChildContext() {
        const theme = {
            color: '#ccc',
            background: 'pink'
        };
        return theme;
    }
    render() {
        return <div>hello, let us learn React!<Son /></div>
    }
}
ProviderDemo.childContextTypes = {
    theme: propsTypes.object
}
```
