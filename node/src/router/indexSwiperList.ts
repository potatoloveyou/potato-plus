const Router = require('@koa/router');
// https://github.com/koajs/router
const router = new Router();

const { ObjectId, goods_search, index_swiper_imgs } = require('../db/mongo.ts');

// 首页滑块列表
router.get('/index_swiper_list/:index/:offset/:limit', async (ctx, next) => {
	try {
		let { index, offset, limit } = ctx.request.params; // 获取路径参数
		let { load } = ctx.request.query; // 获取查询参数

		if (!index || !offset || !limit || !load) {
			ctx.body = {
				code: 1,
				msg: '参数错误',
			};
		}
		// 滑块第一次加载load是false
		if (load == 'false') {
			const swiperImgs = await index_swiper_imgs
				.find({
					id: Number(index),
				})
				.toArray();

			// 查找数据库
			const goodsSearch = await goods_search
				.find(
					{},
					{
						skip: Number(offset), // 从第 offset 条记录开始
						limit: Number(limit), // 只取 limit 条记录
					},
				)
				.toArray();

			ctx.body = {
				code: 0,
				data: {
					data: [
						{
							type: 'swiperList',
							data: swiperImgs,
						},
						{
							type: 'commodityList',
							data: goodsSearch,
						},
					],
				},
			};
			return;
		}
		// 查找数据库
		const goodsSearch = await goods_search
			.find(
				{},
				{
					skip: Number(offset), // 从第 offset 条记录开始
					limit: Number(limit), // 只取 limit 条记录
				},
			)
			.toArray();
		ctx.body = {
			code: 0,
			data: [
				{
					type: 'commodityList',
					data: goodsSearch,
				},
			],
		};
	} catch (error) {}
});

module.exports = router;
