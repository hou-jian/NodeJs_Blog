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

// 给单个文章(articleID)，添加多个tagID(数组方式)
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
    }

    this.save()


}

// 删除包含articleID的所有项
b.del = function(id) {
    var d = this.data
    // 存放需要删除的对象下标
    var l = []
    for (var i = 0; i < d.length; i++) {
        if (d[i].articleID == id) {
            l.push(i)
        }
    }

    // 计数，因为删了一个，this.data会变短
    var j = 0
    for (var i = 0; i < l.length; i++) {
        this.data.splice(l[i] - j, 1)
        j++
    }
    this.save()
}

// 根据tagID 返回所有的articleID
b.articleIDTagsAll = function(id) {
    var d = this.data
    //
    var l = []
    for (var i = 0; i < d.length; i++) {
        if (d[i].tagsID == id) {
            l.push(d[i].articleID)
        }
    }
    // 返回tagsID对应的articleID数组
    return l
}

// 返回包含tagsID的articleID数组
b.getTagsIdArticleIdObj = function() {
    var l = this.data
    // 存放查重tagsID
    var arr = []
    // 待返回对象
    var data = {}
    //
    for (var i = 0; i < l.length; i++) {
        var tagsID = l[i].tagsID
        var articleID = l[i].articleID
        // key不存在初始化
        if (arr.indexOf(tagsID) == -1) {
            data[tagsID] = []
            data[tagsID].push(articleID)
            arr.push(tagsID)
        } else {
            // key存在，直接添加
            data[tagsID].push(articleID)
        }
    }
    var a = []
    a.push(arr)
    a.push(data)
    return a
}

// 添加点个关系项
b.addSingle = function(articleID, tagsID) {
    var m = new ModelTags(articleID, tagsID)
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

// 根据文章id，返回tagId数组
b.returnTagsIDArr = function(id) {
    // 读取article&tags.json
    var d = this.data

    var tagsIDArr = []
    for (var i = 0; i < d.length; i++) {
        var item = d[i]
        if (id == item.articleID) {
            tagsIDArr.push(item.tagsID)
        }
    }
    return tagsIDArr
}

// 删除同时包含文章和标签id的项，成功返回true，否则false
b.delSingle = function(articleId, tagId) {
    // console.log('artilceid', articleId);
    // console.log('tagid', tagId);
    var d = this.data
    for (var i = 0; i < d.length; i++) {
        if (d[i].articleID === articleId && d[i].tagsID === tagId) {
            this.data.splice(i, 1)
            this.save()
            return true
        }
    }

    return false
}
module.exports = b
