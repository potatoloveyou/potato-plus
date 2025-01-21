const Router = require('@koa/router');
const router = new Router();

const { ObjectId, user, refresh_tokens } = require('../../db/mongo.ts');

const bodyParser = require('koa-bodyparser');

const crypto = require('crypto');

const axios = require('axios');

// 生成 Token
const jwt = require('jsonwebtoken');

// 定义密钥 用于 HMAC 签名
const SECRET_KEY = 'potato-love-you-get-phone-number';

// 加密完整手机号
const SECRET_KEY_ENCRYPTION = 'potato-encryption-phone-number';

const ACCESS_TOKEN_EXPIRATION = '2d'; // Access Token 有效期	1天
const REFRESH_TOKEN_EXPIRATION = 30 * 24 * 60 * 60 * 1000; // Refresh Token 有效期（30天）

router.post('/user/getPhoneNumberLogin', bodyParser(), async (ctx) => {
	try {
		const { accessToken, openId, deviceInfo = 'Unknown Device' } = ctx.request.body;

		if (!accessToken || !openId) {
			ctx.body = { code: 400, message: '参数不完整' };
			return;
		}

		// Step 1: 获取手机号
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
		// 4.	获取完整手机号
		const fullPhoneNumber = response.data.data.phoneNumber;

		// Step 2: 加密手机号
		// 生成随机 iv
		const iv = crypto.randomBytes(16);
		const ENCRYPTION_KEY = crypto.createHash('sha256').update(SECRET_KEY_ENCRYPTION).digest(); // 生成固定长度密钥
		const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv); // 创建加密器
		const encryptedPhoneNumber = cipher.update(fullPhoneNumber, 'utf8', 'hex') + cipher.final('hex'); // 加密手机号

		// Step 3: 校验手机号是否已被使用
		const phoneConflict = await user.findOne({ phoneNumber: encryptedPhoneNumber, openId: { $ne: openId } });
		if (phoneConflict) {
			ctx.body = { code: 409, message: '手机号已被其他用户使用' };
			return;
		}

		// Step 4: 查找或更新用户信息
		let userRecord = await user.findOne({ openId });
		if (!userRecord) {
			// 如果用户不存在，则创建新用户
			userRecord = await user.insertOne({
				openId,
				phoneNumber: encryptedPhoneNumber,
				iv: iv.toString('hex'),
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

		// Step 5: 生成唯一的 Refresh Token
		let refreshToken;
		do {
			refreshToken = crypto.randomBytes(32).toString('hex');
		} while (await refresh_tokens.findOne({ token: refreshToken })); // 确保唯一性

		// Step 6: 保存 Refresh Token 到数据库
		const refreshExpiration = new Date(Date.now() + REFRESH_TOKEN_EXPIRATION);
		await refresh_tokens.insertOne({
			userId: userRecord._id,
			token: refreshToken,
			deviceInfo,
			expiration: refreshExpiration,
			createTime: new Date(),
			updateTime: new Date(),
		});

		// Step 7: 生成 Access Token
		const token = jwt.sign({ userId: userRecord._id, encryptedPhone: encryptedPhoneNumber }, SECRET_KEY_ENCRYPTION, {
			expiresIn: ACCESS_TOKEN_EXPIRATION,
		});

		// 返回 token 和 refreshToken
		ctx.body = {
			code: 0,
			message: '成功',
			data: {
				token,
				refreshToken,
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

// 如果需要提供 Token 注销功能（如用户主动退出登录），后端需要维护一个“黑名单”或“允许列表”来管理 Token。
// 存储方式：
// 黑名单：存储被吊销的 Token 标识符（如 jti 字段）。
// 允许列表：存储有效的 Token（通常用于短期有效的 Token）。
// 示例场景：
// 用户请求退出登录时，将 Token 标记为失效。
// 防止旧 Token 在有效期内被滥用。
// 支持 Token 刷新机制（Refresh Token）：

// 使用两种 Token：Access Token 和 Refresh Token。
// Access Token：短期有效，用于快速验证用户身份。
// Refresh Token：长期有效，后端存储，用于重新颁发 Access Token。
// 示例：
// 用户发送 Refresh Token 请求新的 Access Token。
// 后端查找存储的 Refresh Token，验证是否有效。
// 多设备登录或会话管理：

// 如果需要支持用户多设备登录，并能分别管理不同设备的会话，则需要存储每个设备对应的 Token。
// 安全审计：

// 某些场景需要记录 Token 的使用日志，例如登录时间、IP 地址等，以便进行审计或追踪。

// 这几种功能都能同时做吗，还是说有一些只能选一个另一个不可以
