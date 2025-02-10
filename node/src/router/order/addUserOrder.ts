const Router = require('@koa/router');
const router = new Router();

// 中间件，解析post请求的参数
const bodyParser = require('koa-bodyparser');

const verifyAccessToken = require('../../middleware/verifyAccessToken.ts');

const { ObjectId, order, shopping_cart_item } = require('../../db/mongo.ts');

router.post('/order/add', verifyAccessToken, bodyParser(), async (ctx, next) => {
	try {
		const { userId } = ctx.state.user;
		const { shoppingIds, addressId } = ctx.request.body;

		// 构造 Map，方便查找 quantity
		const shoppingIdMap = new Map(shoppingIds.map((item) => [item.shoppingId, item.quantity]));

		// 查询购物车中的商品
		const shoppingIdList = shoppingIds.map((item) => new ObjectId(item.shoppingId));
		const cartItems = await shopping_cart_item.find({ _id: { $in: shoppingIdList }, userId }).toArray();

		// 构造订单商品列表
		const updatedShoppingIds = cartItems.map((cartItem) => ({
			goodsId: cartItem.goodsId,
			selectedAttributes: cartItem.selectedAttributes,
			quantity: shoppingIdMap.get(cartItem._id.toString()) || cartItem.quantity,
		}));

		/**
		 * status	状态含义	说明
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

		// 创建订单
		const orderResult = await order.insertOne({
			userId,
			addressId,
			shoppingItems: updatedShoppingIds,
			status: '0',
			createdAt: new Date(),
			expiresIn: new Date(Date.now() + 1000 * 60 * 15), // 15 分钟后订单失效
		});

		ctx.body = {
			code: 0,
			orderResult,
		};
	} catch (error) {}
});

module.exports = router;
