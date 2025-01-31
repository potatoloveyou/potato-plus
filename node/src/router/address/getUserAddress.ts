const Router = require('@koa/router');
const router = new Router();

const { user_shipping_addresses } = require('../../db/mongo.ts');

// 中间件，解析请求参数
const bodyParser = require('koa-bodyparser');

const verifyAccessToken = require('../../middleware/verifyAccessToken.ts');

// 获取用户地址接口
router.post('/address/get', verifyAccessToken, bodyParser(), async (ctx, next) => {
	try {
		const { userId } = ctx.state.user;

		// 从请求参数中获取 userId、offset 和 limit
		const { offset = 0, limit = 10 } = ctx.request.body;

		// 查询数据库
		const query = { userId };
		const options = {
			skip: parseInt(offset), // 从第 offset 条记录开始
			limit: parseInt(limit), // 只取 limit 条记录
			sort: { createdAt: -1 }, // 按 createdAt 降序排列
		};

		const data = await user_shipping_addresses.find(query, options).toArray();

		ctx.body = {
			code: 0,
			data,
		};
	} catch (error) {
		console.error('Error fetching addresses:', error);
		ctx.status = 500;
		ctx.body = {
			code: 1,
			error: 'Internal server error',
		};
	}
});

module.exports = router;
