const jsonwebtoken = require('jsonwebtoken')
const User = require('../models/users')
const {
    secret
} = require('../config')

class UsersCtl {
    async checkOwner(ctx, next) { // 确认授权(是否是自己)
        if (ctx.params.id !== ctx.state.user_id) {
            ctx.throw(403, '没有操作权限')
        }
        await next()
    }
    async find(ctx) { // 获取用户列表
        ctx.set('Allow', 'GET, POST') // 设置响应头
        ctx.status = 200
        ctx.body = await User.find()
    }
    async findById(ctx) {
        const user = await User.findById(ctx.params.id)
        if (!user) {
            ctx.throw(404, '用户不存在')
        }
        ctx.body = user
    }
    async create(ctx) {
        ctx.verifyParams({
            name: {
                type: 'string',
                required: true
            },
            password: {
                type: 'string',
                required: true
            }
        })
        const {
            name
        } = ctx.request.body
        const repeatedUser = await User.findOne({
            name
        })
        if (repeatedUser) {
            ctx.throw(409, '该用户已存在')
        }
        const user = await new User(ctx.request.body).save()
        ctx.body = user
    }
    async update(ctx) {
        ctx.verifyParams({
            name: {
                type: 'string',
                required: false
            },
            password: {
                type: 'string',
                required: false
            }
        })
        const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body)
        if (!user) {
            ctx.throw(404, '用户不存在')
        }
        ctx.body = user
    }
    async delete(ctx) {
        const user = await User.findByIdAndRemove(ctx.params.id)
        if (!user) {
            ctx.throw(404, '用户不存在')
        }
        ctx.status = 204
    }
    async login(ctx) {
        ctx.verifyParams({
            name: {
                type: 'string',
                required: true
            },
            password: {
                type: 'string',
                required: true
            }
        })
        const user = await User.findOne(ctx.request.body)
        if (!user) ctx.throw(401, '用户名或密码不正确')
        const {
            _id,
            name
        } = user
        const token = jsonwebtoken.sign({
            _id,
            name
        }, secret, {
            expiresIn: '1d' // 过期时间，1天
        })
        ctx.body = {
            token
        }
    }
}

module.exports = new UsersCtl()