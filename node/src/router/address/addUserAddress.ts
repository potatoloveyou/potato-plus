const Router = require('@koa/router');
const router = new Router();

// 中间件，解析post请求的参数
const bodyParser = require('koa-bodyparser');

const verifyAccessToken = require('../../middleware/verifyAccessToken.ts');

const { user_shipping_addresses } = require('../../db/mongo.ts');

router.post('/address/add', verifyAccessToken, bodyParser(), async (ctx, next) => {
	// console.log(ctx.request.body);

	try {
		const { userId } = ctx.state.user;
		// 解构请求体
		const { isDefault, recipient, phone, addressCity, address } = ctx.request.body;

		// 校验必要字段
		if (!userId || !recipient || !phone || !addressCity || !address) {
			ctx.status = 400;
			ctx.body = {
				code: 400,
				error: '缺少必填字段:用户ID、收件人、电话、地址城市、地址',
			};
			return;
		}

		// 检查当前用户是否已有地址
		const userHasAddresses = await user_shipping_addresses.countDocuments({ userId });

		let finalIsDefault = isDefault;

		// 如果用户没有任何地址，将 isDefault 强制设置为 true
		if (userHasAddresses === 0) {
			finalIsDefault = true;
		}

		// 如果 finalIsDefault 为 true，将该用户其他地址的 isDefault 置为 false
		if (finalIsDefault) {
			await user_shipping_addresses.updateMany(
				{ userId, isDefault: true }, // 限制条件，确保只更新默认地址
				{ $set: { isDefault: false } },
			);
		}

		// 创建新地址对象
		const newAddress = {
			userId,
			isDefault: finalIsDefault,
			recipient,
			phone,
			addressCity,
			address,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		// 插入新地址
		const result = await user_shipping_addresses.insertOne(newAddress);

		ctx.status = 200;
		ctx.body = {
			code: 0,
			message: '添加成功',
			// 返回新插入的地址 ID
			addressId: result.insertedId.toString(),
			data: newAddress,
		};
	} catch (error) {
		console.error('Error adding address:', error);
		ctx.status = 500;
		ctx.body = {
			code: 500,
			error: 'Internal server error',
		};
	}
});

module.exports = router;
