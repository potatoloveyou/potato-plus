const Router = require('@koa/router');
const router = new Router();

const bodyParser = require('koa-bodyparser');

const crypto = require('crypto');

const axios = require('axios');

const { ObjectId, user, refresh_tokens, verify } = require('../../db/mongo.ts');

// 生成 Token
const jwt = require('jsonwebtoken');

// 手机号加密密钥
const SECRET_KEY_PHONE = 'potato-love-you-encryption-phone';

// token加密密钥
const SECRET_KEY_TOKEN = 'potato-love-you-token';

const REFRESH_TOKEN_EXPIRATION = 30 * 24 * 60 * 60 * 1000; // Refresh Token 有效期（30天）

// 微信小程序注册
router.post('/user/weixin_login', bodyParser(), async (ctx) => {
	try {
		const { phone, email, verificationCode, js_code, deviceInfo = 'Unknown Device' } = ctx.request.body;

		if (!phone || !email || !verificationCode || !js_code) {
			ctx.status = 400;
			ctx.body = {
				code: 400,
				msg: '缺少必要的参数',
			};
			return;
		}

		// 查询数据库中的验证码记录
		const dbRecord = await verify.findOne({
			email,
			verificationCode,
			expiration: { $gt: Date.now() }, // 确保验证码未过期
		});

		if (!dbRecord) {
			// 如果没有找到有效的验证码记录，则删除该 email 对应的所有验证码记录
			await verify.deleteMany({ email });

			ctx.status = 400;
			ctx.body = {
				code: 400,
				msg: '验证码已过期或无效',
			};
			return;
		} else {
			// 如果找到有效的验证码记录，则删除该 email 对应的其他过期验证码记录
			await verify.deleteMany({
				email,
				expiration: { $lt: Date.now() }, // 删除过期记录
			});
		}

		const appid = `wx659c09ff1f85754a`;
		const secret = `955d4a14d688e2500a8e8762c7ebfa81`;
		const grant_type = `authorization_code`;

		const openidUrl = `https://api.weixin.qq.com/sns/jscode2session`;

		const openId = await axios.get(openidUrl, {
			params: {
				js_code,
				appid,
				secret,
				grant_type,
			},
		});

		//  加密手机号
		const encryptedPhone = crypto
			.createHash('sha256')
			.update(phone + SECRET_KEY_PHONE)
			.digest('hex');

		//  查找用户和设备信息
		let userRecord = await user.findOne({ phoneNumber: encryptedPhone, 'devices.openId': openId.data.openid });

		// 判断用户和设备信息是否都存在
		if (userRecord) {
			// 用户和设备信息存在，更新设备的登录信息
			await user.updateOne(
				{
					phoneNumber: encryptedPhone,
					'devices.openId': openId.data.openid,
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
						createTime: new Date(),
						updateTime: new Date(),
					},
					$push: {
						devices: {
							openId: openId.data.openid,
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
				openId: openId.data.openid,
				encryptedPhone,
			},
			SECRET_KEY_TOKEN,
			{
				// h时 m钟 s秒
				expiresIn: '10m',
			},
		);

		// Step 5: 生成并保存 Refresh Token
		const refresh_token = jwt.sign(
			{
				userId: userRecord._id.toString(),
				openId: openId.data.openid,
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
				openId: openId.data.openid,
			},
			{
				$set: {
					userId: userRecord._id,
					provider: deviceInfo.provider,
					openId: openId.data.openid,
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
		ctx.body = {
			code: 500,
			message: '服务器错误',
			error: error.message,
		};
	}
});

module.exports = router;
