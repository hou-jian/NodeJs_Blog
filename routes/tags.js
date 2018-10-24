const articleTags = require('../model/articleTags.js')
const article = require('../model/article.js')
const tags = require('../model/tags.js')

// 返回给浏览器，tagsID：所有文章数据键值对\tags数据\文章数据
const all = {
    path: '/api/tags/all',
    method: 'get',
    func: function(request, response) {
        var data = []
        data[0] = articleTags.getTagsIdArticleIdObj()
        data[1] = tags.all()
        data[2] = article.dataAll()


        var r = JSON.stringify(data)
        response.send(r)
    }
}

// // 根据tagsID，返回对应的所有文章数据
// const articleAll = {
//     path: '/api/tagsID',
//     method: 'get',
//     func: function(request, response) {
//         // tagsID
//         var tagsID = request.query.tagsID
//         var data = []
//         // 返回tagsID对应的tagsName
//         var tagName = tags.returnTagsName(tagsID)
//         data.push(tagName)
//         // 返回tagsID对应的articleID数组
//         var articleIDArr = articleTags.articleIDTagsAll(tagsID)
//         console.log('articleIDArr', articleIDArr)
//
//         // 传给article model 返回文章数据
//         data.push(article.arrayIdAll(articleIDArr))
//
//         var r = JSON.stringify(data)
//         response.send(r)
//     }
// }

/* 提供
    {
        articleID: 1,
        tagName: xxx
    }
    给文章追加单个标签
*/

// 验证一篇文章添加标签时，标签名称是否重复
var repeated = function(form) {
    var tagIDArr = articleTags.returnTagsIDArr(form.articleID)
    // 根据tagIDArr，返回tagName数组
    var tagsNameArr = tags.returnTagsNameArr(tagIDArr)
    console.log('tagsNameArr', tagsNameArr);
    // 遍历tagsNameArr，如果和form.tagName重复返回 true
    for (var i = 0; i < tagsNameArr.length; i++) {
        if (form.tagName === tagsNameArr[i]) {
            return true
        }
    }
    return false
}


/*

ajax({
       method: 'post',
       url: '/api/tags/addSingle',
       contentType: 'application/json',
       data: JSON.stringify({articleID: 1, tagName: "测试"}),
       callback: function(response) {
           var res = JSON.parse(response)
           console.log('回调', response);

       }
   })
*/
const addSingle = {
    path: '/api/tags/addSingle',
    method: 'post',
    func: function(request, response) {
        var form = request.body
        // - 验证密码
        if (form.password !== '410410') {
            var r = JSON.stringify('添加失败, 密码错误')
            response.send(r)
            return
        }
        // - 验证form.articleID对应的tagName，是否重复
        var o = repeated(form)
        // 为true，说明标签重复，添加失败
        if (o) {
            var r = JSON.stringify('添加失败, 标签名重复')
            response.send(r)
            return
        }

        // 以下为正常添加


        // - 把form.tagName 传给tags model，返回id(注意重复的情况)
        var tagId = tags.addSingle(form.tagName)

        // - 把tagId与form.articleID 传给关系表并保存
        articleTags.addSingle(parseInt(form.articleID), tagId)
        var r = JSON.stringify('添加成功')
        response.send(r)
    }

}

// form.articleID
// form.tagID
// form.password
const delSingle = {

    path: '/api/tags/del',
    method: 'post',
    func: function(request, response) {
        var form = request.body
        // 密码验证
        if (form.password !== '410410') {
            var r = JSON.stringify('添加失败, 密码错误')
            response.send(r)
            return
        }

        // 传给articleTags model 删除同时包含这两个的数据
        var articleId = parseInt(form.articleID)
        console.log('form', form.tagID);
        var tagId = parseInt(form.tagID)
        var b = articleTags.delSingle(articleId, tagId)
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
    all,
    addSingle,
    delSingle
]

module.exports.routes = routes
