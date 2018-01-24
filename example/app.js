const path = require('path')
const koaAwaitBreakpoint = require('..')({
  name: 'api',
  files: [path.join(__dirname, '**/*.js')]
})

const Koa = require('koa')
const route = require('koa-route')
const app = new Koa()

app.use(koaAwaitBreakpoint)
app.use(route.post('/users', require('./routes/users').createUser))// curl -XPOST localhost:3000/users

app.listen(3000, () => {
  console.log('listening on 3000')
})
