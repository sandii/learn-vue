// 最基础的VNode，可用于派生其他类型的VNode
class VNode {
	constructor (
		tag, 
		data, 
		children, 
		text, 
		elm, 
		context, 
		componentOptions
	) {
		this.tag = tag; // 标签名
		this.data = data; //vnode数据
		this.children = children; // 子节点，vnode数组
		this.text = text; // 文本
		this.elm = elm; // 对应的真实dom元素
		this.ns = undefined; //  命名空间
		this.context = context; // 编译作用域
		this.functionalContext = undefined; // 函数化组件作用域
		this.key = data && data.key; // key属性，防止domu元素复用
		this.componentOptions = componentOptions; // 组件选项
		this.componentInstance = undefined; // vnode对应的组件实例
		this.parent = undefined; // 父节点，vnode
		this.raw = false; // true-innerHTML false-textContent
		this.isStatic = false; // 是否静态节点
		this.isRootInsert = true; // 是否根节点
		this.isComment = false; // 是否注释
		this.isCloned = false; // 是否克隆节点
		this.isOnce = false; // 是否有v-onde指令
	}
}
// 创建空节点
const createEmptyVNode = _ => {
	const node = new VNode();
	node.text = '';
	node.isComment = true;
	return node;
};
// 创建文本节点
const createTextVNode = v => {
	const node = new VNode();
	node.text = String(v);
	return node;
};
// 克隆vnode
const cloneVNode = vnode => {
	const cloned = new VNode(
		tag, 
		data, 
		children, 
		text, 
		elm, 
		context, 
		componentOptions
	);
	cloned.ns		= vnode.ns;
	cloned.isStatic	= vnode.isStatic;
	cloned.key		= vnode.key;
	cloned.isCloned = true;
	return cloned;
};
// 创建组件节点
// 这块参数不写ts的话根本看不懂在干嘛
const createComponent = (
	Ctor : Class<Component> | Function | Object | void,
	data : ?VNodeData,
	context : Component, 
	children : ?Array<VNode>, 
	tag ?: string
) => {
	if (isUndef(Ctor)) return;
	const baseCtor = context.$options._base;
	if (isObject(Ctor))	// 保证Ctro是构造函数
		Ctor = baseCtor.extend(Ctor);
	if (typeof Ctor !== 'function') return;
	resolveConstructorOptions(Ctor);
	data = data || {};
	
};


