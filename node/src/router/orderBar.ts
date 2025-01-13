const Router = require('@koa/router');
// https://github.com/koajs/router
const router = new Router();

const { order_Bar } = require('../db/mongo.ts');

// 中间件，解析post请求的参数
const bodyParser = require('koa-bodyparser');

// 订单导航栏
router.get('/orderBar', async (ctx, next) => {
	try {
		const orderBar = await order_Bar.find().toArray();
		ctx.body = {
			code: 0,
			msg: '成功',
			orderBar,
		};
	} catch (error) {}
});

module.exports = router;
