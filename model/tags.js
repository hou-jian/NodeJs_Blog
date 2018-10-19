const fs = require('fs')

const tagsFilePath = 'db/tags.json'

// 用于存储article数据
const ModelTags = function(name) {
    this.tagName = name
}

// 读取文章数据，并返回
const loadTags = function() {
    var tags = fs.readFileSync(tagsFilePath, 'utf-8')
    var d = JSON.parse(tags)
    return d
}

const b = {
    data: loadTags()
}

b.all = function() {
    // 读取tags.json数据
    var d = this.data
    
    return d
}

b.save = function() {
    var s = JSON.stringify(this.data)
    fs.writeFile(tagsFilePath, s, (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log('保存成功')
        }
    })
}

const tagsNameChecking = function(name, data) {
    for (var i = 0; i < data.length; i++) {
        if (name == data[i].tagName) {
            return data[i].id
        }
    }
    return false
}

// arr为存放tagsName的数组
b.new = function(arr) {
    // 因为一次可能有多个标签，用于存放tagsID
    var tagsIDArray = []
    var tagsData = this.data
    for (var i = 0; i < arr.length; i++) {
        // arr[i],在this.data中不保存
        var a = tagsNameChecking(arr[i], tagsData)
        if (a) {
            tagsIDArray.push(a)
        } else {
            var m = new ModelTags(arr[i])
            // 给新数据添加唯一id
            var d = this.data[this.data.length - 1]
            if (d == undefined) {
                m.id = 1
            } else {
                m.id = d.id + 1
            }

            // 添加并保存给tags.json
            this.data.push(m)

            tagsIDArray.push(m.id)
        }
    }

    this.save()

    return tagsIDArray
}

b.returnTagsName = function(tagsID) {
    var d = this.data
    for (var i = 0; i < d.length; i++) {
        if (d[i].id == tagsID) {
            return d[i].tagName
        }
    }
}

module.exports = b
