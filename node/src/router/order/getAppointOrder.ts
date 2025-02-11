const Router = require('@koa/router');
const router = new Router();

const verifyAccessToken = require('../../middleware/verifyAccessToken.ts');

const { ObjectId, order, goods_search } = require('../../db/mongo.ts');

// 获取指定用户订单
router.get('/order/get/:orderId', verifyAccessToken, async (ctx, next) => {
	try {
		const { userId } = ctx.state.user;
		let { orderId } = ctx.request.params; // 获取路径参数

		// const result = await order.findOne({ _id: new ObjectId(orderId), userId });
		// if (result) {
		// 	ctx.body = {
		// 		code: 0,
		// 		data: result,
		// 	};
		// } else {
		// 	ctx.body = {
		// 		code: 1,
		// 		message: '订单不存在',
		// 	};
		// }

		const ordersWithGoodsDetails = await order
			.aggregate([
				{ $match: { _id: new ObjectId(orderId), userId } },
				{ $unwind: '$shoppingItems' }, // 2️⃣ 拆分 shoppingItems 数组
				{
					$set: {
						'shoppingItems.goodsId': { $toObjectId: '$shoppingItems.goodsId' }, // 3️⃣ 转换 goodsId 为 ObjectId
					},
				},
				{
					$lookup: {
						from: 'goods_search',
						localField: 'shoppingItems.goodsId',
						foreignField: '_id',
						as: 'shoppingItems.goodsDetails', // 4️⃣ 关联商品信息
					},
				},
				{
					$set: {
						'shoppingItems.goodsDetails': { $arrayElemAt: ['$shoppingItems.goodsDetails', 0] }, // 5️⃣ 取数组第一个元素，变成对象
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
				{ $unset: 'shoppingItems.goodsId' }, // 6️⃣ 删除 goodsId
				{
					$group: {
						_id: '$_id',
						userId: { $first: '$userId' },
						addressId: { $first: '$addressId' },
						shoppingItems: { $push: '$shoppingItems' }, // 重新组合 shoppingItems 数组
						status: { $first: '$status' },
						statusDescription: { $first: '$statusDescription' }, // 这里返回转换后的状态
						createdAt: { $first: '$createdAt' },
						expiresIn: { $first: '$expiresIn' },
					},
				},
			])
			.toArray();

		ctx.body = {
			code: 0,
			data: ordersWithGoodsDetails[0],
		};
	} catch (error) {
		ctx.body = {
			code: 1,
			message: error.message,
		};
	}
});

module.exports = router;
