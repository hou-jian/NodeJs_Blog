const fs = require('fs')
const tags = require('./tags')
const articleTags = require('./articleTags')

const articleFilePath = 'db/article.json'

// 用于存储article数据
const ModelArticle = function(form) {
    this.title = form.title || ''
    this.time = Math.floor(new Date() / 1000)
    this.intro = form.intro || ''
    this.content = form.content || ''
}

// 根据文章id，返回tagId数组
const returnTagsIDArr = function(id) {
    // 读取article&tags.json
    var articleTagsData = articleTags.all()

    var tagsIDArr = []
    for (var i = 0; i < articleTagsData.length; i++) {
        var item = articleTagsData[i]
        if (id === item.articleID) {
            tagsIDArr.push(item.tagsID)
        }
    }
    return tagsIDArr
}
// 根据tagId数组，返回tagName数组
const returnTagsNameArr = function(tagsIDArr) {
    // 读取tags.json
    var tagsData = tags.all()

    var tagsArr = []
    for (var i = 0; i < tagsIDArr.length; i++) {
        for (var j = 0; j < tagsData.length; j++) {
            if (tagsIDArr[i] === tagsData[j].id) {
                tagsArr.push(tagsData[j].tagName)
                break
            }
        }
    }
    return tagsArr

}
// 读取文章数据，并返回
const loadArticle = function() {
    var content = fs.readFileSync(articleFilePath, 'utf-8')
    var d = JSON.parse(content)
    return d
}

const b = {
    data: loadArticle()
}

b.all = function() {
    var data = []
    // 读取首页所需数据
    var content = this.data
    if (content.length === 0) {
        return data
    }

    // l存放返回的数据
    for (var i = 0; i < content.length; i++) {
        var l = {}
        var item = content[i]
        // console.log('item', item);
        l.title = item.title
        l.time = item.time
        l.id = item.id
        l.intro = item.intro
        // 比较item.id 与 对照表里的article.id，返回tagsID数组

        var tagsIDArr = returnTagsIDArr(item.id)

        // 比对tagsID与id，取出tagsName
        var tagsNameArr = returnTagsNameArr(tagsIDArr)
        // 添加给l
        l.tagsIDArr = tagsIDArr
        l.tags = tagsNameArr

        data.push(l)
    }
    // 返回

    return data
}

b.save = function() {
    var s = JSON.stringify(this.data)
    fs.writeFile(articleFilePath, s, (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log('保存成功')
        }
    })
}

b.new = function(form) {
    var m = new ModelArticle(form)

    // 给新数据添加唯一id
    var d = this.data[this.data.length - 1]

    if (d === undefined) {
        m.id = 1
    } else {
        m.id = d.id + 1
    }


    // 添加并保存给article.json
    this.data.push(m)
    this.save()

    // 把tags数组传给tags模块，需要返回tagsID数组
    var tagsIDArr = tags.new(form.tags)

    // 把m.id,tagsID传给关系表保存
    articleTags.new(m.id, tagsIDArr)
    return m
}

b.del = function(articleID) {
    var d = this.data
    for (var i = 0; i < d.length; i++) {
        if (d[i].id == articleID) {
            this.data.splice(i, 1)
            this.save()
            return true
        }
    }

    return false
}

// 根据文章id，返回{{文章数据},[标签数组],[标签名称数组]}
b.articleID = function(id) {
    // 找出article对应ID的数据
    var d = this.data
    for (var i = 0; i < d.length; i++) {
        if (id == d[i].id) {
            var item = d[i]
            // 比较item.id 与 对照表里的article.id，返回tagsID数组
            var tagsIDArr = returnTagsIDArr(item.id)

            // 比对tagsID与id，取出tagsName
            var tagsNameArr = returnTagsNameArr(tagsIDArr)
            item.tagsIDArr = tagsIDArr
            item.tags = tagsNameArr
            return item
        }
    }
}

// 根据参数(数组)各项的id,找出对应的数据,并返回
b.arrayIdAll = function(arr) {
    var l = []
    var d = this.data
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < d.length; j++) {
            if (arr[i] == d[j].id) {
                l.push(d[j])
                break
            }
        }
    }

    return l
}

b.dataAll = function() {
    return this.data
}

// 传入，id， 内容
b.alterArticleContent = function (id, content) {
    var d = this.data
    for (var i = 0; i < d.length; i++) {
        if (d[i].id == id) {
            this.data[i].content = content
            // console.log('this.data', this.data[i]);
            this.save()
            return true
        }
    }
    return false
}
// // form存了需要修改的数据
// b.change = function(form) {
//     // 1.获取上传数据的文章ID
//     var id = form.id
//     // 2.修改article.json对应文件
//     var articleData = this.data
//
//     // 3.把修改后的数据返回
// }

module.exports = b
