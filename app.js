const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// 导入路由模块
/*
以indexRouter路由模块为例，它导出格式如下：
{
  routes: [
    { path: '/', method: 'get', func: [Function: func] },
    { path: '/article', method: 'get', func: [Function: func] },
    { path: '/tags', method: 'get', func: [Function: func] },
    { path: '/admin', method: 'get', func: [Function: func] }
  ]
}
*/
const indexRouter = require('./routes/index')
const articleRouter = require('./routes/blog')
const commentRouter = require('./routes/comment')
const tagsRouter = require('./routes/tags')

app.use(bodyParser.json())
// 配置静态文件目录
app.use(express.static('static'))


// 路由配置函数
const registerRoutes = function(app, routes) {
    // 通过循环简便配置路由（路由格式参考顶部注释）
    for (var i = 0; i < routes.length; i++) {
        var router = routes[i]
        app[router.method](router.path, router.func)
    }
}
// 参数二是导入的路由模块
registerRoutes(app, indexRouter.routes)
registerRoutes(app, articleRouter.routes)
registerRoutes(app, commentRouter.routes)
registerRoutes(app, tagsRouter.routes)


//
app.listen(3000, function() {
    console.log('服务器启动成功, 本地3000端口');
})
