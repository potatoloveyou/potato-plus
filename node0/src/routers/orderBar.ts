const Router = require('@koa/router');
// https://github.com/koajs/router
const router = new Router();

const { order_bar } = require('../db/mongo.ts');

// 订单导航栏
router.get('/orderBar', async (ctx, next) => {
	try {
		const orderBar = await order_bar.find().toArray();
		ctx.body = {
			code: 0,
			msg: '成功',
			orderBar,
		};
	} catch (error) {}
});

module.exports = router;
