const Router = require('@koa/router');
const router = new Router();

const { shopping_cart } = require('../../db/mongo.ts');

const bodyParser = require('koa-bodyparser');

router.delete('/shoppingCart/delete', bodyParser(), async (ctx) => {
	try {
		const { userId, goods } = ctx.request.body;

		// 验证请求体参数
		if (!userId || !Array.isArray(goods) || goods.length === 0) {
			ctx.status = 400;
			ctx.body = {
				code: 400,
				message: '请求体中缺少 userId 或 goods 格式错误。',
			};
			return;
		}

		// 构造删除条件
		const conditions = goods.map((item) => ({
			id: item.goodsId,
			selectedAttributes: item.selectedAttributes,
		}));

		// 使用 $pull 删除多个商品
		const result = await shopping_cart.updateOne(
			{ userId },
			{
				$pull: {
					goods: { $or: conditions },
				},
			},
		);

		// 检查更新结果
		if (result.modifiedCount > 0) {
			// // 如果购物车为空，则删除整个购物车文档
			// const cart = await shopping_cart.findOne({ userId });
			// if (cart && cart.goods.length === 0) {
			// 	await shopping_cart.deleteOne({ userId });
			// }

			ctx.status = 200;
			ctx.body = {
				code: 0,
				success: true,
				message: '指定商品已成功从购物车中移除。',
			};
		} else {
			ctx.status = 404;
			ctx.body = {
				code: 404,
				success: false,
				message: '未找到匹配的商品或商品已被移除。',
			};
		}
	} catch (error) {
		console.error('删除购物车商品时出错:', error);
		ctx.status = 500;
		ctx.body = {
			code: 500,
			success: false,
			message: '服务器内部错误。',
			error: error.message,
		};
	}
});

module.exports = router;
