const Router = require('@koa/router');
const router = new Router();

const bodyParser = require('koa-bodyparser');

const axios = require('axios');

// 微信小程序注册
router.post('/user/weixin_login', bodyParser(), async (ctx) => {
	try {
		const { phone, email, verify, js_code } = ctx.request.body;

		ctx.body = {
			code: 0,
			data: {
				phone,
				email,
				verify,
				js_code,
			},
		};

		// // console.log(weixinCode);
		// const appid = `wx659c09ff1f85754a`;
		// const secret = `955d4a14d688e2500a8e8762c7ebfa81`;
		// const grant_type = `authorization_code`;

		// const openidUrl = `https://api.weixin.qq.com/sns/jscode2session`;

		// const openId = await axios.get(openidUrl, {
		// 	params: {
		// 		js_code,
		// 		appid,
		// 		secret,
		// 		grant_type,
		// 	},
		// });

		// ctx.body = {
		// 	code: 0,
		// 	openId: openId.data,
		// };
	} catch (error) {}
});

module.exports = router;
