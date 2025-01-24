const jwt = require('jsonwebtoken');

const { refresh_tokens } = require('../../db/mongo.ts');

const SECRET_KEY_ENCRYPTION = 'potato-encryption-phone-number';

const verifyAccessToken  = async (ctx, next) => {
	try {
		// 从请求头获取 Token
		const token = ctx.headers.authorization?.split(' ')[1]; // Bearer <token>
		// 检查 Token 是否存在
		if (!token) {
			ctx.status = 401; // 设置响应状态码为 401 未授权
			ctx.body = { code: 401, message: '未提供 Token' }; // 设置响应体，返回错误信息
			return; // 结束函数执行
		}

		// 验证 Access Token
		let decoded;
		try {
			decoded = jwt.verify(token, SECRET_KEY_ENCRYPTION);
			ctx.state.user = decoded; // 将解码后的信息存储到上下文
			await next();
			return;
		} catch (error) {
			// 如果是 Token 过期错误，尝试使用 Refresh Token
			if (error.name === 'TokenExpiredError') {
				const refreshToken = ctx.request.body?.refreshToken;
				if (!refreshToken) {
					ctx.status = 401;
					ctx.body = { code: 401, message: 'Access Token 已过期，且未提供 Refresh Token' };
					return;
				}

				// 验证 Refresh Token 的有效性
				const refreshTokenRecord = await refresh_tokens.findOne({ refreshToken });
				if (!refreshTokenRecord || refreshTokenRecord.expiration < new Date()) {
					ctx.status = 401;
					ctx.body = { code: 401, message: 'Refresh Token 无效或已过期' };
					return;
				}

				// 生成新的 Access Token
				const newAccessToken = jwt.sign(
					{ userId: refreshTokenRecord.userId, encryptedPhone: refreshTokenRecord.phoneNumber },
					SECRET_KEY_ENCRYPTION,
					{ expiresIn: '2d' },
				);

				// 返回新 Token
				ctx.body = {
					code: 0,
					message: 'Token 已刷新',
					data: {
						token: newAccessToken,
					},
				};
				return;
			}

			// 其他验证错误
			ctx.status = 401;
			ctx.body = { code: 401, message: '无效的 Token' };
			return;
		}
	} catch (error) {
		console.error('Token 验证失败:', error.message);
		ctx.status = 500;
		ctx.body = { code: 500, message: '服务器错误', error: error.message };
	}
};

module.exports = verifyAccessToken;
