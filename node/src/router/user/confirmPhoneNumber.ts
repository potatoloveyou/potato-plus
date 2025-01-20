const Router = require('@koa/router');
const router = new Router();


const bodyParser = require('koa-bodyparser');

const crypto = require('crypto');


router.post('/user/confirmPhoneNumber', bodyParser(), async (ctx) => {
	try {
		const { encryptedPhoneNumber, tempKey, openId } = ctx.request.body;

		// 检查参数是否完整
		if (!encryptedPhoneNumber || !tempKey || !openId) {
			ctx.body = { code: 400, message: '参数不完整' };
			return;
		}

		// 解密手机号
		const SECRET_KEY_ENCRYPTION = 'potato-encryption-phone-number';
		// 从请求中获取 iv
		const iv = Buffer.from(ctx.request.body.iv, 'hex');
		// 生成固定长度密钥
		const ENCRYPTION_KEY = crypto.createHash('sha256').update(SECRET_KEY_ENCRYPTION).digest();
		let fullPhoneNumber;
		try {
			// 创建解密器
			// 'aes-256-cbc' 对称加密算法
			const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
			// 解密手机号
			fullPhoneNumber = decipher.update(encryptedPhoneNumber, 'hex', 'utf8') + decipher.final('utf8');
		} catch (error) {
			ctx.body = { code: 400, message: '手机号解密失败', error: error.message };
			return;
		}

		// 加密手机号并存储到数据库
		const cipher = crypto.createCipheriv('aes-256-cbc', SECRET_KEY_ENCRYPTION);
		const encryptedForDb = cipher.update(fullPhoneNumber, 'utf8', 'hex') + cipher.final('hex');

		// 查找用户记录
		let userRecord = await user.findOne({ openId });
		if (!userRecord) {
			// 如果用户不存在，则创建新用户
			userRecord = await user.insertOne({
				openId,
				phoneNumber: encryptedForDb,
				createTime: new Date(),
				updateTime: new Date(),
			});
		} else {
			// 如果用户已存在，则更新手机号
			await user.updateOne(
				{ _id: new ObjectId(userRecord._id) },
				{ $set: { phoneNumber: encryptedForDb, updateTime: new Date() } },
			);
		}

		// 生成 JWT 令牌
		const token = jwt.sign({ userId: userRecord._id, phoneNumber: fullPhoneNumber }, SECRET_KEY_ENCRYPTION, {
			expiresIn: '7d',
		});

		// 返回成功响应
		ctx.body = {
			code: 0,
			message: '登录成功',
			data: { token },
		};
	} catch (error) {
		console.error('确认手机号失败：', error);
		ctx.body = { code: 500, message: '服务器错误', error: error.message };
	}
});

module.exports = router;
