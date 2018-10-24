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
        console.log(`读取了 ${path}文件 `)
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

const admin = {
    path: '/admin',
    method: 'get',
    func: function(request, response) {
        var path = 'admin.html'
        sendHtml(path, response)
    }
}

const routes = [
    index,
    article,
    tags,
    admin
]

module.exports.routes = routes
