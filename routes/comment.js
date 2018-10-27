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

// 根据articleID获取评论
const articleAll = {
    path: '/api/comment',
    method: 'get',
    func: function(request, response) {
        var articleID = request.query.articleID
        console.log('articleID', articleID);

        var data = comment.articleIDall(articleID)
        var r = JSON.stringify(data)
        response.send(r)
    }

}

// 根据id删除
const del = {
    path: '/api/comment/del',
    method: 'post',
    func: function(request, response) {
        var form = request.body
        // 密码验证
        if (form.password !== '410410') {
            response.send(JSON.stringify('密码错误'))
            return
        }
        var commentId = form.commentID
        console.log('commentId', commentId);

        var b = comment.del(commentId)
        if (b) {
            var r = JSON.stringify('删除成功')
            response.send(r)
        } else {
            var r = JSON.stringify('删除失败')
            response.send(r)
        }

    }
}
const routes = [
    add,
    articleAll,
    del
]

module.exports.routes = routes
