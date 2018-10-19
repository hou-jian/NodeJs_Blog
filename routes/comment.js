const comment = require('../model/comment.js')

// 获取制定文章所有评论，
const add = {
    path: '/api/comment/add',
    method: 'post',
    func: function(request, response) {
        var form = request.body
        console.log('form', form);
        var data = comment.new(form)
        var r = JSON.stringify(data)
        response.send(r)
    }
}

const articleAll = {
    path: '/api/comment',
    method: 'get',
    func: function(request, response) {
        // articleID
        var articleID = request.query.articleID
        var data = comment.articleIDall(articleID)
        var r = JSON.stringify(data)
        response.send(r)
    }

}
const routes = [
    add,
    articleAll
]

module.exports.routes = routes
