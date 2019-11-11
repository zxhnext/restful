const Router = require('koa-router')
// const jsonwebtoken = require('jsonwebtoken') // 生成token
const jwt = require('koa-jwt') // 用户认证与授权

const {
    checkOwner,
    find,
    findById,
    create,
    update,
    delete: del,
    login
} = require('../controllers/users')
const {
    secret
} = require('../config')

const router = new Router({
    prefix: '/users'
})

// const auth = async (ctx, next) => {
//     const {
//         authorization = ''
//     } = ctx.request.header
//     const token = authorization.replace('Bearer ', '')
//     try {
//         const user = jsonwebtoken.verify(token, secret) // 是否认证
//         ctx.state.user = user
//     } catch (err) {
//         ctx.throw(401, err.message)
//     }
//     await next()
// }

const auth = jwt({
    secret
})

router.get('/', find)
router.get('/:id', findById)
router.post('/', create)
router.patch('/:id', auth, checkOwner, update) // put是整体替换，patch可以更新部分数据
router.delete('/:id', auth, checkOwner, del)
router.post('/login', login)

module.exports = router