const Router = require('@koa/router');
const router = new Router();

const { ObjectId, order, goods_search, user_shipping_addresses } = require('../../db/mongo.ts');

const bodyParser = require('koa-bodyparser');

const verifyAccessToken = require('../../middleware/verifyAccessToken.ts');

router.delete('/order/delete/:orderId', verifyAccessToken, async (ctx) => {
	try {
		const { userId } = ctx.state.user;
		// 获取路径参数中的地址 ID
		const orderId = ctx.params.orderId;

		if (!orderId) {
			ctx.body = {
				code: 1,
				message: '订单ID不能为空',
			};
			return;
		}

		const deleteResult = await order.deleteOne({ _id: new ObjectId(orderId), userId });

		if (deleteResult.deletedCount === 0) {
			ctx.body = {
				code: 1,
				message: '删除失败，订单不存在或权限不足',
			};
		} else {
			ctx.body = {
				code: 0,
				message: '删除成功',
			};
		}

		// 返回成功响应
		ctx.status = 200;
		ctx.body = {
			code: 0,
			message: '删除成功',
		};
	} catch (error) {
		console.error('删除订单失败:', error);
		ctx.status = 500;
		ctx.body = {
			code: 500,
			message: '删除订单失败',
			error: error.message,
		};
	}
});

module.exports = router;
