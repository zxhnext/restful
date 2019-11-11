class HomeCtl {
    index(ctx) {
        ctx.body = '<h2>这是主页</h2>'
    }
}

// 单例模式，都是用的同一个控制器
module.exports = new HomeCtl()