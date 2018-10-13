const fs = require('fs')

const filePath = 'db/article&tags.json'

// 用于存储article数据
const ModelTags = function(articleID, tagsID) {
    this.articleID = articleID
    this.tagsID = tagsID
}

// 读取文章数据，并返回
const load = function() {
    var content = fs.readFileSync(filePath, 'utf-8')
    var d = JSON.parse(content)
    return d
}

const b = {
    data: load()
}

b.all = function() {
    // 读取tags.json数据
    var d = this.data
    return d
}

b.save = function() {
    var s = JSON.stringify(this.data)
    fs.writeFile(filePath, s, (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log('保存成功')
        }
    })
}

// arr为存放tagsName的数组
b.new = function(articleID, tagsIDArr) {

    for (var i = 0; i < tagsIDArr.length; i++) {
        var m = new ModelTags(articleID, tagsIDArr[i])
        // 给新数据添加唯一id
        var d = this.data[this.data.length - 1]
        if (d == undefined) {
            m.id = 1
        } else {
            m.id = d.id + 1
        }
        this.data.push(m)
        this.save()
    }



}

module.exports = b
