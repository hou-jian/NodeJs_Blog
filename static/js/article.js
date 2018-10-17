var RenderMarkdown = function(data) {
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
        tagsDom.insertAdjacentHTML('beforeend', `<li class="tags-list-item"><a href="/tags?tagsID=${data.tagsIDArr[i]}">${data.tags[i]}</a></li>`)

    }
}


var getArticleData = function() {
    var id = location.hash.slice(1)
    var u = '/api/articleID?articleID=' + id
    console.log('url', u);
    // 获取到对应id的文章
    ajax({
        method: 'GET',
        url: u,
        contentType: 'application/json',
        callback: function(response) {
            var res = JSON.parse(response)
            // console.log('回调', response);
            RenderMarkdown(res)
        }
    })
}
var __main = function() {
    getArticleData()
}

__main()
