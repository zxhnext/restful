const Topic = require('../models/topics');
const User = require('../models/users');
const Question = require('../models/questions');

class TopicsCtl {
    async find(ctx) { // 话题查询
        const {
            per_page = 10
        } = ctx.query;
        const page = Math.max(ctx.query.page * 1, 1) - 1; // 第几页
        const perPage = Math.max(per_page * 1, 1); // 每页返回几条
        ctx.body = await Topic
            .find({ // 模糊搜索,关键词搜索
                name: new RegExp(ctx.query.q)
            })
            .limit(perPage).skip(page * perPage);
    }
    async findById(ctx) { // 特定话题查询
        const {
            fields = ''
        } = ctx.query;
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
        const topic = await Topic.findById(ctx.params.id).select(selectFields);
        ctx.body = topic;
    }
    async create(ctx) { // 创建话题
        ctx.verifyParams({
            name: {
                type: 'string',
                required: true
            },
            avatar_url: {
                type: 'string',
                required: false
            },
            introduction: {
                type: 'string',
                required: false
            },
        });
        const topic = await new Topic(ctx.request.body).save();
        ctx.body = topic;
    }
    async update(ctx) { // 更新话题
        ctx.verifyParams({
            name: {
                type: 'string',
                required: false
            },
            avatar_url: {
                type: 'string',
                required: false
            },
            introduction: {
                type: 'string',
                required: false
            },
        });
        const topic = await Topic.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        ctx.body = topic;
    }
    async checkTopicExist(ctx, next) { // 检查话题是否存在
        const topic = await Topic.findById(ctx.params.id);
        if (!topic) {
            ctx.throw(404, '话题不存在');
        }
        await next();
    }
    async listFollowers(ctx) { // 话题粉丝
        const users = await User.find({
            followingTopics: ctx.params.id
        });
        ctx.body = users;
    }
    async listQuestions(ctx) { // 话题列表关联问题列表
        const questions = await Question.find({
            topics: ctx.params.id
        });
        ctx.body = questions;
    }
}

module.exports = new TopicsCtl();