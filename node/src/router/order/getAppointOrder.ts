const Router = require('@koa/router');
const router = new Router();

const verifyAccessToken = require('../../middleware/verifyAccessToken.ts');

const { ObjectId, order, goods_search, user_shipping_addresses } = require('../../db/mongo.ts');

// 获取指定用户订单
router.get('/order/get/:orderId', verifyAccessToken, async (ctx, next) => {
	try {
		const { userId } = ctx.state.user;
		let { orderId } = ctx.request.params; // 获取路径参数

		const ordersWithDetails = await order
			.aggregate([
				{ $match: { _id: new ObjectId(orderId), userId } },

				// 1️⃣ 处理购物车商品信息
				{ $unwind: { path: '$shoppingItems', preserveNullAndEmptyArrays: true } },
				{
					$set: {
						'shoppingItems.goodsId': { $toObjectId: '$shoppingItems.goodsId' },
					},
				},
				{
					$lookup: {
						from: 'goods_search',
						localField: 'shoppingItems.goodsId',
						foreignField: '_id',
						as: 'shoppingItems.goodsDetails',
					},
				},
				{
					$set: {
						'shoppingItems.goodsDetails': {
							$ifNull: [{ $arrayElemAt: ['$shoppingItems.goodsDetails', 0] }, {}],
						},
					},
				},
				{
					$project: {
						'shoppingItems.goodsDetails.attributes': 0,
						'shoppingItems.goodsDetails.createdAt': 0,
						'shoppingItems.goodsDetails.updatedAt': 0,
						'shoppingItems.goodsDetails.stock': 0,
					},
				},
				{ $unset: 'shoppingItems.goodsId' },
				{
					$set: {
						addressId: { $toObjectId: '$addressId' },
					},
				},
				// 2️⃣ 关联地址信息
				{
					$lookup: {
						from: 'user_shipping_addresses',
						localField: 'addressId',
						foreignField: '_id',
						as: 'addressDetails',
					},
				},
				{
					$set: {
						addressDetails: { $ifNull: [{ $arrayElemAt: ['$addressDetails', 0] }, {}] },
					},
				},
				{ $unset: 'addressId' }, // 避免返回冗余的 addressId

				// 3️⃣ 重新组合数据
				{
					$group: {
						_id: '$_id',
						userId: { $first: '$userId' },
						addressDetails: { $first: '$addressDetails' }, // 新增的地址信息
						shoppingItems: { $push: '$shoppingItems' },
						status: { $first: '$status' },
						createdAt: { $first: '$createdAt' },
						expiresIn: { $first: '$expiresIn' }, // 新增的过期时间
					},
				},
			])
			.toArray();

		// 订单不存在的情况
		if (!ordersWithDetails.length) {
			ctx.body = { code: 1, message: '订单不存在' };
			return;
		}

		ctx.body = {
			code: 0,
			data: ordersWithDetails[0],
		};
	} catch (error) {
		ctx.body = {
			code: 1,
			message: error.message,
		};
	}
});

module.exports = router;
