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
	let { index = 1, limit = 4, offset = 4 } = data;
	return request({
		url: `/index_list/data/${index}/${offset}/${limit}`,
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

// 订单导航栏
export const getMyOrderBar = () => {
	return request({
		url: `/orderBar`,
	});
};

// 获取用户地址列表
export const getUserAddress = (data: { userId: any; offset?: number | undefined; limit?: number | undefined }) => {
	let { userId, offset = 0, limit = 10 } = data;
	return request({
		url: `/address/get`,
		method: 'POST',
		data: {
			userId,
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
export const getUserShoppingCart = (userId: string) => {
	return request({
		url: `/shoppingCart/get/${userId}`,
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

// 退出登录
export const appUserLogOut = () => {
	return request({
		url: `/user/logout`,
		method: 'POST',
	});
};

// 测试token
export const testToken = () => {
	return request({
		url: `/testToken`,
	});
};
