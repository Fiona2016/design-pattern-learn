// https://juejin.im/post/5bd177806fb9a05d30179925
var service = function() {
    return { name: 'Service' };
}
var router = function() {
    return { name: 'Router' };
}
var doSomething = function (other) {
  var s = service();
  var r = router();
}

// 接受参数
var doSomething = function(service, router, other) {
    var s = service();
    var r = router();
};


//a.js
var a = doSomething(service,router,1)
//b.js 
var b = doSomething(service,router,2)
// 假如依赖条件更改了，即doSomething需要第三个依赖，才能正常工作
// 这时候就需要在上面不同文件中修改了，如果文件数量够多，就不合适了。
var doSomething = function(service, router, third,another) {
    var s = service();
    var r = router();
    //***
};


// 
define(['router', 'service'], function () {
  // ...
})

// doSomething
var doSomething = injector.resolve(['service', 'router'], function(service, router, other) {
    expect(service().name).to.be('Service');
    expect(router().name).to.be('Router');
    expect(other).to.be('Other');
});
doSomething("Other");


// injector
var injector = {
  dependencies: {},
  register: function (key, value) {
    this.dependencies[key] = value
  },
  resolve: function (deps, func, scope) {
    var args = []
    for (let d in deps) {
      if (!this.dependencies[d]) {
        throw new Error(`Can't resolve ${d}`)
      }
      args.push(d)
    }
    return function () {
      func.apply(scope || {}, args.concat(Array.prototype.slice.apply(arguments, 0))) // 这里的0是否有必要？
    } 
  }
}





