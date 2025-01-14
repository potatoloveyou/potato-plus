const Router = require('@koa/router');
const router = new Router();

// 中间件，解析post请求的参数
const bodyParser = require('koa-bodyparser');

const { user_shipping_addresses } = require('../../db/mongo.ts');

// // 定义接口
// interface AddressItem {
// 	userId: string;
// 	isDefault: boolean;
// 	recipient: string;
// 	phone: string;
// 	addressCity: string;
// 	address: string;
// 	createdAt?: Date;
// 	updatedAt?: Date;
// }

// // 定义响应接口
// interface ApiResponse {
// 	code: number;
// 	message?: string;
// 	error?: string;
// 	addressId?: string;
// }

router.post('/address/add', bodyParser(), async (ctx, next) => {
	// console.log(ctx.request.body);

	try {
		// 解构请求体
		const { userId, isDefault, recipient, phone, addressCity, address } = ctx.request.body;

		// 校验必要字段
		if (!userId || !recipient || !phone || !addressCity || !address) {
			ctx.status = 400;
			ctx.body = {
				code: 1,
				error: '缺少必填字段:用户ID、收件人、电话、地址城市、地址',
			};
			return;
		}

		// 如果 isDefault 为 true，将该用户其他地址的 isDefault 置为 false
		if (isDefault) {
			await user_shipping_addresses.updateMany(
				{ userId, isDefault: true }, // 限制条件，确保只更新默认地址
				{ $set: { isDefault: false } },
			);
		}

		// 创建新地址对象
		const newAddress = {
			userId,
			isDefault,
			recipient,
			phone,
			addressCity,
			address,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		// 插入新地址
		const result = await user_shipping_addresses.insertOne(newAddress);

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
			code: 1,
			error: 'Internal server error',
		};
	}
});

module.exports = router;
