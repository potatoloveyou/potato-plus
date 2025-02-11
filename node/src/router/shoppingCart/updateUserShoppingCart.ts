const Router = require('@koa/router');
const router = new Router();

const { ObjectId, shopping_cart, shopping_cart_item } = require('../../db/mongo.ts');

const bodyParser = require('koa-bodyparser');

const verifyAccessToken = require('../../middleware/verifyAccessToken.ts');

router.put('/shoppingCart/update', verifyAccessToken, bodyParser(), async (ctx, next) => {
	try {
		const { userId } = ctx.state.user;
		const { shoppingCartItemId, quantity } = ctx.request.body;

		// 校验参数
		if (!shoppingCartItemId || !quantity) {
			ctx.status = 400; // Bad Request
			ctx.body = { code: 400, message: '缺少必要参数: 商品 ID, 数量' };
			return;
		}

		await shopping_cart_item.updateOne(
			{
				_id: new ObjectId(shoppingCartItemId),
				userId,
			},
			{
				$set: {
					quantity,
					updatedAt: new Date(),
				},
			},
		);

		// 成功响应
		ctx.status = 200; // OK
		ctx.body = {
			code: 0,
			message: '购物车商品更新成功',
		};
	} catch (error) {
		// 捕获错误
		console.error('更新购物车失败:', error);
		ctx.status = 500; // Internal Server Error
		ctx.body = {
			code: 500,
			message: '更新购物车失败',
			error: error.message,
		};
	}
});

module.exports = router;
