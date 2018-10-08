const blog = require('../model/blog.js')

const all = {
    path: '/api/blog/all',
    method: 'get',
    func: function(request, response) {
        // 这里用到的是model的处理函数，读取json文件里的文章数据
        var articles = blog.all()
        var r = JSON.stringify(articles)
        response.send(r)
    }
}

const add = {
    path: '/api/blog/add',
    method: 'post',
    func: function(request, response) {
        // request就是浏览器发过来的数据
        // （因为配置了body-parser给app，所以可以直接获取到）
        var form = request.body

        var b = blog.new(form)
        var r = JSON.stringify(b)
        response.send(r)
    }
}

const routes = [
    all,
    add
]

module.exports.routes = routes
