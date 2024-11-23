const Router = require('@koa/router');
// https://github.com/koajs/router
const router = new Router();

// 中间件，解析post请求的参数
const bodyParser = require('koa-bodyparser');

// 首页推荐
router.get('/index_list/data', async (ctx, next) => {
	try {
		ctx.body = {
			code: 0,

			data: {
				topBar: [
					{ id: 1, name: '推荐' },
					{ id: 2, name: '运动户外' },
					{ id: 3, name: '服饰内衣' },
					{ id: 4, name: '鞋靴箱包' },
					{ id: 5, name: '美妆个护' },
					{ id: 6, name: '家具数码' },
					{ id: 7, name: '食品母婴' },
				],
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
						data: [
							{
								id: 1,
								imgUrl: '/static/imgs/classify1.jpg',
								name: '阿德杀杀毒哈师大哈拉少等哈拉萨大叔大撒打算手打阿是、婶',
								pprice: '299',
								oprice: '699',
								discount: '5.2',
							},
							{
								id: 2,
								imgUrl: '/static/imgs/classify1.jpg',
								name: '阿德杀杀毒哈师大哈拉少等哈拉萨大叔大撒打算手打阿是、婶',
								pprice: '399',
								oprice: '699',
								discount: '5.2',
							},
							{
								id: 3,
								imgUrl: '/static/imgs/classify1.jpg',
								name: '阿德杀杀毒哈师大哈拉少等哈拉萨大叔大撒打算手打阿是、婶',
								pprice: '499',
								oprice: '699',
								discount: '5.2',
							},
							{
								id: 4,
								imgUrl: '/static/imgs/classify1.jpg',
								name: '阿德杀杀毒哈师大哈拉少等哈拉萨大叔大撒打算手打阿是、婶',
								pprice: '499',
								oprice: '699',
								discount: '5.2',
							},
						],
					},
				],
			},
		};
	} catch (error) {}
});

module.exports = router;
