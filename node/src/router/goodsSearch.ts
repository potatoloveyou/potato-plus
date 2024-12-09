const Router = require('@koa/router');
// https://github.com/koajs/router
const router = new Router();

const { ObjectId, goods_search } = require('../db/mongo.ts');

router.get('/goods/search', async (ctx, next) => {
	try {
		// console.log(ctx.request.query);
		let { name, pprice, discount } = ctx.request.query;
		// console.log(name, pprice, discount);

		if (!name || (!pprice && !discount) || (pprice && discount)) {
			ctx.body = {
				code: 1,
				message: '请求参数错误，请同时传递 name 和 pprice 或 name 和 discount',
			};
			return;
		}

		let query = {
			// $regex模糊查询
			name: { $regex: name },
		};
		let options = {
			sort: {},
		};

		if (pprice == '1') {
			options.sort = { pprice: 1 };
		} else if (pprice == '2') {
			options.sort = { pprice: -1 };
		}

		if (discount === '1') {
			options.sort = { discount: 1 };
		} else if (discount === '2') {
			options.sort = { discount: -1 };
		}
		// 查找数据库
		const goodsSearch = goods_search.find(query, options);

		ctx.body = {
			code: 0,
			data: await goodsSearch.toArray(),
		};
	} catch (error) {
		ctx.body = {
			code: 1,
			data: '查询失败',
		};
	}
});

module.exports = router;

// 中间件，解析post请求的参数
