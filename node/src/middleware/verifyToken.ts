const jwt = require('jsonwebtoken');

const SECRET_KEY_ENCRYPTION = 'potato-encryption-phone-number';

const verifyToken = async (ctx, next) => {
	try {
		// 从请求头获取 Token
		const token = ctx.headers.authorization?.split(' ')[1]; // Bearer <token>
		// 检查 Token 是否存在
		if (!token) {
			ctx.status = 401; // 设置响应状态码为 401 未授权
			ctx.body = { code: 401, message: '未提供 Token' }; // 设置响应体，返回错误信息
			return; // 结束函数执行
		}

		// 验证 Token 并解析
		const decoded = jwt.verify(token, SECRET_KEY_ENCRYPTION);

		// 将解码后的信息存入上下文
		ctx.state.user = decoded; // 例如: { userId: '...', phoneNumber: '...', iat: ..., exp: ... }

		// 继续处理请求
		await next(); // 调用下一个中间件
	} catch (error) {
		console.error('Token 验证失败:', error.message); // 打印错误信息到控制台
		ctx.status = 401; // 设置响应状态码为 401 未授权
		ctx.body = { code: 401, message: '无效的 Token 或 Token 已过期' }; // 设置响应体，返回错误信息
	}
};

module.exports = verifyToken;
