import { request } from '@/utils/request.ts';

// 首页推荐数据
export const getIndexList = () => {
	return request({
		url: '/index_list/data',
	});
};

// 首页分类
interface IndexData {
	index: number | string;
	limit: number | string;
	offset: number | string;
}
export const getIndexClassify = (data: IndexData) => {
	let { index = 1, limit = 10, offset = 0 } = data;
	return request({
		url: `/index_list/data/${index}/${offset}/${limit}`,
	});
};

const mapQueryParams = (params) => {
	const { keyword, ...rest } = params;
	return {
		name: keyword, // 映射为 name
		...rest, // 其他参数保持不变
	};
};

// 商品搜索
interface ShopData {
	keyword: string;
	limit: number;
	offset: number;
	pprice: number;
	discount: number;
}
export const getGoodsSearch = (data: ShopData) => {
	// console.log(data);
	return request({
		url: `/goods/search`,
		data: mapQueryParams(data),
	});
};

// 商品分类
export const getGoodsClassify = () => {
	return request({
		url: `/goods/classify`,
	});
};

// 商品详情
export const getGoodsDetail = (data: string) => {
	// console.log(data);
	return request({
		url: `/goods/detail`,
		data: {
			id: data,
		},
	});
};
