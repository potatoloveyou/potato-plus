const Router = require('@koa/router');
const router = new Router();

const { various_bar } = require('../db/mongo.ts');

// 获取各种bar
router.get('/variousBar', async (ctx, next) => {
	try {
		const variousBar = await various_bar.find().toArray();
		ctx.body = {
			code: 0,
			data: variousBar,
		};
	} catch (error) {}
});

module.exports = router;
