const Koa = require('Koa')
const static = require('Koa-static')
const bodyParser = require ('Koa-bodyparser')
const router = require('Koa-router')()
const views = require('Koa-views')
const app = new Koa()
const dealUpload = require('./src/middle/upload')
const dbAPi = require('./db')
app.use(views(static(__dirname + '/src/static/html', {extensions: ['ejs']})))
app.use(static(__dirname + '/src/static/html', {extensions: ['html']}))
app.use(bodyParser)
app.use(router.routes())
// router.get('/', async (ctx, next) => {
//   await static(__dirname + '/src/static/html', {extensions: ['html']})
//   await next()
// })
// router.get('/',static(__dirname + '/src/static/html', {extensions: ['html']}))
router.post('/upload', async (ctx, next) => {
  console.log('upload step 1')
  // await dealUpload(ctx)
  await next()
})
router.post('/delete/blog/:blogId', async (ctx, next) => {
  let blogId = ctx.params.blogId
  await dbAPi.deleteBlogId(blogId)
  await next()
})
router.post('/modify/blog/:blogId/:kindName', async (ctx, next) => {
  let blogId = ctx.params.blogId
  let kindName = ctx.params.kindName
  await dbAPi.modifyBlogKind(blogId, kindName)
  await next()
})
router.get('/blog/:blogId', async (ctx, next) => {
  let blogId = ctx.params.blogId
  let content = await dbAPi.readBlog(blogId)
  ctx.body = content
  await next()
})
router.get('/blogList', async(ctx, next) => {
  const results = await dbAPi.getBlogList('/')
  return ctx.render('blogList', {results: results})
})
app.use(function (err, req, res, next) {
  console.log('err', err)

})

app.listen(3000)
