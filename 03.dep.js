class Dep {
  constructor () { this.subs = []; }
  addSub (sub) {
    if (!sub || this.subs.includes(sub)) return; // 去重
    this.subs.push(sub);
  }
  notify () { this.subs.forEach(s => s.update()); }
}
Dep.target = null; // 临时存储watcher对象
class Watcher {
  constructor (vm, cb) {
    this.vm = vm;
    this.cb = cb;
    Dep.target = this;
    this.update();  // 触发依赖收集
    Dep.target = null;
    console.log('collect ends..');
  }
  update () { this.cb.call(this.vm); }
}
const reactive = (data, copy) => {
  Object.keys(data).forEach(key => {
    const dep = new Dep(); // 每个属性配一个dep对象
    Object.defineProperty(data, key, {
      get () {
        if (Dep.target) dep.addSub(Dep.target);
        return copy[key];
      },
      set (val) {
        dep.notify(); // 触发渲染
        copy[key] = val;
      },
    });
  });
};
const proxy = (vm, data) => {
  Object.keys(data).forEach(key => {
    Object.defineProperty(vm, key, {
      get () { return data[key]; },
      set (v) { data[key] = v; },
    });
  });
};
class Vue {
  constructor (opt) {
    this.data = opt.data;
    this.copy = JSON.parse(JSON.stringify(this.data));
    proxy(this, this.data);
    reactive(this.data, this.copy);
    const watcher = new Watcher(this, opt.render);
  }
}
// 三层代理 vm -> vm.data -> vm.copy

// test
const vm = new Vue({
  data : { a : 1, b : 2 },
  render () { console.log(`render, a: ${this.a}`); },
});
vm.a = 2; // 修改使用的数据触发渲染
vm.b = 4; // 修改未使用数据不触发渲染
vm.c = 8; // 增添数据不触发渲染


