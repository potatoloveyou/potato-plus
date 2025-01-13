const Router = require('@koa/router');
const router = new Router();

// 中间件，解析post请求的参数
const bodyParser = require('koa-bodyparser');

// 引入订单模型
const Order = require('../model/order');

// 引入用户模型
const User = require('../model/user');

// 引入商品模型
const Goods = require('../model/goods');

// 引入购物车模型
const Cart = require('../model/cart');

// 引入jwt
const jwt = require('jsonwebtoken');

// 引入配置文件
const config = require('../config');

router.post('/add', async (ctx, next) => {
	// 获取token
	const token = ctx.request.headers.authorization;
	// 验证token
	jwt.verify(token, config.jwtSecret, async (err, decoded) => {
		if (err) {
			ctx.body = {
				code: 401,
				msg: 'token已过期',
			};
		} else {
			// 获取用户id
			const userId = decoded.id;
			// 获取订单信息
			const { goodsId, goodsNum, addressId } = ctx.request.body;
			// 查询用户信息
			const user = await User.findById(userId);
			// 查询商品信息
			const goods = await Goods.findById(goodsId);
			// 查询购物车信息
			const cart = await Cart.findOne({ userId, goodsId });
			// 创建订单
			const order = new Order({
				userId,
				goodsId,
				goodsNum,
				addressId,
				goodsName: goods.goodsName,
				goodsPrice: goods.goodsPrice,
				goodsImg: goods.goodsImg,
				goodsDesc: goods.goodsDesc,
				goodsColor: goods.goodsColor,
				goodsSize: goods.goodsSize,
				goodsCount: goods.goodsCount,
				goodsTotal: goods.goodsPrice * goodsNum,
				userName: user.userName,
				userPhone: user.userPhone,
				userAddress: user.userAddress,
				userPostcode: user.userPostcode,
				orderStatus: 0, // 0:未支付 1:已支付 2:已发货 3:已完成 4:已取消
			});
			// 保存订单
			await order.save();
			// 删除购物车
			await Cart.deleteOne({ userId, goodsId });
			ctx.body = {
				code: 200,
				msg: '订单创建成功',
			};
		}
	});
});
