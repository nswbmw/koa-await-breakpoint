const Mongolass = require('mongolass')
const mongolass = new Mongolass('mongodb://localhost:27017/test')
const User = mongolass.model('User')
const Post = mongolass.model('Post')
const Comment = mongolass.model('Comment')

exports.createUser = async function (ctx) {
  const name = ctx.query.name || 'default'
  const age = +ctx.query.age || 18
  await createUser(name, age)
  ctx.status = 204
}

async function createUser (name, age) {
  const user = (await User.create({
    name,
    age
  })).ops[0]
  await createPost(user)
}

async function createPost (user) {
  const post = (await Post.create({
    uid: user._id,
    title: 'post',
    content: 'post'
  })).ops[0]

  await createComment(user, post)
}

async function createComment (user, post) {
  await Comment.create({
    userId: user._id,
    postId: post._id,
    content: 'comment'
  })
}
