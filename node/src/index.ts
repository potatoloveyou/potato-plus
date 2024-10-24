import Koa from 'koa';
// https://www.koajs.com.cn/
const app = new Koa();

app.use(async (ctx) => {
	ctx.body = 'Hello World';
});

app.listen(3000);

// console.log(123);

