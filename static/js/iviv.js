// 获取元素
var e = function(event) {
    return document.querySelector(event)
}
var es = function(event) {
    return document.querySelectorAll(event)
}
// 绑定事件
var bindEvent = function(element, event, callBack) {
    element.addEventListener(event, callBack)
}
// 有某个class删除，没有则加上
var toggleClass = function(element, className) {

    if (element.classList.contains(className)) {
        // 拥有则删除之
        element.classList.remove(className)
    } else {
        // 没有则加上
        element.classList.add(className)
    }
}
// 简单的节流函数
/**
 *  {[Function]}  延时调用的函数
 *  {[Number]}  延迟多长时间调用(需要事件结束才会调用)
 *  {[Number]}  至少多长时间触发一次
 (也就是说：
 即使事件没有结束，到了设置的间隔就调用上面的函数)
 */
var throttle = function(fn, delay, mustRun) {
    var timer = null,
        previous = null

    return function() {
        var now = +new Date(),
            context = this,
            args = arguments
        if (!previous) previous = now
        var remaining = now - previous
        if (mustRun && remaining >= mustRun) {
            fn.apply(context, args)
            previous = now
        } else {
            clearTimeout(timer)
            timer = setTimeout(function() {
                fn.apply(context, args)
            }, delay)
        }
    }
}
// 获取页面顶部距离
var scrollTop = function() {
    return window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
}

// 返回顶部，递归调用每次移动100
var backTop = function() {
  window.scrollBy(0, -100)

  // 调整第二个参数可以控制速度
  scrolldelay = setTimeout('backTop()', 5)
  // 这里只会生效一个，儿另一个为 0
  var sTop = document.documentElement.scrollTop + document.body.scrollTop

  if (sTop === 0) {
    clearTimeout(scrolldelay)
  }
}

// request为一个对象，选项：method(请求方式)、url、contentType(文件类型)、data、callback
var ajax = function(request) {
    var r = new XMLHttpRequest()
    r.open(request.method, request.url, true)
    if (request.contentType !== undefined) {
        r.setRequestHeader('Content-Type', request.contentType)
    }
    r.onreadystatechange = function() {
        if(r.readyState === 4) {
            request.callback(r.response)
        }
    }
    if (request.method === 'GET') {
        r.send()
    } else {
        r.send(request.data)
    }
}
// 传入毫秒时间生成2018/10/8 0:18:21格式
var formatTime = function(t) {
    var d = new Date(t)
    var nm = d.getFullYear()
    var yt = d.getMonth() + 1
    var ri = d.getDate()
    var ui = d.getHours()
    var ff = d.getMinutes()
    var mn = d.getSeconds()
    return `${nm}/${yt}/${ri} ${ui}:${ff}:${mn}`
}
