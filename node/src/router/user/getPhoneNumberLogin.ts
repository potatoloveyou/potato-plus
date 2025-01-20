const Router = require('@koa/router');
const router = new Router();

const { ObjectId, user } = require('../../db/mongo.ts');

const bodyParser = require('koa-bodyparser');

const crypto = require('crypto');

const axios = require('axios');

// 生成 Token
const jwt = require('jsonwebtoken');

router.post('/user/getPhoneNumberLogin', bodyParser(), async (ctx) => {
	try {
		const { accessToken, openId } = ctx.request.body;

		if (!accessToken || !openId) {
			ctx.body = { code: 400, message: '参数不完整' };
			return;
		}

		// 定义密钥 用于 HMAC 签名
		const SECRET_KEY = 'potato-love-you-get-phone-number';

		// 1. 参数排序并拼接签名字符串
		const params = { access_token: accessToken, openid: openId };
		const signStr = Object.keys(params)
			.sort()
			.map((key) => `${key}=${params[key]}`)
			.join('&');

		// 2. 生成 HMAC-SHA256 签名
		const sign = crypto.createHmac('sha256', SECRET_KEY).update(signStr).digest('hex');

		// 3. 请求云函数
		const cloudUrl = `https://fc-mp-8f95879a-f871-43cc-961f-fa7c3730cf1d.next.bspapp.com/user/getPhoneNumber`;
		const response = await axios.get(cloudUrl, {
			params: { ...params, sign },
		});

		// 判断云函数返回结果
		if (response.data.code !== 0 || !response.data.data.phoneNumber) {
			ctx.body = { code: 500, message: '云函数调用失败', error: response.data.message || '手机号获取失败' };
			return;
		}

		// 获取完整手机号
		const fullPhoneNumber = response.data.data.phoneNumber;

		// 生成随机 iv
		const iv = crypto.randomBytes(16);
		// 加密完整手机号
		const SECRET_KEY_ENCRYPTION = 'potato-encryption-phone-number';
		// 生成固定长度密钥
		const ENCRYPTION_KEY = crypto.createHash('sha256').update(SECRET_KEY_ENCRYPTION).digest();
		const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);

		const encryptedPhoneNumber = cipher.update(fullPhoneNumber, 'utf8', 'hex') + cipher.final('hex');

		// 查找用户记录
		let userRecord = await user.findOne({ openId });
		if (!userRecord) {
			// 如果用户不存在，则创建新用户
			userRecord = await user.insertOne({
				openId,
				phoneNumber: encryptedPhoneNumber,
				iv: iv.toString('hex'), // 存储加密用的 IV
				createTime: new Date(),
				updateTime: new Date(),
			});
		} else {
			// 如果用户已存在，则更新手机号
			await user.updateOne(
				{ _id: new ObjectId(userRecord._id) },
				{
					$set: {
						phoneNumber: encryptedPhoneNumber,
						iv: iv.toString('hex'),
						updateTime: new Date(),
					},
				},
			);
		}

		// 生成 JWT 令牌
		const token = jwt.sign({ userId: userRecord._id, encryptedPhone: encryptedPhoneNumber }, SECRET_KEY_ENCRYPTION, {
			expiresIn: '7d',
		});

		// 返回 token
		ctx.body = {
			code: 0,
			message: '成功',
			data: {
				token,
			},
		};
	} catch (error) {
		console.error('获取手机号失败：', error);
		ctx.body = { code: 500, message: '服务器错误', error: error.message };
	}
});

module.exports = router;
