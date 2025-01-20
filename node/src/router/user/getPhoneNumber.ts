const Router = require('@koa/router');
const router = new Router();

const { user } = require('../../db/mongo.ts');

const bodyParser = require('koa-bodyparser');

const crypto = require('crypto');

const axios = require('axios');

router.post('/user/getPhoneNumber', bodyParser(), async (ctx) => {
	// https://fc-mp-8f95879a-f871-43cc-961f-fa7c3730cf1d.next.bspapp.com/user/getPhoneNumber

	try {
		const { accessToken, openId } = ctx.request.body;
		console.log('Received openId:', openId);
		console.log('Received accessToken:', accessToken);

		// 定义密钥（与客户端保持一致）
		const SECRET_KEY = 'potato-love-you'; // 切勿暴露密钥，使用环境变量存储更安全

		if (!accessToken || !openId) {
			ctx.body = { code: 400, message: '参数不完整' };
			return;
		}

		// 1. 参数排序并拼接签名字符串
		const params = { access_token: accessToken, openid: openId };
		const signStr = Object.keys(params)
			.sort()
			.map((key) => `${key}=${params[key]}`)
			.join('&');

		// 2. 生成 HMAC-SHA256 签名
		const hmac = crypto.createHmac('sha256', SECRET_KEY);
		hmac.update(signStr);
		const sign = hmac.digest('hex');

		// 3. 请求云函数
		const cloudUrl = `https://fc-mp-8f95879a-f871-43cc-961f-fa7c3730cf1d.next.bspapp.com/user/getPhoneNumber`;

		const response = await axios.get(cloudUrl, {
			params: { ...params, sign },
		});

		// 4. 返回云函数的结果
		ctx.body = { code: 0, message: '成功', data: response.data };
	} catch (error) {
		console.error('调用云函数失败：', error);
		ctx.body = { code: 500, message: '获取手机号失败', error: error.message };
	}
});

module.exports = router;
