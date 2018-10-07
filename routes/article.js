const article = require('../model/article.js')

const all = {
    path: '/api/article/all',
    method: 'get',
    func: function(request, response) {
        var articles = article.all()
        var r = JSON.stringify(articles)
        response.send(r)
    }
}

const add = {
    path: '/api/article/add',
    method: 'post',
    func: function(request, response) {
        // request就是浏览器发过来的数据
        // （因为配置了body-parser给app，所以可以直接获取到）
        var form = request.body

        var b = article.new(form)
        var r = JSON.stringify(b)
        response.send(r)
    }
}

const routes = [
    all,
    add
]

module.exports.routes = routes
