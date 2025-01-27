const Router = require('@koa/router');
const router = new Router();

const { verify } = require('../../db/mongo.ts');

bodyParser = require('koa-bodyparser');

const nodemailer = require('nodemailer');

const generateRandomCode = (length = 4) => {
	// 生成指定长度的随机数字字符串
	return Math.random().toString().substr(2, length);
};

// 发送验证码
router.post('/sendingVerify', bodyParser(), async (ctx, next) => {
	try {
		const { phone, email } = ctx.request.body;

		if (!email) {
			ctx.status = 400;
			ctx.body = {
				code: 400,
				msg: '缺少邮箱',
			};
			return;
		}

		// 生成4位随机验证码
		const verificationCode = generateRandomCode(6);

		const transporter = nodemailer.createTransport({
			host: 'smtp.qq.com',
			port: 587,
			// true for port 465, false for other ports
			secure: false,
			// 发送者邮箱
			auth: {
				user: '2444265157@qq.com',
				pass: 'kqfrheocybqgdiii',
			},
		});
		const main = async () => {
			const info = await transporter.sendMail({
				from: '<2444265157@qq.com>',
				to: `${email}`,
				// 标题
				subject: '欢迎来到土豆商场',
				html: `<b>土豆商场邮箱验证码:${verificationCode}</b>`,
			});
			// console.log(info);
		};

		// 将验证码保存到数据库中
		await verify.insertOne({
			email,
			verificationCode,
			// 验证码有效时间为1分钟
			expiration: Date.now() + 60 * 1000,
		});

		// 邮箱发送错误
		main().catch(console.error);

		ctx.body = {
			code: 0,
			msg: '发送成功',
			// data: verificationCode,
		};
	} catch (error) {
		ctx.body = {
			code: 500,
			msg: '发送失败',
			data: error,
		};
	}
});
module.exports = router;
