// supervisor --inspect index.ts
// ts-node index.ts

const Koa = require('koa');
// https://www.koajs.com.cn/
const app = new Koa();

const cors = require('@koa/cors'); // 引入 CORS 中间件
app.use(
	cors({
		// origin: 'http://localhost:5173', // 设置允许的前端源
		origin: '*',
		allowMethods: ['GET', 'POST', 'PUT', 'DELETE'], // 允许的 HTTP 方法
		allowHeaders: ['Content-Type', 'Authorization'], // 允许的请求头
	}),
);

const Router = require('@koa/router');
// https://github.com/koajs/router
const router = new Router();

// router.get('/', (ctx, next) => {
// 	ctx.body = 'get 方式123';
// });

// 引入路由 使用路由
// 首页推荐
const indexList = require('./router/indexList.ts');
router.use(indexList.routes());

// 首页分类多页
const indexSwiperList = require('./router/indexSwiperList.ts');
router.use(indexSwiperList.routes());

// 商品搜索
const goodsSearch = require('./router/goodsSearch.ts');
router.use(goodsSearch.routes());

// 商品分类
const goodsList = require('./router/goodsList.ts');
router.use(goodsList.routes());

// 商品详情
const goodsDetail = require('./router/goodsDetail.ts');
router.use(goodsDetail.routes());

// 各种导航栏
const variousBar = require('./router/variousBar.ts');
router.use(variousBar.routes());

// 获取用户收货地址
const getUserAddress = require('./router/address/getUserAddress.ts');
router.use(getUserAddress.routes());

// 添加地址
const addUserAddress = require('./router/address/addUserAddress.ts');
router.use(addUserAddress.routes());

// 删除用户收货地址
const deleteUserAddress = require('./router/address/deleteUserAddress.ts');
router.use(deleteUserAddress.routes());

// 修改用户收货地址
const updateUserAddress = require('./router/address/updateUserAddress.ts');
router.use(updateUserAddress.routes());

// 添加商品到购物车
const addUserShoppingCart = require('./router/shoppingCart/addUserShoppingCart.ts');
router.use(addUserShoppingCart.routes());

// 获取用户购物车
const getUserShoppingCart = require('./router/shoppingCart/getUserShoppingCart.ts');
router.use(getUserShoppingCart.routes());

// 删除用户购物车商品
const deleteUserShoppingCart = require('./router/shoppingCart/deleteUserShoppingCart.ts');
router.use(deleteUserShoppingCart.routes());

// 修改用户购物车商品
const updateUserShoppingCart = require('./router/shoppingCart/updateUserShoppingCart.ts');
router.use(updateUserShoppingCart.routes());

// 获取app用户手机号并登录
const app_login = require('./router/user/app_login.ts');
router.use(app_login.routes());

// 微信小程序获取邮箱验证码
const sendingVerify = require('./router/user/sendingVerify.ts');
router.use(sendingVerify.routes());

// 微信小程序获取用户手机号并注册
const weixin_login = require('./router/user/weixin_login.ts');
router.use(weixin_login.routes());

// 刷新token
const refreshToken = require('./router/user/refreshToken.ts');
router.use(refreshToken.routes());

// 添加用户订单
const addUserOrder = require('./router/order/addUserOrder.ts');
router.use(addUserOrder.routes());

// 获取用户订单
const getUserOrder = require('./router/order/getUserOrder.ts');
router.use(getUserOrder.routes());

// 获取指定用户订单
const getAppointOrder = require('./router/order/getAppointOrder.ts');
router.use(getAppointOrder.routes());

app.use(router.routes());
app.listen(9229);
