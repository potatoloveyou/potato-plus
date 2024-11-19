const Router = require('@koa/router');
// https://github.com/koajs/router
const router = new Router();

router.get('/goods/classify', async (ctx, next) => {
	try {
		ctx.body = {
			code: 0,
			data: [
				{
					id: 1,
					name: '家居家纺',
					data: [
						{
							name: '家纺',
							list: [
								{
									id: 1,
									name: '毛巾/浴巾',
									imgUrl: '/static/imgs/xxmLogo.png',
								},
								{
									id: 2,
									name: '枕头',
									imgUrl: '/static/imgs/xxmLogo.png',
								},
								{
									id: 3,
									name: '被子',
									imgUrl: '/static/imgs/xxmLogo.png',
								},
								{
									id: 4,
									name: '被套',
									imgUrl: '/static/imgs/xxmLogo.png',
								},
								{
									id: 5,
									name: '套件',
									imgUrl: '/static/imgs/xxmLogo.png',
								},
								{
									id: 6,
									name: '抱枕靠枕',
									imgUrl: '/static/imgs/xxmLogo.png',
								},
								// {
								// 	id: 7,
								// 	name: '凉席',
								// 	imgUrl: '/static/imgs/xxmLogo.png',
								// },
								// {
								// 	id: 8,
								// 	name: '床垫',
								// 	imgUrl: '/static/imgs/xxmLogo.png',
								// },
								// {
								// 	id: 9,
								// 	name: '毯子',
								// 	imgUrl: '/static/imgs/xxmLogo.png',
								// },
								// {
								// 	id: 10,
								// 	name: '坐垫',
								// 	imgUrl: '/static/imgs/xxmLogo.png',
								// },
								// {
								// 	id: 11,
								// 	name: '蚊帐',
								// 	imgUrl: '/static/imgs/xxmLogo.png',
								// },
							],
						},
						{
							name: '生活用品',
							list: [
								{
									id: 1,
									name: '浴室用品',
									imgUrl: '/static/imgs/xxmLogo.png',
								},
								{
									id: 2,
									name: '洗晒/熨烫',
									imgUrl: '/static/imgs/xxmLogo.png',
								},
								{
									id: 3,
									name: '净化除味',
									imgUrl: '/static/imgs/xxmLogo.png',
								},
							],
						},
						{
							name: '家具',
							list: [
								{
									id: 1,
									name: '沙发',
									imgUrl: '/static/imgs/xxmLogo.png',
								},
								{
									id: 2,
									name: '床',
									imgUrl: '/static/imgs/xxmLogo.png',
								},
								{
									id: 3,
									name: '餐桌',
									imgUrl: '/static/imgs/xxmLogo.png',
								},
								{
									id: 4,
									name: '椅子',
									imgUrl: '/static/imgs/xxmLogo.png',
								},
								{
									id: 5,
									name: '柜子',
									imgUrl: '/static/imgs/xxmLogo.png',
								},
								{
									id: 6,
									name: '书架',
									imgUrl: '/static/imgs/xxmLogo.png',
								},
							],
						},
						{
							name: '装饰品',
							list: [
								{
									id: 1,
									name: '装饰画',
									imgUrl: '/static/imgs/xxmLogo.png',
								},
								{
									id: 2,
									name: '镜子',
									imgUrl: '/static/imgs/xxmLogo.png',
								},
								{
									id: 3,
									name: '花瓶',
									imgUrl: '/static/imgs/xxmLogo.png',
								},
								{
									id: 4,
									name: '烛台',
									imgUrl: '/static/imgs/xxmLogo.png',
								},
								{
									id: 5,
									name: '地毯',
									imgUrl: '/static/imgs/xxmLogo.png',
								},
								{
									id: 6,
									name: '窗帘',
									imgUrl: '/static/imgs/xxmLogo.png',
								},
							],
						},
					],
				},

				{
					id: 2,
					name: '女装',
					data: [
						{
							name: '裙装/套装',
							list: [
								{
									id: 1,
									name: '半身裙',
									imgUrl: '/static/imgs/xxmLogo.png',
								},
								{
									id: 2,
									name: '连衣裙',
									imgUrl: '/static/imgs/xxmLogo.png',
								},
								{
									id: 3,
									name: '吊带/背带裤',
									imgUrl: '/static/imgs/xxmLogo.png',
								},
							],
						},
						{
							name: '上衣',
							list: [
								{
									id: 1,
									name: 'T恤/打底衫',
									imgUrl: '/static/imgs/xxmLogo.png',
								},
								{
									id: 2,
									name: '衬衫',
									imgUrl: '/static/imgs/xxmLogo.png',
								},
								{
									id: 3,
									name: '卫衣',
									imgUrl: '/static/imgs/xxmLogo.png',
								},
							],
						},
					],
				},

				{
					id: 3,
					name: '男装',
					data: [],
				},
				{
					id: 4,
					name: '内衣配饰',
					data: [],
				},
				{
					id: 5,
					name: '运动户外',
					data: [],
				},
				{
					id: 6,
					name: '鞋靴',
					data: [],
				},
				{
					id: 7,
					name: '箱包',
					data: [],
				},
				{
					id: 8,
					name: '箱包',
					data: [],
				},
				{
					id: 9,
					name: '食品酒饮',
					data: [],
				},
				{
					id: 10,
					name: '美妆个护',
					data: [],
				},
				{
					id: 11,
					name: '手机数码',
					data: [],
				},
				{
					id: 12,
					name: '母婴童装',
					data: [],
				},
				{
					id: 13,
					name: '饰品',
					data: [],
				},
				{
					id: 14,
					name: '数码家电',
					data: [],
				},
				{
					id: 15,
					name: '计生情趣',
					data: [],
				},
			],
		};
	} catch (error) {
		ctx.body = {
			code: 1,
			data: '请求失败',
		};
	}
});

module.exports = router;
