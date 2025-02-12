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
					$set: {
						'shoppingItems.goodsDetails.discountAmount': {
							$subtract: [
								{ $toDouble: '$shoppingItems.goodsDetails.oprice' },
								{ $toDouble: '$shoppingItems.goodsDetails.pprice' },
							],
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
				{ $unset: 'addressId' },

				{
					$group: {
						_id: '$_id',
						userId: { $first: '$userId' },
						addressDetails: { $first: '$addressDetails' },
						shoppingItems: { $push: '$shoppingItems' },
						status: { $first: '$status' },
						statusDescription: { $first: '$statusDescription' },
						createdAt: { $first: '$createdAt' },
						expiresIn: { $first: '$expiresIn' },
						totalPrice: { $sum: { $multiply: ['$shoppingItems.goodsDetails.pprice', '$shoppingItems.quantity'] } },
						totalDiscount: {
							$sum: { $multiply: ['$shoppingItems.goodsDetails.discountAmount', '$shoppingItems.quantity'] },
						},
						totalQuantity: { $sum: '$shoppingItems.quantity' },
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
