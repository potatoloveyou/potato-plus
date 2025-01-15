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

// 中间件，解析post请求的参数
const bodyParser = require('koa-bodyparser');

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
const indexClassify = require('./router/indexClassify.ts');
router.use(indexClassify.routes());

// 商品搜索
const goodsSearch = require('./router/goodsSearch.ts');
router.use(goodsSearch.routes());

// 商品分类
const goodsList = require('./router/goodsList.ts');
router.use(goodsList.routes());

// 商品详情
const goodsDetail = require('./router/goodsDetail.ts');
router.use(goodsDetail.routes());

// 订单导航栏
const orderBar = require('./router/orderBar.ts');
router.use(orderBar.routes());

// 获取用户收货地址
const getUserAddress = require('./router/address/getUserAddress.ts');
router.use(getUserAddress.routes());

// 添加地址
const addAddress = require('./router/address/addUserAddress.ts');
router.use(addAddress.routes());

// 删除用户收货地址
const deleteUserAddress = require('./router/address/deleteUserAddress.ts');
router.use(deleteUserAddress.routes());

// 修改用户收货地址
const updateUserAddress = require('./router/address/updateUserAddress.ts');
router.use(updateUserAddress.routes());

app.use(router.routes());
app.listen(9229);
