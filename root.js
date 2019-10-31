const session = require('koa-session');
const Koa = require('koa');
const app = new Koa();
const serve = require("koa-static");
const router = require('./middleware/route');
const bodyParser = require('koa-bodyparser')
const valiteCookie = require('./middleware/validateCookie');
const views = require("koa-views");
const upload = require("./middleware/upload");

//app.keys = ['keys'];
//router.use(session(app));

app.use(views(__dirname + "/static/html",{ extension: 'ejs' }));
app.use(bodyParser());
app.use(valiteCookie);
app.use(router.routes());

app.use(upload);


app.use(serve(__dirname+ "/static/html",{ extensions: ['html']}));


app.listen(3001,function(){
    console.log("Listening on 3001");
});

