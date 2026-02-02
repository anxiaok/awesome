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
```js
1. 类组件React.createRef
    this.currentDom = React.createRef(null);
    - Ref属性是一个字符串
        - <div ref="currentDom"></div>
    - Ref属性是一个函数
        - <div ref={(dom) => this.currentDom = dom}></div>
    - Ref属性是一个ref对象
        - <div ref={this.currentDom}></div>
2. 函数组件useRef
    const currentDom = React.useRef(null);
```

### 高阶用法
```js
1. forwardRef 转发Ref
> 解决ref不能跨层级捕获和传递的问题
> React.forwardRef((props, ref) => {
>     return <div ref={ref} {...props}></div>
> })

2. 合并转发ref
> 传递合并之后的自定义的ref

3. 高阶组件转发
```
ref实现组件通信

1. 类组件ref
2. 函数组件 forwardRef + useImperativeHandle