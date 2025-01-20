const crypto = require('crypto');
exports.main = async (event, context) => {
	// event里包含着客户端提交的参数
	console.log('event:' + event);

	// context里包含系统环境变量的集合

	const SECRET_KEY = 'potato-love-you'; // 安全密钥
	const hmac = crypto.createHmac('sha256', SECRET_KEY);

	try {
		// 1. 获取请求参数
		const params = event.queryStringParameters;
		const sign = params.sign; // 客户端传递的签名
		delete params.sign; // 从参数中移除签名用于验证

		// 2. 按照字母顺序排序并生成签名字符串
		const signStr = Object.keys(params)
			.sort()
			.map((key) => `${key}=${params[key]}`)
			.join('&');

		// 3. 生成 HMAC-SHA256 签名
		hmac.update(signStr);
		const calculatedSign = hmac.digest('hex');

		// 4. 验证签名
		if (sign !== calculatedSign) {
			throw new Error('非法访问：签名不匹配');
		}

		// 5. 调用 uniCloud 获取手机号
		const { access_token, openid } = params;
		const res = await uniCloud.getPhoneNumber({
			provider: 'univerify',
			appid: '__UNI__1E20974', // 替换为你的 App ID
			access_token: access_token,
			openid: openid,
		});

		// 6. 返回手机号数据
		return { code: 0, message: '获取手机号成功', data: res };
	} catch (error) {
		console.error('云函数异常：', error);
		return { code: 500, message: '获取手机号失败', error: error.message };
	}
};
