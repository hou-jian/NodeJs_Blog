const express = require('express')
const router = express.Router()
const fs = require('fs')

// 用于读取template里的html文件并返回给浏览器
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

const article = {
    path: '/article',
    method: 'get',
    func: function(request, response) {
        var path = 'article.html'
        sendHtml(path, response)
    }
}

const tags = {
    path: '/tags',
    method: 'get',
    func: function(request, response) {
        var path = 'tags.html'
        sendHtml(path, response)
    }
}
const uploadArticle = {
    path: '/up',
    method: 'get',
    func: function(request, response) {
        var path = 'uploadArticle.html'
        sendHtml(path, response)
    }
}
const routes = [
    index,
    article,
    tags,
    uploadArticle
]

module.exports.routes = routes
