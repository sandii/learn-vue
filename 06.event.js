const initEvnets = vm => {
	vm._events = Object.create(null); // 组件的所有事件都存放在这个对象里
	vm._hasHookEvent = false; // 是否存在生命周期钩子事件

	// 父组件中传入的事件
	const listeners = vm.$options._parentListeners;
	if (listeners)
		updateComponentListeners(vm, listeners);
};
Vue.prototype.$on = function (ev, fn) {
	const vm = this;
	if (Array.isArray(ev)) {	// 若有多个事件，逐个注册
		ev.forEach(e => vm.$on(e, fn));
		return vm;
	}
	if (!vm._events[ev])
		vm._events[ev] = [];
	vm._events[ev].push(fn);

	// 是否生命周期钩子事件
	if (hookRE.test(ev))
		vm._hasHookEvent = true;
	return vm;
};
Vue.prototype.$off = function (ev, fn) {
	const vm = this;
	if (!arguments.length) { // 不传参就全部注销
		vm._events = Object.create(null);
		return vm;
	}
	if (Array.isArray(ev)) { // 若有多个事件，逐个注销
		ev.forEach(e => vm.$off(e, fn));
		return vm;
	}
	const cbks = vm._events[ev]; // 获取该事件的所有回调
	if (!cbks) return vm; // 不存在回调

	if (arguments.length === 1) { // 若未指定注销的回调，注销所有回调
		vm._events[ev] = null;
		return vm;
	}
	for (let cbk of cbks) { // 注销指定的回调
		if (cbk === fn || cbk.fn === fn) {
			cbks.splice(i, 1);
			break;
		}
	}
	return vm;
};
Vue.prototype.$once = function (ev, fn) {
	const vm = this;
	vm.$on(ev, cbk);
	function cbk (...args) { // 在真回调外面套一层假回调
		vm.$off(ev, cbk);	// 一执行就注销
		fn.apply(vm, args);	// 执行注册的回调方法
	}
	cbk.fn = fn; // 把真回调挂在假回调的fn属性上，便于注销
	return vm;
};
Vue.prototype.$emit = function (ev, ...args) {
	const vm = this;
	const cbks = vm._events[ev];
	if (!cbks) return vm;
	cbks.forEach(cbk => cbk.apply(vm, args));	// 执行回调
	return vm;
};



