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