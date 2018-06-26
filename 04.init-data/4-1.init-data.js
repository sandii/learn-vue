const initData = vm => {
	let { data } = vm.$options;	// 获取data
	data = data || {};			// 排除空data
	if (typeof data === 'function') getData(data, vm); // 执行data函数 // todo
	vm._data = data; // 把data挂在vm的_data属性上
	if (!isPlainObject(data)) data = {}; // 最后data必须是普通对象 // todo

	// proxy
	const { props } = vm.$options;	// 获取props
	Object.keys(data).forEach(key => {
		if (props && hasOwn(props, key)) return; // props和data属性冲突时，props优先
		if (isReserve(key)) return; // 排除保留字
		proxy(vm, '_data', key);	// 代理属性 // todo三层代理问题
	});
};
