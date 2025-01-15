const Router = require('@koa/router');
const router = new Router();

const { ObjectId, user_shipping_addresses } = require('../../db/mongo.ts');

// DELETE 请求，删除地址
router.delete('/address/delete/:id', async (ctx, next) => {
	try {
		// 获取路径参数中的地址 ID
		const addressId = ctx.params.id;

		if (!addressId) {
			ctx.status = 400;
			ctx.body = { code: 400, message: '地址 ID 缺失' };
			return;
		}

		// 查询地址以获取用户 ID
		const addressToDelete = await user_shipping_addresses.findOne({ _id: new ObjectId(addressId) });
		// console.log(addressToDelete.userId);

		if (!addressToDelete) {
			ctx.status = 404;
			ctx.body = {
				code: 1,
				message: '未找到指定的地址',
			};
			return;
		}

		// 数据库删除操作
		const result = await user_shipping_addresses.deleteOne({ _id: new ObjectId(addressId) });

		if (result.deletedCount === 1) {
			// 检查剩余地址数量
			const remainingAddresses = await user_shipping_addresses
				.find({ userId: addressToDelete.userId })
				.sort({ createdAt: -1 }) // 按 createdAt 时间倒序排序
				.toArray();

			// 如果删除的地址是默认地址
			if (addressToDelete.isDefault && remainingAddresses.length > 0) {
				// 将最近创建的地址设为默认地址
				await user_shipping_addresses.updateOne(
					{ _id: remainingAddresses[0]._id },
					{ $set: { isDefault: true, updatedAt: new Date() } },
				);
			}

			// 如果仅剩一个地址，将其设为默认地址（包含在上面逻辑中）
			if (remainingAddresses.length === 1) {
				await user_shipping_addresses.updateOne(
					{ _id: remainingAddresses[0]._id },
					{ $set: { isDefault: true, updatedAt: new Date() } },
				);
			}

			ctx.status = 200;
			ctx.body = {
				code: 0,
				message: '地址删除成功',
			};
		} else {
			ctx.status = 404;
			ctx.body = {
				code: 1,
				message: '未找到指定的地址',
			};
		}
	} catch (error) {
		console.error('删除地址失败:', error);
		ctx.status = 500;
		ctx.body = {
			code: 500,
			message: '删除地址失败',
			error: error.message,
		};
	}
});

module.exports = router;
