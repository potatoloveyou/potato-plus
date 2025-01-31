const Router = require('@koa/router');
const router = new Router();

const { shopping_cart } = require('../../db/mongo.ts');

const bodyParser = require('koa-bodyparser');

const verifyAccessToken = require('../../middleware/verifyAccessToken.ts');

router.put('/shoppingCart/update', verifyAccessToken, bodyParser(), async (ctx, next) => {
	try {
		const { userId } = ctx.state.user;
		const { goodsId, quantity, selectedAttributes } = ctx.request.body;

		// 校验参数
		if (!userId || !goodsId || typeof quantity !== 'number' || !selectedAttributes) {
			ctx.status = 400; // Bad Request
			ctx.body = { code: 400, message: '缺少必要参数: 用户 ID, 商品 ID, 数量或选择的属性' };
			return;
		}

		// 更新购物车中匹配的商品
		const updateResult = await shopping_cart.updateOne(
			{ userId }, // 匹配用户购物车
			{
				$set: {
					'goods.$[item].quantity': quantity, // 更新商品数量
					'goods.$[item].updatedAt': new Date(), // 更新商品时间
					cartUpdatedAt: new Date(), // 更新购物车更新时间
				},
			},
			{
				arrayFilters: [
					{
						'item.id': goodsId, // 匹配商品 ID
						'item.selectedAttributes.color': selectedAttributes.color, // 匹配属性：颜色
						'item.selectedAttributes.size': selectedAttributes.size, // 匹配属性：尺寸
					},
				],
			},
		);

		// 检查更新结果
		if (updateResult.matchedCount === 0) {
			// 如果未找到匹配项
			ctx.status = 404; // Not Found
			ctx.body = {
				code: 0,
				message: '购物车中不存在该商品',
			};
			return;
		}

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
