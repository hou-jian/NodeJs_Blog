const article = require('../model/article.js')

// 获取所有文章，不包括文章内容
const all = {
    path: '/api/article/all',
    method: 'get',
    func: function(request, response) {

        // 读取文章数据（article见第一行）
        var data = article.all()
        var r = JSON.stringify(data)
        response.send(r)
    }
}

// 添加文章
const add = {
    path: '/api/article/add',
    method: 'post',
    func: function(request, response) {
        // request就是浏览器发过来的数据
        // （因为配置了body-parser给app，所以可以直接获取到）
        var form = request.body
        // 密码验证
        if (form.password !== '410410') {
            response.send('添加文章失败，密码错误！')
            return
        }

        // 把数据给：model/article模块
        var b = article.new(form)

        // 把处理有的数据返回给浏览器
        var r = JSON.stringify(b)
        response.send(r)
    }
}

const routes = [
    all,
    add
]

module.exports.routes = routes
