class Watcher {
	constructor (vm, expOrFn, cb, options) {
		this.vm = vm;
		vm._watchers.push(this);
		if (options) {
			this.deep = !!options.deep;
			this.user = !!options.user;
			this.lazy = !!options.lazy;
			this.sync = !!options.sync;
		} else {
			this.deep = this.user = this.lazy = this.sync = false;
		}
		this.cb = cb;
		this.id = ++uid;
		this.active = true;
		this.dirty = this.lazy;
		this.deps = [];
		this.newDeps = [];
		this.depIds = new Set();
		this.newDepIds = new Set();
		this.expression = expOrFn.toString();
		
		this.getter = typeof expOrFn === 'function' 
			? expOrFn 
			: parsePath(expOrFn);
		this.getter = this.getter || noop;
		this.value = this.lazy ? undefined : this.get();
	}
	get () {
		pushTarget(this);
	}
}