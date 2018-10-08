const fs = require('fs')
const tags = require('./tags')
const articleFilePath = 'db/blog.json'

// 用于存储article数据
const ModelArticle = function(form) {
    this.title = form.title || ''
    this.articleTime = Math.floor(new Date() / 1000)
    this.articleIntro = form.articleIntro || ''
    this.articleContent = form.articleContent || ''
    this.articleTags = form.articleTags || []
}

// 读取文章数据，并返回
const loadArticle = function() {
    var content = fs.readFileSync(articleFilePath, 'utf-8')
    var articles = JSON.parse(content)
    return articles
}

const b = {
    data: loadArticle()
}

b.all = function() {
    // 读取blog.json数据
    var blog = this.data
    //读取tags数据
    var tagsAll = tags.all()

    console.log('blog', blog);
    console.log("tagsall", tagsAll)
    // 把属于blog[i]的标签添加给blog，用articleTags保存
    for (var i = 0; i < blog.length; i++) {
        var l = []
        var blogID = blog[i].id
        for (var j = 0; j < tagsAll.length; j++) {
            var t = tagsAll[j].blogID
            if (blogID === t) {
                l.push(tagsAll[j].tagsContent)
            }
        }
        blog[i].articleTags = l
    }
    return blog
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
    var d = this.data[this.data.length - 1]
    if (d == undefined) {
        m.id = 1
    } else {
        m.id = d.id + 1
    }
    this.data.push(m)
    this.save()
    return m
}

module.exports = b
