const Router = require('@koa/router');
const router = new Router();

const { ObjectId, shopping_cart, shopping_cart_item } = require('../../db/mongo.ts');
const bodyParser = require('koa-bodyparser');

const verifyAccessToken = require('../../middleware/verifyAccessToken.ts');

router.post('/shoppingCart/add', verifyAccessToken, bodyParser(), async (ctx) => {
	try {
		const { userId } = ctx.state.user;
		const { goodsId, quantity, selectedAttributes } = ctx.request.body;

		// 校验参数
		if (!goodsId || typeof quantity !== 'number' || !selectedAttributes) {
			ctx.status = 400; // Bad Request
			ctx.body = { code: 400, message: '缺少必要参数: 用户 ID, 商品 ID, 数量或选择的属性' };
			return;
		}

		let cartItem;
		// 检查购物车中是否已存在该商品及其属性
		cartItem = await shopping_cart_item.findOne({
			userId,
			goodsId,
			selectedAttributes,
		});
		if (cartItem) {
			// 如果存在，更新数量和更新时间
			await shopping_cart_item.updateOne(
				{ _id: new ObjectId(cartItem._id) },
				{
					$inc: { quantity }, // 增加数量
					$set: { updatedAt: new Date() }, // 更新时间
				},
			);
		} else {
			// 如果不存在，插入新商品
			await shopping_cart_item.insertOne({
				userId,
				goodsId,
				quantity,
				selectedAttributes,
				addedAt: new Date(),
				updatedAt: new Date(),
			});
			// 重新查询刚刚创建的购物车项，确保获取 _id
			cartItem = await shopping_cart_item.findOne({
				userId,
				goodsId,
				selectedAttributes,
			});
		}

		// 更新 shopping_cart，把 cartItem._id 加入 goodsId 数组
		await shopping_cart.updateOne(
			{ userId },
			{
				$addToSet: { cartItemIds: cartItem._id.toString() }, // 确保不会重复添加
				$setOnInsert: { createdAt: new Date() }, // 购物车首次创建时间
				$set: { updatedAt: new Date() }, // 更新购物车的更新时间
			},
			{ upsert: true }, // 如果用户购物车不存在，则创建
		);

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
