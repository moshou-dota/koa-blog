var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test',{useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', function (callback) {
  console.log('db connected')
})

var loginSchema = new mongoose.Schema({
  username: String,
  password: String
});
var login = db.model("login", loginSchema, "login");

var blogListSchema = new mongoose.Schema({
  title: String,
  kind: String,
  id: String
})
var blogList = db.model('blogList', blogListSchema, 'blogList')

var blogSchema = new mongoose.Schema({
  content: String,
  kind: String
})
var blog = db.model('blog', blogSchema, 'blog')

async function getBlogList(kind) {
  let query = {}
  let results = []
  if (kind !== '/') {
    query = {kind: kind}
  }
  results = await blogList.find(query)
  return results
}

async function queryMaxID () {
  let temp = 0
  await blogList.find({}).sort({'id': -1}).limit(1).then(doc => {
    if (doc.length > 0) {
      temp = doc[0].id
    } else {
      console.log('collection is empty')
    }
  })
  return temp
}

async function insertBlogList (title, kind) {
  let value = await queryMaxID()
  var record = new blogList({title: title, kind: kind, id: ++value})
  record.save(function (err) {
    if (err) {
      console.log('blog save fail', err)
      return
    }
    console.log('blog save success')
  })
}

function deleteBlogId (id) {
  let query = {id: id}
  blogList.remove(query).then(doc => {
    console.log('delete blog done')
  })
}

function modifyBlogKind (id, kind) {
  let query = {id: id}
  blogList.findOneAndUpdate(query, {kind: kind}).then(doc => {
    console.log('modify blog kind done')
  })
}

async function saveBlog (path, kind) {
  var content = require('fs').readFileSync(path, {encoding: 'UTF-8'})
  var query = new blog({content: content, kind: kind});
  query.save(err => {
    if (err) {
      console.log('save blog to db err:--', err)
      return
    }
    console.log('save blog to db success')
  })
}
module.exports = {
  insertBlogList,
  deleteBlogId,
  modifyBlogKind,
  saveBlog
}