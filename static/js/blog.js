var returnSectionDOM = function(data) {

    // 格式化后的时间
    var time = formatTime(data.articleTime * 1000)
    // 模板
    var s = `
    <section id="${data.id}">
        <time class="post-time">${time}</time>
        <h3 class="post-title"><a href="article">${data.title}</a></h3>
        <div class="post-content">
            <p>${data.articleIntro}</p>
            <a href="#">阅读全文...</a>
        </div>
        <div class="post-tags clearfix">
            <ul class="tags-list tagsID-${data.id}">
                <li class="tags-list-item"><a href="/">暂无</a></li>
            </ul>
        </div>
    </section>
    `
    return s
}

var returnTagsDOM = function(tags) {
    var html = ''
    for (var i = 0; i < tags.length; i++) {
        var d = `
            <li class="tags-list-item"><a href="/">${tags[i]}</a></li>
        `
        html += d
    }
    return html
}

var loadArticleList = function(data) {
    console.log('data', data);
    // 获取content
    var content = e('.content')
    // 模板添加

    for (var i = 0; i < data.length; i++) {
        // 1.
        // 返回section模板
        var s = returnSectionDOM(data[i])
        // 添加到content中
        content.insertAdjacentHTML('beforeend', s)
        //2.
        // 获取当前section的tags-list
        var tagDOM = e(`.tagsID-${data[i].id}`)
        // 获取当前section的标签数组
        var tags = data[i].articleTags
        // 返回tags的dom
        var t = returnTagsDOM(tags)
        // 添加到section>tags-list中
        tagDOM.innerHTML = t
    }
}

var ajaxArticleData = function() {

    ajax({
        method: 'GET',
        url: '/api/blog/all',
        contentType: 'application/json',
        callback: function(response) {
            var res = JSON.parse(response)
            // 调用渲染函数
            loadArticleList(res)
        }
    })

}

__main = function() {
    ajaxArticleData()

}
__main()
