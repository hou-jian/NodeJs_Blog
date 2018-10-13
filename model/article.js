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

const returnTagsIDArr = function(id, article_tags) {
    var tagsIDArr = []
    for (var i = 0; i < article_tags.length; i++) {
        var item = article_tags[i]
        if (id === item.articleID) {
            tagsIDArr.push(item.tagsID)
        }
    }
    return tagsIDArr
}
const returnTagsNameArr = function(tagsIDArr, tags) {
    var tagsArr = []
    for (var i = 0; i < tagsIDArr.length; i++) {
        for (var j = 0; j < tags.length; j++) {
            if (tagsIDArr[i] === tags[j].id) {
                tagsArr.push(tags[j].tagName)
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
    // console.log('content', content);
    // 读取article&tags.json
    var articleTagsData = articleTags.all()
    // console.log("articleTagsData", articleTagsData);
    // 读取tags.json
    var tagsData = tags.all()
    // console.log('tagsData', tagsData);
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

        var tagsIDArr = returnTagsIDArr(item.id, articleTagsData)
        // console.log('tagsIDArr', tagsIDArr);
        // 比对tagsID与id，取出tagsName
        var tagsNameArr = returnTagsNameArr(tagsIDArr, tagsData)
        // 添加给l
        l.tags = tagsNameArr
        console.log('l', l);
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
    console.log('ddd', d == undefined);
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

module.exports = b
