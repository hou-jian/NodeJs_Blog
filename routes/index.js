const express = require('express')
const router = express.Router()
const fs = require('fs')

// 需要文章data
// 评论data

router.get('/', function(req, res) {
    res.send('hello, express')
})

const sendHtml = function(path, response) {
    var options = {
        encoding: 'utf-8'
    }
    path = 'template/' + path
    fs.readFile(path, options, function(err, data) {
        console.log(`读取的html文件 ${path} 内容是`, data)
        response.send(data)
    })
}

const index = {
    path: '/',
    method: 'get',
    func: function(request, response) {
        var path = 'index.html'
        sendHtml(path, response)
    }
}

const routes = [
    index
]

module.exports.routes = routes
