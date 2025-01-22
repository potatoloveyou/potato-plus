const Router = require('@koa/router');
const { refresh_tokens } = require('../../db/mongo.ts');
const verifyToken = require('../../middleware/verifyToken.ts'); // 引入中间件

const router = new Router();

router.post('/user/logout', verifyToken, async (ctx) => {
	try {
		// Step 1: 获取 Refresh Token 和 logoutAllDevices 参数
		const { refreshToken, logoutAllDevices } = ctx.request.body;

		if (!refreshToken && !logoutAllDevices) {
			ctx.status = 400;
			ctx.body = { code: 400, message: '参数不完整，需要提供 Refresh Token 或指定注销所有设备' };
			return;
		}

		// Step 2: 获取当前用户的 userId
		const { userId } = ctx.state.user; // `verifyToken` 中间件解析后存入 ctx.state.user

		// Step 3: 删除 Refresh Token
		const filter = logoutAllDevices
			? { userId } // 全部设备
			: { userId, token: refreshToken }; // 当前设备

		const deleteResult = await refresh_tokens.deleteMany(filter);

		if (deleteResult.deletedCount === 0) {
			ctx.status = 400;
			ctx.body = { code: 400, message: '未找到对应的 Refresh Token 或该用户未登录' };
			return;
		}

		// Step 4: 返回成功响应
		ctx.body = {
			code: 0,
			message: logoutAllDevices ? '已成功注销所有设备' : '注销成功',
		};
	} catch (error) {
		console.error('注销失败:', error.message);
		ctx.status = 500;
		ctx.body = { code: 500, message: '服务器错误', error: error.message };
	}
});

module.exports = router;
