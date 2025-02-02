const Router = require('@koa/router');
const router = new Router();

const { ObjectId, shopping_cart, shopping_cart_item } = require('../../db/mongo.ts');

const bodyParser = require('koa-bodyparser');

const verifyAccessToken = require('../../middleware/verifyAccessToken.ts');

router.delete('/shoppingCart/delete', verifyAccessToken, bodyParser(), async (ctx) => {
	try {
		const { userId } = ctx.state.user;
		const { shoppingCartItemIds } = ctx.request.body;

		// 验证请求体参数
		if (!shoppingCartItemIds || shoppingCartItemIds.length === 0) {
			ctx.status = 400;
			ctx.body = {
				code: 400,
				message: '缺少商品ID参数',
			};
			return;
		}
		// 删除购物车中的商品
		const deleteResult = await shopping_cart_item.deleteMany({
			userId, // 确保只能删除当前用户的商品
			_id: { $in: shoppingCartItemIds.map((id) => new ObjectId(id)) },
		});

		// 检查是否成功删除
		if (deleteResult.deletedCount === 0) {
			ctx.status = 404;
			ctx.body = {
				code: 404,
				message: '未找到要删除的商品',
			};
			return;
		}

		// 返回成功响应
		ctx.status = 200;
		ctx.body = {
			code: 0,
			message: '删除成功',
		};
	} catch (error) {
		console.error('删除购物车商品失败:', error);
		ctx.status = 500;
		ctx.body = {
			code: 500,
			message: '删除购物车商品失败',
			error: error.message,
		};
	}
});

module.exports = router;
