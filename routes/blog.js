const article = require('../model/article.js')
const articleTags = require('../model/articleTags.js')
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

// 只需要url：?articleID=1,即可删除对应文章
const del = {
    path: '/api/article/del',
    method: 'get',
    func: function(request, response) {
        // 要删除的articleID
        var articleID = request.query.articleID

        article.del(articleID)
        articleTags.del(articleID)

        response.send('删除成功')
    }
}

const articleID = {
    path: '/api/articleID',
    method: 'get',
    func: function(request, response) {
        var articleID = request.query.articleID
        console.log('articleID', articleID);
        var data = article.articleID(articleID)
        var r = JSON.stringify(data)
        response.send(r)
    }
}
// // 提供id，修改内容(除了id、时间，全修改了！)
// const changeArticle = {
//     path: '/api/article/changeArticle',
//     method: 'post',
//     func: function(request, response) {
//         /*
//         form = {
//             // id是指文章id
//             id: number,
//             // 下面俩直接替换
//             title: '',
//             intro:'' ,
//             // 标签就把原来的全删了，重新加关系表
//             tags:[]
//         }
//
//         */
//         // 需要把修改完后的数据返回给浏览器
//         var form = request.body
//         var b = article.change(form)
//         var r = JSON.stringify(b)
//         response.send(r)
//     }
// }
//
// const changeTags = {
//     path: '/api/article/changeTags',
//     method: 'post',
//     func: function(request, response) {
//         /*
//         form = {
//             // id是指文章id
//             id: number,
//             // 下面俩直接替换
//             title: '',
//             intro:'' ,
//             // 标签就把原来的全删了，重新加关系表
//             tags:[]
//         }
//
//         */
//         // 需要把修改完后的数据返回给浏览器
//         var form = request.body
//         var b = tags.change(form)
//         var r = JSON.stringify(b)
//         response.send(r)
//     }
// }
const routes = [
    all,
    add,
    del,
    articleID
]

module.exports.routes = routes
