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