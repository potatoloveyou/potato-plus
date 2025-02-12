const Router = require('@koa/router');
const router = new Router();

const verifyAccessToken = require('../../middleware/verifyAccessToken.ts');

const { ObjectId, order, goods_search } = require('../../db/mongo.ts');

router.get('/order/get/:status/:offset/:limit', verifyAccessToken, async (ctx, next) => {
	try {
		const { userId } = ctx.state.user;
		let { status, offset, limit } = ctx.request.params; // 获取路径参数

		/**
		 * status	状态含义	说明
		 * 00 全部	查询所有状态的订单。默认值。
		 * 0	待支付	订单已创建，等待用户支付。
		 * 01	已取消	订单被取消(未付款)。
		 * 011 支付超时：用户未在规定时间内支付，订单自动取消。
		 *
		 * 02	退款中	订单被取消(已付款)，用户申请退款。
		 * 03	已退款	退款已完成，款项已退回用户账户。
		 *
		 * 1	待发货	订单已支付，等待发货。
		 *
		 * 2	待收货	订单已发货，等待用户确认收货。
		 * 21	退货中	用户申请退货。
		 * 22	已退货	退货已完成，款项已退回用户账户。
		 * 23	换货中	用户申请换货，正在处理。
		 * 24	已换货	换货已完成，用户已收到新商品。
		 *
		 * 3	已完成	订单已完成，用户已确认收货。
		 *
		 * 4	待评价	订单已完成，等待用户评价。
		 * 41	已评价	用户已评价订单。
		 *
		 * 5	异常订单	订单出现异常，需人工介入处理。
		 * 51 物流异常：物流信息异常（如长时间未更新）。
		 * 52 库存异常：库存不足导致订单无法正常处理。
		 * 53 用户信息异常：用户提供的地址或联系方式有误。
		 */

		let query = { userId };

		// 如果状态不为 '00'，添加状态过滤条件
		if (status !== '00') {
			query.status = status;
		}

		const ordersWithGoodsDetails = await order
			.aggregate([
				{ $match: query }, // 1️⃣ 过滤当前用户的订单
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
					$addFields: {
						statusDescription: {
							$switch: {
								branches: [
									{ case: { $eq: ['$status', '00'] }, then: '全部订单' },
									{ case: { $eq: ['$status', '0'] }, then: '待买家支付' },
									{ case: { $eq: ['$status', '01'] }, then: '已取消' },
									{ case: { $eq: ['$status', '011'] }, then: '支付超时' },
									{ case: { $eq: ['$status', '02'] }, then: '退款中' },
									{ case: { $eq: ['$status', '03'] }, then: '已退款' },
									{ case: { $eq: ['$status', '1'] }, then: '待发货' },
									{ case: { $eq: ['$status', '2'] }, then: '待收货' },
									{ case: { $eq: ['$status', '21'] }, then: '退货中' },
									{ case: { $eq: ['$status', '22'] }, then: '已退货' },
									{ case: { $eq: ['$status', '23'] }, then: '换货中' },
									{ case: { $eq: ['$status', '24'] }, then: '已换货' },
									{ case: { $eq: ['$status', '3'] }, then: '已完成' },
									{ case: { $eq: ['$status', '4'] }, then: '待评价' },
									{ case: { $eq: ['$status', '41'] }, then: '已评价' },
									{ case: { $eq: ['$status', '5'] }, then: '异常订单' },
									{ case: { $eq: ['$status', '51'] }, then: '物流异常' },
									{ case: { $eq: ['$status', '52'] }, then: '库存异常' },
									{ case: { $eq: ['$status', '53'] }, then: '用户信息异常' },
								],
								default: '未知状态',
							},
						},
					},
				},
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
						// **计算 totalPrice**
						totalPrice: { $sum: { $multiply: ['$shoppingItems.goodsDetails.pprice', '$shoppingItems.quantity'] } },
					},
				},
				{ $skip: Number(offset) },
				{ $limit: Number(limit) },
				{ $sort: { createdAt: -1 } },
			])
			.toArray();

		// if (ordersWithGoodsDetails?.length === 0) {
		// 	ctx.body = {
		// 		code: 0,
		// 		message: '暂无订单记录',
		// 		data: [],
		// 	};
		// 	return;
		// }

		ctx.body = {
			code: 0,
			data: ordersWithGoodsDetails,
		};
	} catch (error) {
		console.error('获取订单失败:', error);
		ctx.body = {
			code: 1,
			message: '获取订单失败，请稍后再试',
		};
	}
});

module.exports = router;
