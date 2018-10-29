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
    // 第一页只渲染10个
    var length
    if (data.length < 10) {
        length = data.length
    } else {
        length = 10
    }
    // 首次只循环渲染10篇
    for (var i = 0; i < length; i++) {
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
        // 返回tags的dom
        var t = returnTagsTemplate(tag, tagsID)
        // 添加到section>tags-list中
        tagDOM.innerHTML = t
    }
}

var ajaxArticleData = function(callback) {

    ajax({
        method: 'GET',
        url: '/api/article/all',
        contentType: 'application/json',
        callback: function(response) {
            var res = JSON.parse(response)
            // console.log('回调', response);
            // 逆序
            var data = res.reverse()
            console.log('data:', data);
            callback(data)
        }
    })

}

var readerNav = function(pages) {
    var pageNav = e('.page-nav')
    pageNav.insertAdjacentHTML('beforeend', '<span class="page-up">上一页</span>')
    var n = ''
    for (var i = 0; i < pages; i++) {
        if (i === 0) {
            n = n + `<a href="JavaScript:;" class="page-nav-activate"  data-pageID=${i}>${i + 1}</a>`
        } else {
            n = n + `<a href="JavaScript:;"  data-pageID=${i}>${i + 1}</a>`
        }
    }

    pageNav.insertAdjacentHTML('beforeend', n)
    pageNav.insertAdjacentHTML('beforeend', '<span class="page-down">下一页</span>')

}

var readerSpecifiedPage = function(data, pageData, pageID) {
    // 清空页面
    var content = e('.content')
    while (content.firstChild) {
        content.removeChild(content.firstChild)
    }

    // 根据pageID切割data
    var startIndex = pageID * pageData.size
    var endIndex = startIndex + pageData.size

    var singlePageData = data.slice(startIndex, endIndex)
    console.log('处理后的数据', singlePageData);
    // 渲染页面
    loadArticleList(singlePageData)
}

var clickPageNumber = function(pageNav, target, data, pageData) {
    if (target.nodeName === 'A') {
        // 获取到点击的页码
        var pageID = target.dataset.pageid

        // 渲染该页码的页面
        readerSpecifiedPage(data, pageData, pageID)
        // 处理导航样式.page-nav-activate切换class
        var domList = pageNav.children
        for (var i = 0; i < domList.length; i++) {
            domList[i].classList.remove('page-nav-activate')
        }
        target.classList.add('page-nav-activate')
    }
}

var handleUPButton = function(data, target, activateID, pageData, pageNav) {
    if (target.innerHTML === '上一页') {
        // 在第一页不处理
        if (activateID == '0') {
            // console.log('不处理');
            return
        }
        var pageID = parseInt(activateID) - 1
        // 渲染该页码的页面
        readerSpecifiedPage(data, pageData, pageID)
        // 处理导航样式.page-nav-activate切换class
        var domList = pageNav.children
        for (var i = 0; i < domList.length; i++) {
            domList[i].classList.remove('page-nav-activate')
        }
        domList[pageID + 1].classList.add('page-nav-activate')
    }

}

var handleDownButton = function(data, target, activateID, pageData, pageNav) {
    if (target.innerHTML === '下一页') {
        // 在最后一页不处理
        if (activateID == (pageData.pages - 1)) {
            // console.log('不处理');
            return
        }
        var pageID = parseInt(activateID) + 1
        // 渲染该页码的页面
        readerSpecifiedPage(data, pageData, pageID)
        // 处理导航样式.page-nav-activate切换class
        var domList = pageNav.children
        for (var i = 0; i < domList.length; i++) {
            domList[i].classList.remove('page-nav-activate')
        }

        domList[pageID + 1].classList.add('page-nav-activate')

    }
}

var clickPageUpDownButton = function(pageNav, target, data, pageData) {
    // 获取当前激活的按钮
    var activate = e('.page-nav-activate')
    // 获取激活按钮的id
    var activateID = activate.dataset.pageid
    // console.log('activateID', activateID);

    // 判断点击的是否为上下按钮
    if (target.nodeName === 'SPAN') {
        // 处理点击上一页
        handleUPButton(data, target, activateID, pageData, pageNav)
        // 处理点击下一页
        handleDownButton(data, target, activateID, pageData, pageNav)

    }
}

var clickNavReaderArticleList = function(data, pageData) {
    // 获取nav
    var pageNav = e('.page-nav')
    bindEvent(pageNav, 'click', function(event) {
        var target = event.target
        // 如果有激活状态，说明重复点击，不处理
        if (target.classList.contains('page-nav-activate')) {
            return
        }
        // 点击页码渲染页面
        clickPageNumber(pageNav, target, data, pageData)

        // 点击上下页渲染页面
        clickPageUpDownButton(pageNav, target, data, pageData)
    })
}

var __main = function() {
    onload = function () {
        // ajax获取数据, callback函数处理页面
        ajaxArticleData(function(data) {
            // 设置分页参数
            var pageData = {}
            pageData.total = data.length
            pageData.size = 10
            pageData.pages = Math.ceil(pageData.total / pageData.size)
            // console.log(pageData);

            // 根据data数量渲染分页导航栏
            readerNav(pageData.pages)

            // 默认渲染第一页
            loadArticleList(data)

            // 点击导航栏渲染指定页
            clickNavReaderArticleList(data, pageData)
        })
    }


}

__main()
