
var readLocalText = function(dom, callback) {
    document.getElementById(dom).onchange = function() {
        var file = this.files[0]
        var reader = new FileReader()
        reader.onload = function(e) {
            callback(e.target.result)
        }
        reader.readAsText(file)
    }
}

var __main = function() {

    // 读取上传给浏览器的文件
    readLocalText('file', function(text) {
        console.log('读取到的文章', text)
    })
}

__main()
