const fs = require('fs')

const commentFilePath = 'db/comment.json'

// 用于存储article数据
const ModelComment = function(form) {
    this.time = Math.floor(new Date() / 1000)
    this.content = form.content || ''
    this.name = form.name || 'default'
    this.email = form.email || ''
    this.articleID = form.articleID || NaN
}

// 读取文章数据，并返回
const loadCommint = function() {
    var content = fs.readFileSync(commentFilePath, 'utf-8')
    var d = JSON.parse(content)
    return d
}

const b = {
    data: loadCommint()
}

b.all = function() {
    // 读取首页所需数据
    var content = this.data
    return content
}

b.save = function() {
    var s = JSON.stringify(this.data)
    fs.writeFile(commentFilePath, s, (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log('保存成功')
        }
    })
}

b.new = function(form) {

    var m = new ModelComment(form)

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
    return m
}

b.articleIDall = function(id) {
    // 读取所有评论数据
    var d = this.data

    var l = []

    for (var i = 0; i < d.length; i++) {
        var a = {}
        if (d[i].articleID == id) {
            a.time = d[i].time
            a.content = d[i].content
            a.name = d[i].name
            a.id = d[i].id
            l.push(a)
        }
    }

    return l
}

b.del = function(commentId) {
    var d = this.data
    var boo = false
    d.forEach((item, index) => {
        if (item.id == commentId) {
            // console.log('index', index);
            this.data.splice(index, 1)
            this.save()
            boo =  true
        }
    })
    return boo
}
module.exports = b
