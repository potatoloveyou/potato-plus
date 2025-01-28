const Router = require('@koa/router');
const router = new Router();

const verifyAccessToken = require('../middleware/verifyAccessToken.ts');

router.get('/testToken', verifyAccessToken, async (ctx, next) => {
	const { userId, openId, encryptedPhone } = ctx.state.user;
	// const decoded = ctx.state.user;
	ctx.body = {
		code: 0,
		message: '成功',
		data: {
			userId,
			openId,
			encryptedPhone,
			// decoded,
		},
	};
});

module.exports = router;
