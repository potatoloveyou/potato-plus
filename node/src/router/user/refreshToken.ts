const Router = require('@koa/router');
const router = new Router();

const bodyParser = require('koa-bodyparser');

const jwt = require('jsonwebtoken');
const { ObjectId, refresh_tokens } = require('../../db/mongo.ts');

// const { refresh_tokens_deleteOne } = require('../../services/refresh_tokens/refresh_tokens.ts');

// // 刷新阈值（例如剩余7天时刷新 Refresh Token）
const REFRESH_THRESHOLD = 7 * 24 * 60 * 60 * 1000;

// token加密密钥
const SECRET_KEY_TOKEN = 'potato-love-you-token';

const REFRESH_TOKEN_EXPIRATION = 30 * 24 * 60 * 60 * 1000; // Refresh Token 有效期（30天）

router.post('/user/refreshToken', bodyParser(), async (ctx) => {
	const { refreshToken } = ctx.request.body;
	if (!refreshToken) {
		ctx.status = 400;
		ctx.body = { code: 400, message: '未提供 Refresh Token' };
		return;
	}
	// ctx.body = { refreshToken };

	try {
		// 验证 Refresh Token
		const decoded = jwt.verify(refreshToken, SECRET_KEY_TOKEN);

		const refreshTokenRecord = await refresh_tokens.findOne({
			userId: new ObjectId(decoded.userId),
			openId: decoded.openId,
			refreshToken,
			expiresIn: { $gte: new Date() },
		});

		ctx.body = {
			decoded,
			// refreshTokenRecord,
		};

		// 如果 Refresh Token 不存在或已过期，则返回 401 错误
		if (!refreshTokenRecord) {
			// // 删除旧的 Refresh Token
			await refresh_tokens.deleteOne({
				userId: decoded.userId,
				openId: decoded.openId,
				refreshToken,
			});
			ctx.status = 401;
			ctx.body = { code: 401, message: '无效的 Refresh Token' };
			return;
		}

		// 生成新的 Access Token 和 Refresh Token
		const newAccessToken = jwt.sign(
			{
				userId: decoded.userId,
				openId: decoded.openId,
				encryptedPhone: decoded.encryptedPhone,
			},
			SECRET_KEY_TOKEN,
			{ expiresIn: '1m' },
		);

		// // 判断是否需要更新 Refresh Token
		if (refreshTokenRecord.expiresIn.getTime() < Date.now() + REFRESH_THRESHOLD) {
			// 生成新的 Refresh Token
			const newRefreshToken = jwt.sign(
				{
					userId: decoded.userId,
					openId: decoded.openId,
					encryptedPhone: decoded.encryptedPhone,
				},
				SECRET_KEY_TOKEN,
				{ expiresIn: '30d' },
			);

			await refresh_tokens.updateOne(
				{
					userId: decoded.userId,
					openId: decoded.openid,
					refreshToken,
				},
				{
					$set: {
						userId: decoded.userId,
						openId: decoded.openid,
						refreshToken: newRefreshToken,
						lastLogin: new Date(),
						expiresIn: new Date(Date.now() + REFRESH_TOKEN_EXPIRATION),
					},
				},
				{ upsert: true },
			);

			// 更新返回值
			ctx.body = {
				code: 5,
				message: '成功刷新 Token，返回accessToken和refreshToken',
				headers: {
					accessToken: newAccessToken,
					refreshToken: newRefreshToken, // 返回新生成的 Refresh Token
				},
			};
			return;
		}

		// 如果 Refresh Token 没有过期，则直接返回新的 Access Token
		ctx.body = {
			code: 5,
			message: '成功刷新 Token，返回accessToken',
			headers: {
				accessToken: newAccessToken,
			},
		};
	} catch (error) {
		ctx.status = 401;
		ctx.body = {
			code: 401,
			message: error.name === 'TokenExpiredError' ? 'Refresh Token 已过期，请重新登录' : '无效的 Refresh Token',
		};
	}
});

module.exports = router;
