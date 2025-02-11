const Router = require('@koa/router');
const router = new Router();

const { ObjectId, shopping_cart, shopping_cart_item } = require('../../db/mongo.ts');

const bodyParser = require('koa-bodyparser');

const verifyAccessToken = require('../../middleware/verifyAccessToken.ts');

router.post('/order/update', verifyAccessToken, bodyParser(), async (ctx) => {
	const { userId } = ctx.state.user;
	const { orderId, quantity } = ctx.request.body;

	if (!orderId || !quantity) {
		ctx.body = {
			code: 400,
			message: '参数不完整',
		};
		return;
	}
});
module.exports = router;
