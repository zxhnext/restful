const Koa = require('koa')
// const bodyParser = require('koa-bodyparser') // 解析请求体(只支持json和form)
const koaBody = require('koa-body') // 支持大部分场景,包括文件，json、form等
const koaStatic = require('koa-static') // 生成静态文件目录
const error = require('koa-json-error') // 错误处理
const parameter = require('koa-parameter') // 校验参数
const mongoose = require('mongoose')
const path = require('path')

const app = new Koa()
const routes = require('./routes')
const {
    connectionStr
} = require('./config')

mongoose.connect(connectionStr, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log('mongodb连接成功!')
})
mongoose.connection.on('error', console.error)

app.use(koaStatic(path.join(__dirname, 'public')))

app.use(error({
    postFormat: (e, {
        stack,
        ...rest
    }) => process.env.NODE_ENV === 'production' ? rest : {
        stack,
        ...rest
    }
}))
// app.use(bodyParser())
app.use(koaBody({
    multipart: true, // 支持文件
    formidable: {
        uploadDir: path.join(__dirname, '/public/uploads'), // 设置上传目录
        keepExtensions: true, // 保留后缀名
    }
}))
app.use(parameter(app))
routes(app)

app.listen(3000, () => {
    console.log("🚀🚀🚀🚀， 3000端口已启动")
})