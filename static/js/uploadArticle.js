var readFileContent = function(callback) {
    //
    var file = document.getElementById('file')
    var files = file.files
    console.log("files", files[0]);
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
    console.log('data', data);
    var l = []

    while(true) {
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
            console.log('form准备完毕, 即将上传！', form);
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

var __main = function() {
    // 上传form数据
    upData()

}

__main()
