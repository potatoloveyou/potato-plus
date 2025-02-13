const Router = require('@koa/router');
const router = new Router();

const { ObjectId, order } = require('../../db/mongo.ts');

const bodyParser = require('koa-bodyparser');

const verifyAccessToken = require('../../middleware/verifyAccessToken.ts');

router.put('/order/update/address', verifyAccessToken, bodyParser(), async (ctx) => {
	try {
		const { userId } = ctx.state.user;
		const { addressId, orderId } = ctx.request.body;

		if (!addressId || !orderId) {
			ctx.body = {
				code: 1,
				message: '参数不完整',
			};
			return;
		}

		await order.updateOne(
			{
				_id: new ObjectId(orderId),
				userId,
			},
			{
				$set: {
					addressId,
				},
			},
		);

		// 成功响应
		ctx.status = 200; // OK
		ctx.body = {
			code: 0,
			message: '更新订单地址成功',
		};
	} catch (error) {
		console.error(error);
		ctx.status = 500; // Internal Server Error
		ctx.body = {
			code: 1,
			message: '更新订单地址失败',
		};
	}
});
module.exports = router;
