const Router = require('@koa/router');
const router = new Router();

const { shopping_cart } = require('../../db/mongo.ts');
const bodyParser = require('koa-bodyparser');

router.post('/shoppingCart/add', bodyParser(), async (ctx) => {
	try {
		const { userId, goodsId, quantity, selectedAttributes } = ctx.request.body;

		// 校验参数
		if (!userId || !goodsId || typeof quantity !== 'number' || !selectedAttributes) {
			ctx.status = 400; // Bad Request
			ctx.body = { code: 400, message: '缺少必要参数: 用户 ID, 商品 ID, 数量或选择的属性' };
			return;
		}

		// 检查购物车中是否已存在该商品及其属性
		const existingCart = await shopping_cart.findOne({
			// userId,
			goods: {
				$elemMatch: {
					id: goodsId,
					selectedAttributes, // 精确匹配 id 和 selectedAttributes
				},
			},
		});
		console.log('Existing Cart:', existingCart);

		// if (existingCart) {
		// 	// console.log('已存在', goodsId, selectedAttributes);

		// 	// 如果商品已存在，更新数量和时间
		// 	await shopping_cart.updateOne(
		// 		{
		// 			userId,
		// 			'goods.id': goodsId,
		// 			// 'goods.selectedAttributes': selectedAttributes,
		// 		},
		// 		{
		// 			$inc: { 'goods.$.quantity': quantity }, // 增加数量
		// 			$set: {
		// 				'goods.$.updatedAt': new Date(), // 更新商品时间
		// 				updatedAt: new Date(), // 更新购物车时间
		// 			},
		// 		},
		// 	);
		// } else {
		// 	console.log('不存在');
		// 	// 如果商品不存在，插入新商品
		// 	await shopping_cart.updateOne(
		// 		{ userId },
		// 		{
		// 			$push: {
		// 				goods: {
		// 					id: goodsId,
		// 					quantity,
		// 					selectedAttributes,
		// 					addedAt: new Date(),
		// 					updatedAt: new Date(),
		// 				},
		// 			},
		// 			$setOnInsert: { cartAddedAt: new Date() }, // 如果购物车不存在，创建时间
		// 			$set: { cartUpdatedAt: new Date() }, // 更新购物车的更新时间
		// 		},
		// 		{ upsert: true }, // 如果用户购物车不存在，则创建
		// 	);
		// }

		// 成功响应
		ctx.status = 200; // OK
		ctx.body = {
			code: 0,
			message: '商品已成功加入购物车',
		};
	} catch (error) {
		console.error('加入购物车失败:', error);
		ctx.status = 500; // Internal Server Error
		ctx.body = { code: 500, message: '加入购物车失败', error: error.message };
	}
});

module.exports = router;
