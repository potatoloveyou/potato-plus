const Router = require('@koa/router');
const router = new Router();

const verifyAccessToken = require('../../middleware/verifyAccessToken.ts');

const { ObjectId, shopping_cart, goods_search } = require('../../db/mongo.ts');

router.get('/shoppingCart/get', verifyAccessToken, async (ctx) => {
	try {
		const { userId } = ctx.state.user;

		if (!userId) {
			ctx.status = 400; // Bad Request
			ctx.body = { code: 400, message: '用户 ID 缺失' };
			return;
		}
		// console.log(userId);

		// 查询购物车数据
		const cartData = await shopping_cart.findOne({ userId });
		// console.log(cartData);

		if (!cartData) {
			ctx.status = 200; // Not Found
			ctx.body = {
				code: 0,
				message: '购物车为空',
			};
			return;
		}

		// 使用 aggregate 进行关联查询
		const cartItems = await shopping_cart
			.aggregate([
				{ $match: { userId } }, // 匹配用户 ID
				{ $unwind: '$goods' }, // 拆分 goods 数组
				{
					$lookup: {
						from: 'goods_search', // 关联 goods_search 集合
						let: { goodsId: '$goods.id' }, // 提取每个商品的 id
						pipeline: [{ $match: { $expr: { $eq: ['$_id', { $toObjectId: '$$goodsId' }] } } }],
						as: 'goodsDetails',
					},
				},
				{ $unwind: '$goodsDetails' }, // 展开 goodsDetails 数组
				{
					$project: {
						_id: 0,
						quantity: '$goods.quantity',
						selectedAttributes: '$goods.selectedAttributes',
						'goodsDetails._id': 1,
						'goodsDetails.name': 1,
						'goodsDetails.imgUrl': 1,
						'goodsDetails.pprice': 1,
						'goodsDetails.discount': 1,
						'goodsDetails.oprice': 1,
						'goodsDetails.attributes': 1,
						addedAt: '$goods.addedAt',
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
