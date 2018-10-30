// 返回:根据tagsID返回tagsName
var returnTagsName = function(tagsID) {
    for (var i = 0; i < tagsData.length; i++) {
        if (tagsData[i].id == tagsID) {
            return tagsData[i].tagName
        }
    }
}

// 功能函数: 渲染导航栏
var readerNav = function() {
    var navDom = e('#tags-nav-list')

    for (var i = 0; i < tagsIDarr.length; i++) {

        var tagName = returnTagsName(tagsIDarr[i])

        var t = `<li class="nav-item"><a href="#${tagsIDarr[i]}">${tagName}</a></li>`
        navDom.insertAdjacentHTML('beforeend', t)
    }

}
// 返回:文章id对应的文章数据(用于渲染页面)
var returnSingleArticle = function(articleID) {
    for (var i = 0; i < articleData.length; i++) {
        if (articleData[i].id == articleID) {
            var l = []
            l.title = articleData[i].title
            l.time = formatTime(articleData[i].time * 1000)
            l.intro = articleData[i].intro
            l.id = articleData[i].id
            return l
        }
    }
}

// 功能函数: 渲染单个文章项
var readerArticleList = function(box, arr) {
    for (var j = 0; j < arr.length; j++) {

        // 遍历文章数据，返回arr[j]对应的数据
        var l = returnSingleArticle(arr[j])
        var y = `
        <div class="article-item clearfix">
            <time>${l.time}</time>
            <h3><a href="article#${l.id}">${l.title}</a></h3>
            <div class="post-content">
                <p>${l.intro}</p>
            </div>
        </div>
        `
        box.insertAdjacentHTML('beforeend', y)
    }
}
// 功能函数: 渲染h3标题
var readerH3 = function(box, name) {
    var t = `<h3>${name}</h3>`
    box.insertAdjacentHTML('beforeend', t)

}

// 渲染标题与文章列表
var readerTagsList = function() {
    var box = e('.box')
    for (var i = 0; i < tagsIDarr.length; i++) {

        // 根据tagsID返回tagsName(用来显示标签名称)
        var tagName = returnTagsName(tagsIDarr[i])

        // 渲染tags标题
        readerH3(box, tagName)

        // 拿到tagsID对应的articleID数组
        var articleIDArr = tagsId_articleIdArr_data[tagsIDarr[i]]

        // 渲染tags标题对应的文章项
        readerArticleList(box, articleIDArr)
    }
}
var loadItemsAll = function() {
    // 渲染导航栏
    readerNav()
    var tagsID = location.hash.slice(1)

    if (tagsID == '') {
        // 渲染全部标题与文章列表
        readerTagsList()
        return
    } else {
        // 渲染指定标题与文章列表

        var active = e('.active')
        active.classList.remove('active')

        // 渲染指定页面
        readerItem()
    }


}

var readerItem = function() {
    var tagsID = location.hash.slice(1)
    var box = e('.box')
    box.innerHTML = ''

    if (tagsID == '') {
        // 渲染所有列表
        readerTagsList()
        return
    }

    // 根据tagsID返回tagsName
    var tagName = returnTagsName(tagsID)

    // 渲染tags标题
    readerH3(box, tagName)

    // 获取tagsID对应的articleID数组数据
    var articleIDArr = tagsId_articleIdArr_data[tagsID]

    // 渲染文章项
    readerArticleList(box, articleIDArr)

    // 导航栏样式处理(红色下划线)

    var navList = e('#tags-nav-list').children

    for (var i = 0; i < navList.length; i++) {
        var value = navList[i].firstChild.innerHTML

        if (value === tagName) {
            navList[i].classList.add('active')
        } else {
            navList[i].classList.remove('active')
        }
    }

}

var toggleNav = function() {
    var nav = e('#tags-nav-list')
    bindEvent(nav, 'click', function(event) {

        var target = event.target
        if (target.nodeName === 'A') {

            // 获取父节点
            var parentElement = target.parentElement
            // 有active直接结束
            if (parentElement.classList.contains('active')) {
                return
            }

            // 删除所有的class=active
            var list = nav.children
            for (var i = 0; i < list.length; i++) {
                list[i].classList.remove('active')
            }

            // 给点击元素添加
            parentElement.classList.add('active')
        }
    })
}

var clickNav = function() {
    var but = e('.header-button')
    var tagsNav = e('.tags-nav')
    bindEvent(but, 'click', function() {
        toggleClass(tagsNav, 'unfold')
    })
}
var __main = function() {
    // 请求数据
    ajax({
        method: 'GET',
        url: '/api/tags/all',
        callback: function(response) {
            var res = JSON.parse(response)
            // 标签id数组
            window.tagsIDarr = res[0][0]
            // 处理后的关系表数据，标签id一对多文章id
            window.tagsId_articleIdArr_data = res[0][1]
            // tags数据
            window.tagsData = res[1]
            // article数据
            window.articleData = res[2]
            // 渲染页面
            loadItemsAll()

            // 点击nav切换激活状态
            toggleNav()
        }
    })

    // 检测url发生改变渲染对应的文章列表
    window.onpopstate = function() {
        readerItem()
    }

    clickNav()

}

__main()
