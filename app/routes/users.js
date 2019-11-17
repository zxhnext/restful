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
    login,
    listFollowing,
    follow,
    unfollow,
    listFollowers,
    checkUserExist,
    followTopic,
    unfollowTopic,
    listFollowingTopics,
    listQuestions,
    listLikingAnswers,
    likeAnswer,
    unlikeAnswer,
    listDislikingAnswers,
    dislikeAnswer,
    undislikeAnswer,
    listCollectingAnswers,
    collectAnswer,
    uncollectAnswer,
} = require('../controllers/users')

const {
    checkTopicExist
} = require('../controllers/topics')

const {
    checkAnswerExist
} = require('../controllers/answers')

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
router.get('/:id/following', listFollowing) // 关注人列表
router.get('/:id/followers', listFollowers) // 粉丝列表
router.put('/following/:id', auth, checkUserExist, follow) // 添加关注
router.delete('/following/:id', auth, checkUserExist, unfollow) // 取消关注
router.get('/:id/followingTopics', listFollowingTopics) // 获取用户关注话题
router.put('/followingTopics/:id', auth, checkTopicExist, followTopic) // 关注话题
router.delete('/followingTopics/:id', auth, checkTopicExist, unfollowTopic) // 取消关注话题
router.get('/:id/questions', listQuestions) // 用户问题列表
router.get('/:id/likingAnswers', listLikingAnswers) // 赞的答案列表
router.put('/likingAnswers/:id', auth, checkAnswerExist, likeAnswer, undislikeAnswer) // 点赞
router.delete('/likingAnswers/:id', auth, checkAnswerExist, unlikeAnswer) // 取消赞
router.get('/:id/dislikingAnswers', listDislikingAnswers) // 踩的答案列表
router.put('/dislikingAnswers/:id', auth, checkAnswerExist, dislikeAnswer, unlikeAnswer) // 踩
router.delete('/dislikingAnswers/:id', auth, checkAnswerExist, undislikeAnswer) // 取消踩
router.get('/:id/collectingAnswers', listCollectingAnswers) // 收藏答案列表
router.put('/collectingAnswers/:id', auth, checkAnswerExist, collectAnswer) // 收藏
router.delete('/collectingAnswers/:id', auth, checkAnswerExist, uncollectAnswer) // 取消收藏
module.exports = router