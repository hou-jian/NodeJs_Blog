var clickShutSidebar = function() {

    // 绑定点击事件
    bindEvent(shut, 'click', function() {

        sidebar.style.transform = 'translateX(-100%)'
        shut.style.display = 'none'
        menu.style.display = 'block'
        main.style.paddingLeft = 0
        mask.style.visibility = 'hidden'
        mask.style.pointerEvents = 'none'
        mask.style.opacity = '0'
    })
}

var clickMaskShutSidebar = function() {

    bindEvent(mask, 'click', function() {
        sidebar.style.transform = 'translateX(-100%)'
        shut.style.display = 'none'
        menu.style.display = 'block'
        mask.style.visibility = 'hidden'
        mask.style.pointerEvents = 'none'
        mask.style.opacity = '0'

        if (document.body.clientWidth > 1199) {
            main.style.paddingLeft = '240px'
        }
    })
}

var clickMenuSidebar = function() {

    bindEvent(menu, 'click', function() {
        sidebar.style.transform = 'translateX(0)'
        shut.style.display = 'block'
        menu.style.display = 'none'
        mask.style.visibility = 'visible'
        mask.style.pointerEvents = 'auto'
        mask.style.opacity = '0.3'

        if (document.body.clientWidth > 1199) {
            main.style.paddingLeft = '240px'

        }
    })
}

var clickBackToTop = function() {
    var backToTop = e('.backToTop')
    bindEvent(backToTop, 'click', function() {
        backTop()
    })
}
var addShadowToHeader = function(top) {
    var header = e('.header')
    if (top >= 50) {
        header.classList.add('fixed')
    } else {
        header.classList.remove('fixed')
    }
}
var toggleBackTop = function(top) {
    var backToTop = e('.backToTop')
    if (top >= 400) {
        backToTop.style.transform = 'translateX(0)'
    } else {
        backToTop.style.transform = 'translateX(200%)'
    }
}
var pageScroll = function() {
    window.onscroll = throttle(function() {
        // 获取页面滚动距离
        var top = scrollTop()
        // 开关header样式
        addShadowToHeader(top)
        // 快关返回顶部按钮
        toggleBackTop(top)
    }, 100, 150)
}

var __main = function() {
    // 获取元素
    window.shut = e('.shut')
    window.sidebar = e('.sidebar')
    window.menu = e('.menu')
    window.main = e('main')
    window.mask = e('.mask')

    // 点击关闭侧边栏
    clickShutSidebar()
    // 点击菜单键显示侧边栏
    clickMenuSidebar()
    // 点击遮罩关闭侧边栏
    clickMaskShutSidebar()
    // 点击返回顶部
    clickBackToTop()
    // 页面滚动处理函数
    pageScroll()
}

__main()
