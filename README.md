## koa-await-breakpoint

Add breakpoints around `await` expression especially for koa@2.

### Install

```sh
$ npm i koa-await-breakpoint --save
```

### Example

```sh
$ DEBUG=koa-await-breakpoint node example/app
$ curl -XPOST localhost:3000/users
```

### Usage

```js
// Generally, on top of the main file
const koaAwaitBreakpoint = require('koa-await-breakpoint')({
  name: 'api',
  files: ['./routes/*.js']
})

const Koa = require('koa')
const routes = require('./routes')
const app = new Koa()

// Generally, above other middlewares
app.use(koaAwaitBreakpoint)

routes(app)

app.listen(3000, () => {
  console.log('listening on 3000')
})
```

**NB**: You'd better put `require('koa-await-breakpoint')` on the top of the main file, because `koa-await-breakpoint` rewrite `Module.prototype._compile`.

koa-await-breakpoint will wrap `AwaitExpression` with:

```js
global.logger(
  (typeof ctx !== 'undefined' ? ctx : this),
  function(){
    return AwaitExpression
  },
  AwaitExpressionString,
  filename
)
```

log like:

```json
{
  "name": "api",
  "requestId": "222f66ec-7259-4d20-930f-2ac035c16e7b",
  "timestamp": "2018-01-15T05:02:18.827Z",
  "this": {
    "state": {},
    "params": {},
    "request": {
      "method": "POST",
      "path": "/users",
      "header": {
        "host": "localhost:3000",
        "user-agent": "curl/7.54.0",
        "accept": "*/*"
      },
      "query": {}
    },
    "response": {
      "status": 404
    }
  },
  "type": "start",
  "step": 1,
  "take": 0
}
```

koa-await-breakpoint will print logs to console by default, if you want to save these logs to db, set `store` option, see below.

**NB:** `type` in `['start', 'beforeAwait', 'afterAwait', 'error', 'end']`, `take` is ms.

### Options

require('koa-await-breakpoint')(option)

- name{String}: service name added to log.
- sourcemap{Boolean}: whether open sourcemap, default: `true`, will **increase** memory usage.
- files{String[]}: files pattern, see [glob](https://github.com/isaacs/node-glob), required.
- exclude_files{String[]}: exclude files pattern, default `[]`.
- store{Object}: backend store instance, see [koa-yield-breakpoint-mongodb](https://github.com/nswbmw/koa-yield-breakpoint-mongodb), default print to console.
- filter{Object}: reserved field in koa's `ctx`, default:
```
{
  ctx: ['state', 'params'],
  request: ['method', 'path', 'header', 'query', 'body'],
  response: ['status', 'body']
}
```
- loggerName{String}: global logger name, default `logger`.
- requestIdPath{String}: requestId path in `ctx`, default `requestId`.
- awaitCondition{Function}: parameters `(filename, awaitExpression, parsedAwaitExpression)`, return an object:
  - wrapAwait{Boolean}: if `true` return wraped awaitExpression, default `true`.
  - deep{Boolean}: if `true` deep wrap awaitExpression, default `true`.
- others: see [glob](https://github.com/isaacs/node-glob#options).
