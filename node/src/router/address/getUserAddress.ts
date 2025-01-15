const Router = require('@koa/router');
const router = new Router();

const { user_shipping_addresses } = require('../../db/mongo.ts');

// 中间件，解析请求参数
const bodyParser = require('koa-bodyparser');

// 获取用户地址接口
router.post('/address/get', bodyParser(), async (ctx, next) => {
	try {
		// 从请求参数中获取 userId、offset 和 limit
		const { userId, offset = 0, limit = 10 } = ctx.request.body;

		// 校验 userId 是否存在
		if (!userId) {
			ctx.body = {
				code: 1,
				error: '缺少必填字段: userId',
			};
			return;
		}

		// 查询数据库
		const query = { userId };
		const options = {
			skip: parseInt(offset), // 从第 offset 条记录开始
			limit: parseInt(limit), // 只取 limit 条记录
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
