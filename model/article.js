const fs = require('fs')

const articleFilePath = 'db/article.json'

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
    var articles = this.data
    return articles
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
