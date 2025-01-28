const jwt = require('jsonwebtoken');

const SECRET_KEY_TOKEN = 'potato-love-you-token';

const verifyAccessToken = async (ctx, next) => {
	try {
		// console.log('验证 Access Token');

		// 从请求头获取 Token
		const access_token = ctx.headers.authorization?.split(' ')[1]; // Bearer <token>
		// console.log(access_token);

		// 检查 access_token 是否存在
		if (!access_token) {
			ctx.status = 401; // 设置响应状态码为 401 未授权
			ctx.body = { code: 51, message: '未提供 access_token' }; // 设置响应体，返回错误信息
			return; // 结束函数执行
		}

		// 验证 Access Token
		const decoded = jwt.verify(access_token, SECRET_KEY_TOKEN);
		ctx.state.user = decoded; // 将解码后的信息存储到上下文
		await next();
		return;
	} catch (error) {
		if (error.name === 'TokenExpiredError') {
			// ctx.status = 401;
			ctx.body = { code: 51, message: 'Access Token 已过期' };
		} else {
			ctx.status = 401;
			ctx.body = { code: 401, message: '无效的 access_token' };
		}
	}
};

module.exports = verifyAccessToken;
