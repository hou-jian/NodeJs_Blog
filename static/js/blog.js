var returnSectionTemplate = function(data) {

    // 格式化后的时间
    var time = formatTime(data.time * 1000)
    // 模板
    var s = `
    <section id="${data.id}">
        <time class="post-time">${time}</time>
        <h3 class="post-title"><a href="article#${data.id}">${data.title}</a></h3>
        <div class="post-content">
            <p>${data.intro}</p>
            <a href="article#${data.id}">阅读全文...</a>
        </div>
        <div class="post-tags clearfix">
            <ul class="tags-list tagsID-${data.id}">
                <li class="tags-list-item"><a href="/tags">暂无</a></li>
            </ul>
        </div>
    </section>
    `
    return s
}

var returnTagsTemplate = function(tags, tagsID) {
    var html = ''
    for (var i = 0; i < tags.length; i++) {
        var d = `
            <li class="tags-list-item"><a href="/tags#${tagsID[i]}">${tags[i]}</a></li>
        `
        html += d
    }
    return html
}

var loadArticleList = function(data) {

    // 获取content
    var content = e('.content')

    for (var i = 0; i < data.length; i++) {
        // 1. 渲染文章内容
        // 返回section模板
        var s = returnSectionTemplate(data[i])
        // 添加到content中
        content.insertAdjacentHTML('beforeend', s)
        //2. 渲染标签
        // 获取当前section的tags-list
        var tagDOM = e(`.tagsID-${data[i].id}`)
        // 获取当前section的标签数组
        var tag = data[i].tags
        var tagsID = data[i].tagsIDArr
        // 获取tags的dom
        var t = returnTagsTemplate(tag, tagsID)
        // 添加到section>tags-list中
        tagDOM.innerHTML = t
    }
}

var ajaxArticleData = function(callback) {
    NProgress.start()
    NProgress.inc()
    ajax({
        method: 'GET',
        url: '/api/article/all',
        contentType: 'application/json',
        callback: function(response) {
            var res = JSON.parse(response)
            // console.log('回调', response);
            // 逆序
            var data = res.reverse()
            // console.log('data:', data);
            callback(data)
        }
    })

}

var readerNav = function(pages, pageID) {
    var pageNav = e('.page-nav')
    pageNav.insertAdjacentHTML('beforeend', '<span class="page-up">上一页</span>')
    var n = ''
    for (var i = 0; i < pages; i++) {
        if (i === 0) {
            n = n + `<a href="#0">${i + 1}</a>`
        } else {
            n = n + `<a href="#${i}">${i + 1}</a>`
        }
    }

    pageNav.insertAdjacentHTML('beforeend', n)
    pageNav.insertAdjacentHTML('beforeend', '<span class="page-down">下一页</span>')

    // 处理导航样式.page-nav-activate切换class
    var domList = pageNav.children
    // console.log('domList', pageID, domList);
    for (var i = 0; i < domList.length; i++) {
        domList[i].classList.remove('page-nav-activate')
    }

    domList[parseInt(pageID) + 1].classList.add('page-nav-activate')
}

var readerSpecifiedPage = function(data, pageData, pageID) {

    // 清空页面
    var content = e('.content')
    while (content.firstChild) {
        content.removeChild(content.firstChild)
    }
    var startIndex = 0
    var endIndex = 0
    // 根据pageID切割data
    var pageID = parseInt(pageID)
    startIndex = pageID * pageData.size
    endIndex = startIndex + pageData.size
    if (endIndex > data.length) {
        endIndex = data.length
    }
    // console.log('切片', startIndex, endIndex);
    var singlePageData = data.slice(startIndex, endIndex)

    // console.log('处理后的数据', singlePageData);
    // 渲染页面
    loadArticleList(singlePageData, pageID)
    NProgress.done();
}

var clickNumberBut = function(pageNav, target, pageData) {
    if (target.nodeName === 'A') {
        backTop()
        // 处理导航样式.page-nav-activate切换class
        var domList = pageNav.children
        for (var i = 0; i < domList.length; i++) {
            domList[i].classList.remove('page-nav-activate')
        }
        target.classList.add('page-nav-activate')
    }
}

var handleUPButton = function(target, pageNav) {
    if (target.innerHTML === '上一页') {
        var pageID = parseInt(location.hash.slice(1))
        if (pageID === 0) {
            return
        }
        // console.log('???', pageID);
        location.hash = '#' + (pageID - 1)
        // 处理导航样式.page-nav-activate切换class
        var domList = pageNav.children
        for (var i = 0; i < domList.length; i++) {
            domList[i].classList.remove('page-nav-activate')
        }
        domList[pageID].classList.add('page-nav-activate')
    }

}

var handleDownButton = function(target, pageNav, pageData) {
    if (target.innerHTML === '下一页') {
        var pageID = parseInt(location.hash.slice(1))

        // 在最后一页不执行
        if (pageID === pageData.pages - 1) {
            return
        }

        location.hash = '#' + (pageID + 1)

        // 处理导航样式.page-nav-activate切换class
        var domList = pageNav.children

        for (var i = 0; i < domList.length; i++) {
            domList[i].classList.remove('page-nav-activate')
        }

        domList[pageID + 2].classList.add('page-nav-activate')
    }
}

var clickUpAndDownAlterHash = function(pageNav, target, pageData) {
    // 判断点击的是否为上下按钮
    if (target.nodeName === 'SPAN') {
        backTop()
        // 处理点击上一页
        handleUPButton(target, pageNav)
        // 处理点击下一页
        handleDownButton(target, pageNav, pageData)

    }
}

var clickNavAlterHash = function(pageData) {
    // 获取nav
    var pageNav = e('.page-nav')
    bindEvent(pageNav, 'click', function(event) {
        NProgress.start()
        NProgress.inc()
        var target = event.target
        // 如果有激活状态，说明重复点击，不处理
        if (target.classList.contains('page-nav-activate')) {
            return
        }
        // 点击页码渲染页面
        clickNumberBut(pageNav, target, pageData)

        // 点击上下页渲染页面
        clickUpAndDownAlterHash(pageNav, target, pageData)

        NProgress.done();

    })
}

var __main = function() {

    // ajax获取数据, callback函数处理页面
    ajaxArticleData(function(data) {
        // 设置分页参数
        var pageData = {}
        pageData.total = data.length
        pageData.size = 10
        pageData.pages = Math.ceil(pageData.total / pageData.size)

        // 载入页面时，更具#x渲染对应页
        var pageID = location.hash.slice(1)
        if (!pageID) {
            pageID = 0
        }
        readerSpecifiedPage(data, pageData, pageID)

        // 渲染分页导航栏
        readerNav(pageData.pages, pageID)

        // 点击导航栏修改url的#(即：hash)
        clickNavAlterHash(pageData)

        // url的#x 改变重新渲染页面
        bindEvent(window, 'hashchange', function() {
            var pageID = location.hash.slice(1)
            // console.log('pageID', pageID);
            readerSpecifiedPage(data, pageData, pageID)
        })

    })


}

__main()
