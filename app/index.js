const Koa = require('koa')
const bodyParser = require('koa-bodyparser') // 解析请求体
const error = require('koa-json-error') // 错误处理
const parameter = require('koa-parameter') // 校验参数
const mongoose = require('mongoose')

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

app.use(error({
    postFormat: (e, {
        stack,
        ...rest
    }) => process.env.NODE_ENV === 'production' ? rest : {
        stack,
        ...rest
    }
}))
app.use(bodyParser())
app.use(parameter(app))
routes(app)

app.listen(3000, () => {
    console.log("🚀🚀🚀🚀， 3000端口已启动")
})