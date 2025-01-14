const Router = require('@koa/router');
// import Router from '@koa/router'; // 引入 Router
// https://github.com/koajs/router
const router = new Router();

const { ObjectId, goods_search, top_bar } = require('../db/mongo.ts');

// 中间件，解析post请求的参数
const bodyParser = require('koa-bodyparser');

// 首页推荐
router.get('/index_list/data', async (ctx, next) => {
	try {
		const topBar = await top_bar.find().toArray();

		let query = {};
		const options = {
			skip: Number(0), // 从第 offset 条记录开始
			limit: Number(4), // 只取 limit 条记录
		};
		// 查找数据库
		const goodsSearch = await goods_search.find(query, options).toArray();

		ctx.body = {
			code: 0,
			data: {
				topBar: topBar,
				data: [
					{
						type: 'swiperList',
						data: [
							{
								imgUrl: '/static/imgs/banner1.jpg',
							},
							{
								imgUrl: '/static/imgs/banner2.jpg',
							},
							{
								imgUrl: '/static/imgs/banner3.jpg',
							},
						],
					},
					{
						type: 'recommendList',
						data: [
							{
								bigImgUrl: '/static/imgs/banner2.jpg',
								data: [
									{ imgUrl: '/static/imgs/xxmLogo.png' },
									{ imgUrl: '/static/imgs/xxmLogo.png' },
									{ imgUrl: '/static/imgs/xxmLogo.png' },
								],
							},
							{
								bigImgUrl: '/static/imgs/banner2.jpg',
								data: [
									{ imgUrl: '/static/imgs/xxmLogo.png' },
									{ imgUrl: '/static/imgs/xxmLogo.png' },
									{ imgUrl: '/static/imgs/xxmLogo.png' },
								],
							},
						],
					},
					{
						type: 'commodityList',
						data: goodsSearch,
					},
				],
			},
		};
	} catch (error) {}
});

module.exports = router;
