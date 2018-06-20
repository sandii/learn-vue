const reactive = (data, copy, cbk) => {
  Object.keys(data).forEach(key => {
    Object.defineProperty(data, key, {
      get () { return copy[key]; },
      set (val) {
        cbk(key, val); // 触发渲染
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
    reactive(this.data, this.copy, opt.render);
    proxy(this, this.data);
  }
}
// 三层代理 vm -> vm.data -> vm.copy

// test
const vm = new Vue({
  data : { a : 1, b : 2 },
  render (key, val) { console.log(`render-${key}-${val}`); },
});
// 修改数据触发渲染
vm.a = 2;
vm.b = 4;
// 增添数据不触发渲染
vm.c = 8;
console.log(vm.a); // 2
console.log(vm.b); // 4
console.log(vm);
