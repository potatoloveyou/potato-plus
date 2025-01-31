const Router = require('@koa/router');
const router = new Router();

const { ObjectId, user, refresh_tokens } = require('../../db/mongo.ts');

const bodyParser = require('koa-bodyparser');

const crypto = require('crypto');

const axios = require('axios');

// 生成 Token
const jwt = require('jsonwebtoken');

// 手机号加密密钥
const SECRET_KEY_PHONE = 'potato-love-you-encryption-phone';

// token加密密钥
const SECRET_KEY_TOKEN = 'potato-love-you-token';

const REFRESH_TOKEN_EXPIRATION = 30 * 24 * 60 * 60 * 1000; // Refresh Token 有效期（30天）

router.post('/user/app_login', bodyParser(), async (ctx) => {
	try {
		const { accessToken, openId, deviceInfo = 'Unknown Device' } = ctx.request.body;

		if (!accessToken || !openId) {
			ctx.body = { code: 400, message: '参数不完整' };
			return;
		}
		console.log(accessToken, openId, deviceInfo);

		// console.log(accessToken, openId);
		// console.log('deviceInfo', deviceInfo);

		// // Step 1: 获取手机号
		// const params = { access_token: accessToken, openid: openId };
		// const signStr = Object.keys(params)
		// 	.sort()
		// 	.map((key) => `${key}=${params[key]}`)
		// 	.join('&');
		// // 2. 生成 HMAC-SHA256 签名
		// const sign = crypto.createHmac('sha256', SECRET_KEY).update(signStr).digest('hex');
		// // 3. 请求云函数
		// const cloudUrl = `https://fc-mp-8f95879a-f871-43cc-961f-fa7c3730cf1d.next.bspapp.com/user/getPhoneNumber`;
		// const response = await axios.get(cloudUrl, {
		// 	params: { ...params, sign },
		// });
		// // 4. 判断云函数返回结果
		// if (response.data.code !== 0 || !response.data.data.phoneNumber) {
		// 	ctx.body = { code: 500, message: '云函数调用失败', error: response.data.message || '手机号获取失败' };
		// 	return;
		// }
		// // 5.	获取完整手机号
		// const fullPhoneNumber = response.data.data.phoneNumber;
		const fullPhoneNumber = '18927428970';

		// Step 2: 加密手机号
		const encryptedPhone = crypto
			.createHash('sha256')
			.update(fullPhoneNumber + SECRET_KEY_PHONE)
			.digest('hex');

		// Step 3: 查找用户和设备信息
		let userRecord = await user.findOne({ phoneNumber: encryptedPhone, 'devices.openId': openId });

		// 判断用户和设备信息是否都存在
		if (userRecord) {
			// 用户和设备信息存在，更新设备的登录信息
			await user.updateOne(
				{
					phoneNumber: encryptedPhone,
					'devices.openId': openId,
				},
				{
					$set: {
						'devices.$.deviceInfo': deviceInfo,
						'devices.$.lastLogin': new Date(),
						updateTime: new Date(),
					},
				},
			);
			//  查找用户和设备信息
			userRecord = await user.findOne({ phoneNumber: encryptedPhone, 'devices.openId': openId.data.openid });
		} else {
			// 如果不存在用户或设备信息，插入新的记录
			await user.updateOne(
				{
					phoneNumber: encryptedPhone,
				},
				{
					$set: {
						phoneNumber: encryptedPhone,
						createTime: new Date(),
						updateTime: new Date(),
					},
					$push: {
						devices: {
							openId,
							deviceInfo,
							lastLogin: new Date(),
						},
					},
				},
				{ upsert: true },
			);
			//  查找用户和设备信息
			userRecord = await user.findOne({ phoneNumber: encryptedPhone, 'devices.openId': openId.data.openid });
		}

		// Step 4: 生成Access Token
		const access_token = jwt.sign(
			{
				userId: userRecord._id.toString(),
				openId,
				encryptedPhone,
			},
			SECRET_KEY_TOKEN,
			{
				expiresIn: '10m',
			},
		);

		// Step 5: 生成并保存 Refresh Token
		const refresh_token = jwt.sign(
			{
				userId: userRecord._id.toString(),
				openId,
				encryptedPhone,
			},
			SECRET_KEY_TOKEN,
			{
				// 设置 token 有效期为 30 天
				expiresIn: `${REFRESH_TOKEN_EXPIRATION / 1000}s`,
			},
		);
		// 存储 Refresh Token 到 refresh_tokens 集合
		await refresh_tokens.updateOne(
			{
				userId: userRecord._id,
				openId,
			},
			{
				$set: {
					userId: userRecord._id,
					provider: deviceInfo.provider,
					openId,
					refreshToken: refresh_token,
					lastLogin: new Date(),
					expiresIn: new Date(Date.now() + REFRESH_TOKEN_EXPIRATION),
				},
				// $push: {},
			},
			{ upsert: true },
		);

		// 返回 token 和 refreshToken
		ctx.body = {
			code: 5,
			message: '成功',
			headers: {
				accessToken: access_token,
				refreshToken: refresh_token,
			},
		};
	} catch (error) {
		console.error('获取手机号失败：', error.message, error.stack);
		ctx.body = { code: 500, message: '服务器错误', error: error.message };
	}
});

module.exports = router;

// 需要存储 Token 的场景
// Token 管理与注销机制：

// 使用两种 Token：Access Token 和 Refresh Token。
// Access Token：短期有效，用于快速验证用户身份。
// Refresh Token：长期有效，后端存储，用于重新颁发 Access Token。
// 示例：
// 用户发送 Refresh Token 请求新的 Access Token。
// 后端查找存储的 Refresh Token，验证是否有效。
// 多设备登录或会话管理：
