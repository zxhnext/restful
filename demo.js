const Koa = require('koa')
const bodyParser = require('koa-bodyparser') // 解析请求体
const Router = require('koa-router')

const app = new Koa()
const router = new Router()
const usersRouter = new Router({
    prefix: '/users'
})

// app.use(async(ctx) => {
// ctx.body = "hello world"
// if(ctx.url === '/') {
//     ctx.body = '这是主页'
// } else if(ctx.url === '/users') {
// }
// })

router.get('/', (ctx) => {
    ctx.body = '<h2>这是主页</h2>'
})

usersRouter.get('/', (ctx) => {
    ctx.set('Allow', 'GET, POST') // 设置响应头
    ctx.status = 200
    ctx.body = '这是详情'
})

app.use(bodyParser())
app.use(router.routes())
app.use(usersRouter.routes())
// 响应options方法,告诉它所支持的请求方法
// 相应地返回405(不允许) 和501(没实现)
app.use(usersRouter.allowedMethods())

app.listen(3000, () => {
    console.log("🚀🚀🚀🚀， 3000端口已启动")
})