const User = require('../models/users')

exports.createUser = async function createUser (ctx) {
  const name = ctx.query.name || 'default'
  const age = +ctx.query.age || 18
  await User.createUser(name, age)
  ctx.status = 204
}
