// reflection
var f = function (service, router, other) {
    var s = service();
    var r = router();
}
var s = f.toString()
// 获取参数正则
var reg = /^function\s*[^\(]*\(\s*([^\)]*)\)/m
var resolve = function() {
    // agrs 传给func的参数数组，包括依赖模块及自定义参数
    var func, deps, scope, args = [], self = this;
    // 获取传入的func，主要是为了下面来拆分字符串
    func = arguments[0];
    // 正则拆分，获取依赖模块的数组
    deps = func.toString().match(/^functions*[^(]*(s*([^)]*))/m)[1].replace(/ /g, '').split(',');
    //待绑定作用域，不存在则不指定
    scope = arguments[1] || {};
    return function() {
        // 将arguments转为数组
        // 即后面再次调用的时候，doSomething("Other");   
        // 这里的Other就是a，用来补充缺失的模块。
        var a = Array.prototype.slice.call(arguments, 0);
        //循环依赖模块数组
        for(var i=0; i<deps.length; i++) {
            var d = deps[i];
            // 依赖队列中模块存在且不为空的话，push进参数数组中。
            // 依赖队列中不存在对应模块的话从a中取第一个元素push进去(shift之后，数组在改变)
            args.push(self.dependencies[d] && d != '' ? self.dependencies[d] : a.shift());
        }
        //依赖当做参数传入
        func.apply(scope || {}, args);
    }        
}
// TEST
//不用在前面声明依赖模块了
var doSomething = injector.resolve(function(service, other, router) {
    expect(service().name).to.be('Service');
    expect(router().name).to.be('Router');
    expect(other).to.be('Other');
});
doSomething("Other");
// 代码压缩怎么办？
var injector = {
    dependencies: {},
    register: function(key, value) {
        this.dependencies[key] = value;
    },
    resolve: function() {
        var func, deps, scope, args = [], self = this;
        // 该种情况是兼容形式，先声明
        if(typeof arguments[0] === 'string') {
            func = arguments[1];
            deps = arguments[0].replace(/ /g, '').split(',');
            scope = arguments[2] || {};
        } else {
            // 反射的第一种方式
            func = arguments[0];
            deps = func.toString().match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1].replace(/ /g, '').split(',');
            scope = arguments[1] || {};
        }
        return function() {
            var a = Array.prototype.slice.call(arguments, 0);
            for(var i=0; i<deps.length; i++) {
                var d = deps[i];
                args.push(self.dependencies[d] && d != '' ? self.dependencies[d] : a.shift());
            }
            func.apply(scope || {}, args);
        }        
    }
}
// 测试
// 缺失了一项模块other
var doSomething = injector.resolve('router,,service', function(a, b, c) {
    expect(a().name).to.be('Router');
    expect(b).to.be('Other');
    expect(c().name).to.be('Service');
});
// 这里传的Other将会用来拼凑
doSomething("Other");
/*** 直接注入作用域 */
var injector = {
    dependencies: {},
    register: function(key, value) {
        this.dependencies[key] = value;
    },
    resolve: function(deps, func, scope) {
        var args = [];
        scope = scope || {};
        for(var i=0; i<deps.length, d=deps[i]; i++) {
            if(this.dependencies[d]) {
                //区别就在这里了，直接将依赖加到scope上
                //这样就可以直接在函数作用域中调用了
                scope[d] = this.dependencies[d];
            } else {
                throw new Error('Can\'t resolve ' + d);
            }
        }
        return function() {
            func.apply(scope || {}, Array.prototype.slice.call(arguments, 0));
        }        
    }
}
// test
var doSomething = injector.resolve(['service', 'router'], function(other) {
    expect(this.service().name).to.be('Service');
    expect(this.router().name).to.be('Router');
    expect(other).to.be('Other');
});
doSomething("Other");


