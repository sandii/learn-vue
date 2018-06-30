// 0. 处理数据
const initData = vm => {
	let { data } = vm.$options;	// 获取data
	data = data || {};			// 排除空data
	if (typeof data === 'function')
		getData(data, vm); // 执行data函数 // todo
	vm._data = data; // 把data挂在vm的_data属性上
	if (!isPlainObject(data)) 
		data = {};// 最后data必须是普通对象 // todo

	// X. 支线任务 proxy
	// todo 如何解决三层代理问题??
	const { props } = vm.$options;	// 获取props
	Object.keys(data).forEach(key => {
		if (props && hasOwn(props, key)) return; // props和data属性冲突时，props优先
		if (isReserve(key)) return; // 排除保留字
		proxy(vm, '_data', key);	// 代理属性
	});

	// 1. 启动响应式 observe
	observe(data, true); // 第二参数：是否实例的根数据
};

// X. 支线任务 proxy
const noop = _ => {}; // 空函数
const sharedPropertyDefinition = {
	enumerable : true,
	configurable : true,
	writable : true,
	get : noop,
	set : noop,
};
function proxy (vm, dataKey, key) {
	sharedPropertyDefinition.get = _ => vm[dataKey][key];
	sharedPropertyDefinition.set = v => vm[dataKey][key] = v;
	Object.defineProperty(vm, key, sharedPropertyDefinition);
}

// array
// 重写7个方法，使数组具备响应式能力
const arrayMethods = Object.create(Array.prototype); // 继承Array.prototype
['push','pop','shift','unshift','splice','sort','reverse']
.forEach(methodName => {
	const original = Array.prototype[methodName]; 	// 原本的方法
	def(arrayMethods, methodName, function (...args) { // 重写
		const result = original.apply(this, args); // 执行原方法，并获取返回值
		const ob = this.__ob__;

		// 获取新插入的数据
		let inserted = null;
		if (['push', 'unshift'].includes(methodName))
			inserted = args;
		if (methodName === 'splice')
			inserted = args.slice(2);

		// 让新加入的数据获得响应式能力
		if (inserted)
			ob.observeArray(inserted);
		
		ob.dep.notify(); // 通知所有观察者
		return result;
	});
});


// 1. 启动响应式 observe
function observe (data, asRootData) {
	if (!Array.isArray(data) && !isPlainObject(data)) return;
	// 还要排除很多其他情况，省略

	let ob = null;
	// 该对象已经具备响应式能力了，不做重复
	if (hasOwn(data, '__ob__') && data.__ob__ instanceof Observe)
		ob = data.__ob__;
	// 2. 响应式对象 Observer
	else
		ob = new Observer(data);

	if (asRootData)
		ob.vmCount++; // 该数据对象对应的vm数

	return ob;
}
// 2. 响应式对象 Observer
class Observer {
	constructor (data) {
		// 3. 每个数据对象配一个依赖收集对象
		this.dep = new Dep();
		this.vmCount = 0; // 该数据对象对应的vm数

		def(data, '__ob__', this); // 把observer实例挂在data.__ob__

		// 4-1. 重写数组的7个方法获得响应式能力
		if (Array.isArray(data)) {
			const augment = hasProto 
				? protoAugment	// 直接替换数组的__proto__属性 
				: copyAugment;  // 逐个重写这些方法
			augment(data, arrayMethods, arrayKeys);
			this.observeArray(data); // 递归处理数组里的子对象

		// 4-2. 普通对象的所有属性转为getter setter
		} else {
			Object.keys(data).forEach(key => {
				defineReactive(obj, key, obj[key])
			});
		}
	}
	observeArray (data) {
		data.forEach(item => observe(item)); // 递归处理数组里的子对象
	}
}
function protoAugment (target, src) {
	target.__proto__ = src;
}
function copyAugment (target, src, keys) {
	keys.forEach(key => def(target, key, src[key]));
}
function def (obj, key, value, enumerable) {
	Object.defineProperty(obj, key, {
		value,
		enumberable : !!enumberable,
		writable : true,
		configurable : true,
	});
}

// 3. 每个数据对象配一个依赖收集对象
class Dep {
	static target = null; // target watcher is globally unque at any time

	constructor () {
		this.id = uid++;
		this.subs = [];
	}
	addSub (sub) { this.subs.push(sub); } // 添加watcher
	removeSub (sub) { remove(this.subs, sub); } // 移除watcher
	depend () {	// todo 依赖收集
		if (!Dep.target) return;
		Dep.target.addDep(this);
	}
	notify () { this.subs.forEach(sub => sub.update()); } //通知所有订阅者
}
function remove (arr, item) { // 移除数组中的某个元素
	if (!arr.length) return;
	const index = arr.indexOf(item);
	if (index === -1) return;
	return arr.splice(index, 1);
}
// 

// 4-2. 普通对象的所有属性转为getter setter
function defineReactive (obj, key, val, customSetter) {

}

