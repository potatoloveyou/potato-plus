const Router = require('@koa/router');
const router = new Router();

const { ObjectId, user_shipping_addresses } = require('../../db/mongo.ts');

const bodyParser = require('koa-bodyparser');

router.put('/address/update/:id', bodyParser(), async (ctx) => {
	try {
		// 获取路径参数和请求体
		const addressId = ctx.params.id;
		const updatedData = ctx.request.body;

		// 检查地址 ID 是否存在
		if (!addressId) {
			ctx.status = 400;
			ctx.body = { code: 400, message: '地址 ID 缺失' };
			return;
		}

		// 检查更新数据是否存在并校验必要字段
		if (
			!updatedData ||
			!updatedData.recipient ||
			!updatedData.phone ||
			!updatedData.addressCity ||
			!updatedData.address
		) {
			ctx.status = 400;
			ctx.body = { code: 400, message: '缺少必填字段: 收件人、电话、地址城市、地址' };
			return;
		}

		// 添加 updatedAt 字段
		updatedData.updatedAt = new Date();

		// 检查是否需要更新为默认地址
		if (updatedData.isDefault) {
			// 获取目标地址的用户 ID
			const addressToUpdate = await user_shipping_addresses.findOne({ _id: new ObjectId(addressId) });

			if (!addressToUpdate) {
				ctx.status = 404;
				ctx.body = { code: 404, message: '未找到指定的地址' };
				return;
			}

			// 将该用户的所有地址的 isDefault 设置为 false
			await user_shipping_addresses.updateMany({ userId: addressToUpdate.userId }, { $set: { isDefault: false } });
		}

		// 执行数据库更新操作
		const result = await user_shipping_addresses.updateOne(
			{ _id: new ObjectId(addressId) }, // 查询条件
			{ $set: updatedData }, // 更新的数据
		);

		// 根据更新结果返回响应
		if (result.matchedCount === 0) {
			ctx.status = 404;
			ctx.body = { code: 404, message: '未找到指定的地址' };
		} else if (result.modifiedCount === 1) {
			ctx.status = 200;
			ctx.body = { code: 0, message: '地址更新成功' };
		} else {
			ctx.status = 304;
			ctx.body = { code: 304, message: '地址未被修改' };
		}
	} catch (error) {
		console.error('更新地址失败:', error);
		ctx.status = 500;
		ctx.body = { code: 500, message: '更新地址失败', error: error.message };
	}
});

module.exports = router;
