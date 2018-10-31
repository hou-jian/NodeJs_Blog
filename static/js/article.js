var renderMarkdown = function(data) {
    // 修改标题
    e('.article-title-h1').innerHTML  = data.title
    e('.article-content').innerHTML = marked(data.content, {
        // 代码高亮设置
        highlight: function(code) {
            // 这里用的highlightAuto
            return hljs.highlightAuto(code).value;
        }
    })
    // 修改标签
    //
    var tagsDom = e('.tags-list')
    if (data.tags.length == 0) {
        tagsDom.insertAdjacentHTML('beforeend', `<li class="tags-list-item"><a href="/tags">未添加标签</a></li>`)

    }
    for (var i = 0; i < data.tags.length; i++) {
        tagsDom.insertAdjacentHTML('beforeend', `<li class="tags-list-item"><a href="/tags#${data.tagsIDArr[i]}">${data.tags[i]}</a></li>`)

    }
}

var getArticleData = function() {
    var u = '/api/articleID?articleID=' + articleID

    // 获取到对应id的文章
    ajax({
        method: 'GET',
        url: u,
        contentType: 'application/json',
        callback: function(response) {
            var res = JSON.parse(response)
            // console.log('回调', response);
            renderMarkdown(res)
        }
    })
}

var returnCommentDom = function(form) {

    var time = formatTime(form.time * 1000)

    var d = `
    <div class="comment-list">
        <div class="comment-icon"><img src="/img/default-icon.png"></div>
        <div class="comment-list-box">
            <div class="comment-username">${form.name}</div>
            <div class="comment-time">${time}</div>
            <div class="comment-content">${form.content}</div>
        </div>
    </div>
    `
    //这是二级回复的，需要再加 <button class="comment-reply">回复</button>
    return d
}

var renderComment = function(form) {
    // 获取comment
    var comment = e('.number-of-comments')
    // 渲染dom
    var dom = returnCommentDom(form)
    // 添加到页面
    comment.insertAdjacentHTML('afterend', dom)
}

var addComment = function() {

    // 获取.comment-submit
    var sub = e('.comment-submit')
    //
    var form = {}
    bindEvent(sub, 'click', function() {
        form.articleID = Number(articleID)
        form.name = e('#formName').value
        form.email = e('#formMail').value
        form.content = e('#formContent').value

        // 内容不能为空
        if (form.content == '') {
            return
        }

        e('#formContent').value = ''
        NProgress.start()
        NProgress.inc()
        ajax({
            method: 'post',
            url: '/api/comment/add',
            contentType: 'application/json',
            data: JSON.stringify(form),
            callback: function(response) {
                var res = JSON.parse(response)
                // 把新添加的评论渲染到页面
                renderComment(res)
                var dom = e('#comments-number')
                dom.innerHTML = parseInt(dom.innerHTML) + 1
                NProgress.done()
            }
        })
    })
}

var renderCommentAll = function(data) {

    for (var i = 0; i < data.length; i++) {
        renderComment(data[i])
    }
}

var renderCommentNumber = function(length) {
    var dom = e('#comments-number')
    dom.innerHTML = length
}

var getCommentData = function() {
    ajax({
        method: 'get',
        url: '/api/comment?articleID=' + articleID,

        callback: function(response) {
            var res = JSON.parse(response)
            // 渲染全部评论
            renderCommentAll(res)
            // 渲染评论数
            renderCommentNumber(res.length)
            NProgress.done()
        }
    })
}
var __main = function() {
    onload = function() {
        NProgress.start()
        NProgress.inc()

        window.articleID = location.hash.slice(1)
        // 获取文章数据,并渲染
        getArticleData()
        // 获取评论数据，并渲染
        getCommentData()

    }
    // 添加评论
    addComment()
}

__main()
