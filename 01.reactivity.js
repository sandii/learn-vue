const reactive = (data, cbk) => {
  Object.keys(data).forEach(key => {
    Object.defineProperty(data, key, {
      set (val) { cbk(key, val); }, // 触发渲染
    });
  });
};
class Vue {
  constructor (opt) {
    reactive(opt.data, opt.render);
  }
}

// test
const data = { a : 1, b : 2 };
const app = new Vue({
  data,
  render (key, val) { console.log(`render-${key}-${val}`); },
});
// 修改数据触发渲染
data.a = 2;
data.b = 4;
// 增添数据不触发渲染
data.c = 8;
