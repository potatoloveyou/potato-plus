const Router = require('@koa/router');
const router = new Router();

const verifyAccessToken = require('../../middleware/verifyAccessToken.ts');

const { ObjectId, shopping_cart, goods_search, shopping_cart_item } = require('../../db/mongo.ts');

router.get('/shoppingCart/get', verifyAccessToken, async (ctx) => {
	try {
		const { userId } = ctx.state.user;

		// 查询购物车数据
		const cartData = await shopping_cart.findOne({ userId });

		if (!cartData || !cartData.cartItemIds || cartData.cartItemIds.length === 0) {
			ctx.status = 200;
			ctx.body = { code: 0, message: '购物车为空', data: [] };
			return;
		}

		const cartItems = await shopping_cart_item
			.aggregate([
				{ $match: { userId } }, // 确保 userId 是 ObjectId
				{
					$addFields: {
						goodsIdObj: { $toObjectId: '$goodsId' }, // 将 goodsId 转换为 ObjectId
					},
				},
				{
					$lookup: {
						from: 'goods_search',
						localField: 'goodsIdObj', // 使用转换后的字段
						foreignField: '_id',
						as: 'goodsDetails',
					},
				},
				{ $unwind: '$goodsDetails' },
				{
					$project: {
						_id: 1,
						quantity: 1,
						selectedAttributes: 1,
						addedAt: 1,
						updatedAt: 1,
						'goodsDetails._id': 1,
						'goodsDetails.name': 1,
						'goodsDetails.imgUrl': 1,
						'goodsDetails.pprice': 1,
						'goodsDetails.discount': 1,
						'goodsDetails.oprice': 1,
						'goodsDetails.attributes': 1,
					},
				},
			])
			.toArray();

		// 返回数据
		ctx.status = 200; // OK
		ctx.body = {
			code: 0,
			data: cartItems,
			message: '获取购物车成功',
		};
	} catch (error) {
		console.error('获取购物车失败:', error);
		ctx.status = 500; // Internal Server Error
		ctx.body = {
			code: 500,
			message: '获取购物车失败',
			error: error.message,
		};
	}
});

module.exports = router;
