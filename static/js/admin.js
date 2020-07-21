var readFileContent = function(callback) {
    //
    var file = document.getElementById('file')
    var files = file.files
    // console.log("files", files[0]);
    if (files[0] !== undefined) {
        // 实例化FileReader对象,以使用其方法
        var reader = new FileReader();
        // 使用readAsText方法，读取files[0](第一个文件)中的数据
        reader.readAsText(files[0], 'utf-8')

        // 错误触发事件
        reader.onerror = function() {
            alert('读取错误')
        }

        // 读取完成后执行函数
        reader.onload = function() {
            var t = this.result
            callback(t)
        }
    } else {
        alert('未添加文章')
        return
    }
}

var getFormData = function(form) {

    // 需要获取数据的dom元素名称
    var arrID = ['title', 'intro', 'tags', 'password']
    for (var i = 0; i < arrID.length; i++) {
        var name = arrID[i]
        var dom = e('#' + name)
        var value = dom.value
        form[name] = value
    }
    // 吧tags该为数组
}

var handleTags = function(form) {

    var data = form.tags
    // console.log('data', data);
    var l = []

    while (true) {
        // 获取|下标
        var index = data.indexOf('|')
        // 找不到‘|’,说明切割完毕，返回l
        if (index === -1) {
            l.push(data)
            form.tags = l
            return
        }
        // 切割
        var item = data.slice(0, index)
        l.push(item)
        // 切剩下的data
        data = data.slice(index + 1)
    }

}

var upData = function() {
    // 获取dom
    var up = e('#up')

    bindEvent(up, 'click', function() {

        // 用于存储form数据
        var form = {}


        // 1. 添加数据到form
        getFormData(form)
        // 2. 读取文章数据，添加给form
        readFileContent(function(t) {

            form.content = t
            // 3.转换tags为array
            handleTags(form)
            // console.log('form准备完毕, 即将上传！', form);
            // 4. 准备完毕上传给服务器
            ajax({
                method: 'post',
                url: '/api/article/add',
                contentType: 'application/json',
                data: JSON.stringify(form),
                callback: function(r) {
                    console.log('回调', r)
                }
            })
        })


    })

}

var tabToggle = function(num) {
    for (var i = 0; i < 4; i++) {
        var n = '#tab' + i
        var dom = e(n)
        // console.log('1', dom);
        if (i == num) {
            dom.style.display = "block"
            continue
        }

        dom.style.display = "none"
    }
}

var toggleNav = function() {
    // 获取nav
    var nav = e('.nav')
    bindEvent(nav, 'click', function(e) {
        var target = e.target
        // console.log('taget', target);
        if (target.nodeName === 'LI') {
            var name = target.dataset.name
            tabToggle(name)
        }
    })
}

var addArticleTag = function() {
    var dom = e('#articleID-tag')
    var articleID = e('.articleID-tag')
    var tagName = e('.tagName-tag')
    var password = e('#password')

    bindEvent(dom, 'click', function() {
        var form = {}
        form.articleID = articleID.value
        form.tagName = tagName.value
        form.password = password.value
        if (form.articleID == false) {
            alert('文章id不能为空')
            return
        } else if (form.tagName == false) {
            alert('标签名不能为空')
            return
        }
        ajax({
            method: 'post',
            url: '/api/tags/addSingle',
            contentType: 'application/json',
            data: JSON.stringify(form),
            callback: function(r) {
                var data = JSON.parse(r)
                alert(data)
            }
        })
    })


}

var delArticleTag = function() {
    var articleID = e('.articleID-del')
    var tagID = e('.tagID-del')
    var password = e('#password')
    var dom = e('#articleID-del-Tag')
    bindEvent(dom, 'click', function() {
        var form = {}
        form.articleID = articleID.value
        form.tagID = tagID.value
        form.password = password.value
        console.log('form', form);
        ajax({
            method: 'post',
            url: '/api/tags/del',
            contentType: 'application/json',
            data: JSON.stringify(form),
            callback: function(r) {
                var data = JSON.parse(r)
                alert(data)
            }
        })
    })

}


// 返回文章列表项dom模板
var returnArticleTemplate = function(item) {
    var t = `
    <div class="article-list-item">
        <span class="article-id">ID: ${item.id}</span>
        <br>
        <span class="article-title">${item.title}</span>
        <a href="#" data-id=${item.id}>点击展开评论</a>
        <div class="article-comment-list${item.id}"></div>
    </div>
    `
    return t
}
// 渲染文章dom列表
var renderArticle = function(data) {
    // 遍历articleData,渲染到class="article-list"中
    var articleList = e('.article-list')
    var content = ''

    data.forEach(function(item) {
        var t = returnArticleTemplate(item)
        content = content + t
    })

    articleList.innerHTML = content

}

// 返回评论dom模板
var returnCommentDom = function(data) {

    var time = formatTime(data.time * 1000)
    var t = `
    <div class="article-comment" style="border: 1px solid #ccc;">
        <span>id:${data.id}</span>
        <span>发布时间:${time}</span>
        <span>用户名:${data.name}</span>
        <br>
        <span>内容${data.content}</span>
        <a href="#" data-id=${data.id}>点击删除</a>
    </div>
    `
    return t
}
// 渲染评论列表
var renderComment = function(articleID, data) {
    var name = '.article-comment-list' + articleID
    var dom = e(name)
    if (data.length === 0) {
        dom.innerHTML = '<span>没有评论</span>'
        return
    }
    var t = ''
    for (var i = 0; i < data.length; i++) {
        var d = returnCommentDom(data[i])
        t = t + d
    }
    dom.innerHTML = t
}

// 点击获取评论数据并渲染到页面.article-comment-list + articleID
var clickGetAndRenderComment = function() {
    // article-list
    var articleList = e('.article-list')
    bindEvent(articleList, 'click', function(e) {
        e.preventDefault()
        var target = e.target

        if (target.innerHTML === '点击展开评论') {
            var articleID = target.dataset.id
            // console.log('articleID', articleID);
            // 发送ajax获取评论
            var url = '/api/comment?articleID=' + articleID

            ajax({
                method: 'get',
                url: url,
                callback: function(r) {
                    var data = JSON.parse(r)
                    // console.log('回调', data)
                    // - 渲染评论列表
                    renderComment(articleID, data)
                }
            })
        }
    })
}

var clickDelComment = function() {
    var articleList = e('.article-list')
    bindEvent(articleList, 'click', function(event) {
        event.preventDefault()
        var target = event.target
        if (target.innerHTML === '点击删除') {
            var commentID = target.dataset.id

            var form = {}
            form.password = e('#password').value
            form.commentID = commentID

            ajax({
                method: 'post',
                url: '/api/comment/del',
                contentType: 'application/json',
                data: JSON.stringify(form),
                callback: function(r) {
                    var data = JSON.parse(r)

                    if (data === '删除成功') {
                        target.parentElement.remove()
                    } else {
                        alert(data)
                    }
                }
            })
        }
    })
}
var delCommon = function() {
    // 点击展开获取文章对应评论
    clickGetAndRenderComment()
    // 点击删除评论
    clickDelComment()
}

var getAndRenderArticle = function() {
    ajax({
        method: 'get',
        url: '/api/article/all',
        callback: function(r) {
            // console.log('回调', r)
            var data = JSON.parse(r)
            // 渲染文章数据
            renderArticle(data)
        }
    })
}
var returnArticleListTwoDom = function(item) {

    var time = formatTime(item.time * 1000)

    var t = `
    <div class="article-content" style="border: 1px solid #ccc;">
        <span>${item.id}</span>
        <span>${item.title}</span>
        <span>${time}</span>
        <a href="#" data-id=${item.id}>点击修改内容</a>
        <a href="#" data-id=${item.id}>点击删除</a>
    </div>
    `
    return t
}
// 渲染文章列表(文章修改页)
var renderArticleTwo = function(data) {
    var articleList = e('.article-list-two')
    var t = ''
    data.forEach(function(item) {
        // 返回dom结构
        var d = returnArticleListTwoDom(item)
        t = t + d

    })
    articleList.innerHTML = t

}


var renderArticleContent = function(data) {
    var articleAlter = e('.article-alter')
    var t = `
        <h2>文章内容修改</h2>
        <textarea id="textarea" rows="30" cols="100">${data.content}</textarea>
        <button class="article-alter-up" data-id="${data.id}">提交</button>
    `
    articleAlter.innerHTML = t
}
var clickReaderArticleContent = function(callback) {

    // 绑定点击事件
    var articleList = e('.article-list-two')
    bindEvent(articleList, 'click', function(event) {
        var target = event.target
        if (target.innerHTML === '点击修改内容') {
            // 获取到点击的id
            var id = target.dataset.id
            // 获取到id对应的数据
            var url = '/api/articleID?articleID=' + id
            ajax({
                method: 'get',
                url: url,
                callback: function(r2) {
                    var data2 = JSON.parse(r2)
                    // console.log('data2', data2);
                    // 渲染文章内容
                    renderArticleContent(data2)
                    // 渲染了才能调用这个发送数据
                    callback()
                }
            })
        }
    })
}

var clickAlterButtonUp = function() {
    // 获取提交按钮
    var but = e('.article-alter-up')
    var textarea = e('#textarea')
    // 绑定事件，获取文本框内容，和文章id
    bindEvent(but, 'click', function() {
        var form = {}
        form.content = textarea.value
        form.id = but.dataset.id
        form.password = e('#password').value
        // ajax提交给服务端
        ajax({
            method: 'post',
            url: '/api/articleID/alter',
            contentType: 'application/json',
            data: JSON.stringify(form),
            callback: function(r) {
                var data = JSON.parse(r)
                // console.log(data);
                if (data === true) {
                    // textarea.value = ''
                    alert('修改成功')
                } else if (data === false) {
                    alert('修改失败')
                } else {
                    alert(data)
                }
            }
        })
    })
}

var clickDelArticle = function() {
    // 绑定点击事件
    var articleList = e('.article-list-two')
    bindEvent(articleList, 'click', function(event) {
        var target = event.target

        if (target.innerHTML === '点击删除') {
            // console.log('1');
            var form = {}
            form.password = e('#password').value
            // 获取到点击的id
            form.articleID = target.dataset.id

            ajax({
                method: 'post',
                url: '/api/article/del',
                contentType: 'application/json',
                data: JSON.stringify(form),
                callback: function(r) {
                    var data = JSON.parse(r)
                    if (data === true) {
                        target.parentElement.remove()
                    }
                    alert(data)
                }
            })
        }
    })
}

var articleContentAlter = function() {
    // 获取文章数据
    ajax({
        method: 'get',
        url: '/api/article/all',
        callback: function(r) {
            // console.log('回调', r)
            var data = JSON.parse(r)
            // 渲染到article-list-two
            renderArticleTwo(data)

        }
    })
    // 点击修改内容，获取文章对应的data，并渲染到页面
    clickReaderArticleContent(function() {
        // 点击article-alter-up提交按钮，获取内容和文章id，提交给服务端
        clickAlterButtonUp()
    })

    // 点击删除文章，删除对应内容
    clickDelArticle()

}
var __main = function() {
    // 获取到article数据,并渲染文章页面
    getAndRenderArticle()

    // toggleNav
    toggleNav()

    // 上传文章数据
    upData()

    // 单篇文章追加tag
    addArticleTag()

    // 单篇文章标签删除功能
    delArticleTag()

    // 评论删除功能
    delCommon()

    // 文章内容修改功能
    articleContentAlter()
}

__main()
