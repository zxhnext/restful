const path = require('path')

class HomeCtl {
    index(ctx) {
        ctx.body = '<h2>这是主页</h2>'
    }
    upload(ctx) {
        const file = ctx.request.files.file
        const basename = path.basename(file.path) // 将绝对路径转为相对路径
        ctx.body = {
            url: `${ctx.origin}/uploads/${basename}`
        }
    }
}

// 单例模式，都是用的同一个控制器
module.exports = new HomeCtl()