import { request } from '@/utils/request.ts';
import { getRefreshToken } from '@/utils/token.ts';

// 首页推荐数据
export const getIndexList = () => {
	return request({
		url: '/index_list/data',
	});
};

export const getIndexSwiperList = (data: any) => {
	let { index = 1, limit = 4, offset = 4, load = false } = data;
	return request({
		url: `/index_swiper_list/${index}/${offset}/${limit}?load=${load}`,
	});
};

const mapQueryParams = (params: any) => {
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
export const getGoodsSearch = (data) => {
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

// 获取各种bar
export const getVariousBar = () => {
	return request({
		url: `/variousBar`,
	});
};

// 获取用户地址列表
export const getUserAddress = (data: any) => {
	let { offset = 0, limit = 10 } = data;
	return request({
		url: `/address/get`,
		method: 'POST',
		data: {
			offset,
			limit,
		},
	});
};

// 添加用户地址
export const addUserAddress = (data: any) => {
	return request({
		url: `/address/add`,
		method: 'POST',
		data,
	});
};

// 删除用户地址
export const delUserAddress = (addressId: string) => {
	return request({
		url: `/address/delete/${addressId}`,
		method: 'DELETE',
	});
};

// 更新用户地址
export const updateUserAddress = (update: any) => {
	let { addressId, data } = update;
	return request({
		url: `/address/update/${addressId}`,
		method: 'PUT',
		data,
	});
};

// 获取购物车列表
export const getUserShoppingCart = () => {
	return request({
		url: `/shoppingCart/get`,
	});
};

// 添加购物车
export const addUserShoppingCart = (data: object) => {
	return request({
		url: `/shoppingCart/add`,
		method: 'POST',
		data,
	});
};

// 删除购物车某个商品
export const delUserShoppingCart = (data: object) => {
	return request({
		url: `/shoppingCart/delete`,
		method: 'DELETE',
		data,
	});
};

// 更新购物车某个商品
export const updateUserShoppingCart = (data: object) => {
	return request({
		url: `/shoppingCart/update`,
		method: 'PUT',
		data,
	});
};

// app用户手机号登录或注册
export const appLogin = (data: object) => {
	return request({
		url: `/user/app_login`,
		method: 'POST',
		data,
	});
};

// 微信小程序获取邮箱验证码
export const getWeixinEmailVerify = (data: string) => {
	return request({
		url: `/sendingVerify`,
		method: 'POST',
		data,
	});
};

// 微信小程序用户手机号和邮箱登录或注册
export const weixinLogin = (data: object) => {
	return request({
		url: `/user/weixin_login`,
		method: 'POST',
		data,
	});
};

// 刷新token
export const renovateToken = () => {
	return request({
		url: `/user/refreshToken`,
		method: 'POST',
		header: {
			refreshtoken: `Beader ${getRefreshToken()}`,
		},
		__isRefreshToken: true,
	});
};
export const isRefreshToken = (originalConfig) => {
	return !!originalConfig?.__isRefreshToken;
};

// 退出登录
export const appUserLogOut = () => {
	return request({
		url: `/user/logout`,
		method: 'POST',
	});
};

// 添加订单
export const addUserOrder = (data: object) => {
	return request({
		url: `/order/add`,
		method: 'POST',
		data,
	});
};
