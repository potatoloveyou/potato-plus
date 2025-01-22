const Router = require('@koa/router');
const router = new Router();

const bodyParser = require('koa-bodyparser');

const axios = require('axios');

//

router.post('/user/weixin_getPhoneNumberLogin', bodyParser(), async (ctx) => {
	try {
		const { code: weixinCode } = ctx.request.body;
		// console.log(weixinCode);
		const appid = `wx659c09ff1f85754a`;
		const secret = `955d4a14d688e2500a8e8762c7ebfa81`;
		const grant_type = `authorization_code`;

		const cloudUrl = `https://api.weixin.qq.com/sns/jscode2session`;

		console.log(weixinCode);

		const res = await axios.get(cloudUrl, {
			params: {
				js_code: weixinCode,
				appid,
				secret,
				grant_type,
			},
		});

		console.log(res.data);
	} catch (error) {}
});

module.exports = router;
