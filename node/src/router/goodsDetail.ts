const Router = require('@koa/router');
// https://github.com/koajs/router
const router = new Router();

const { ObjectId, goods_search } = require('../db/mongo.ts');

router.get('/goods/detail', async (ctx, next) => {
	try {
		const { id } = ctx.request.query;
		// console.log(id);

		const goods = await goods_search.findOne({ _id: new ObjectId(id) });
		ctx.body = {
			code: 0,
			data: goods,
		};
	} catch (error) {}
});

module.exports = router;
