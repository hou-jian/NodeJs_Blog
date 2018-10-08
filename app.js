const express = require('express')
const app = express()
const bodyParser = require('body-parser')
// 导入路由模块
const indexRouter = require('./routes/index')
const articleRouter = require('./routes/blog')

app.use(bodyParser.json())
// 配置静态文件目录
app.use(express.static('static'))


// 路由配置函数
const registerRoutes = function(app, routes) {
    // 通过循环简便配置路由
    for (var i = 0; i < routes.length; i++) {
        var router = routes[i]
        app[router.method](router.path, router.func)
    }
}
// 这里的第二个参数，是router模块导入的
registerRoutes(app, indexRouter.routes)
registerRoutes(app, articleRouter.routes)


//
app.listen(3000, function() {
    console.log('服务器启动成功');
})
