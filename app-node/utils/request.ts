import { setAccessToken, setRefreshToken, getAccessToken, getRefreshToken } from './token.js';

const base_url = 'http://192.168.0.104:9229';
// const base_url = 'http://192.168.34.71:9229';

interface Config {
	url: string;
	data?: any;
	method?: 'GET' | 'OPTIONS' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT';
	header?: object;
}

// 请求拦截器数组
const requestInterceptors: Array<(config: Config) => Config | Promise<Config>> = [];
// 响应拦截器数组
const responseInterceptors: Array<(response: any) => any> = [];

// 注册响应拦截器;
export const addResponseInterceptor = (interceptor: (response: any) => any | Promise<any>) => {
	responseInterceptors.push(interceptor);
};
// 注册请求拦截器
export const addRequestInterceptor = (interceptor: (config: Config) => Config | Promise<Config>) => {
	requestInterceptors.push(interceptor);
};

// 默认请求拦截器：设置基础 URL 和默认头部信息
addRequestInterceptor((config) => {
	// 添加基础 URL
	config.url = `${base_url}${config.url}`;
	// 设置默认请求方法为 GET
	if (!config.method) {
		config.method = 'GET';
	}

	if (!config.header) {
		config.header = {};
	}
	config.header = {
		Authorization: `Bearer ${getAccessToken()}`, // 假设您需要在每个请求中包含授权令牌
		...config.header, // 确保用户自定义的头部信息不会被覆盖
	};
	return config;
});

// 默认响应拦截器：处理通用的响应情况
addResponseInterceptor(async (response) => {
	console.log(response);

	// if (response.statusCode === 401) {
	// 	// 如果是未授权状态码
	// 	// 处理 token 过期的情况（如果需要）
	// 	console.warn('Token may have expired');
	// 	// 可以在这里尝试刷新 token 或者重定向到登录页面
	// }

	// if (response.statusCode !== 200) {
	// 	throw new Error(`HTTP error: ${response.statusCode}`);
	// }

	return response;
});

export const request = async (initialConfig: Config) => {
	// 执行所有请求拦截器
	let config = { ...initialConfig }; // 深拷贝一份 initialConfig，以免直接修改原始对象

	try {
		// 执行所有请求拦截器，允许拦截器修改配置
		for (const interceptor of requestInterceptors) {
			config = await interceptor(config);
		}

		uni.showLoading({
			title: '加载中',
		});

		const response = await new Promise((resolve, reject) => {
			uni.request({
				...config,
				success: resolve,
				fail: reject,
				complete: () => uni.hideLoading(),
			});
		});

		// 执行所有响应拦截器
		for (const interceptor of responseInterceptors) {
			await interceptor(response);
		}

		// 根据业务逻辑进一步处理响应数据
		if (response.data.code === 0) {
			return response.data;
		} else {
			throw new Error(`Business error: ${response.data.code}`);
		}

		// return new Promise((resolve, reject) => {
		// 	uni.request({
		// 		...config,
		// 		// 请求成功的回调函数
		// 		success: (res: any) => {
		// 			// resolve(res);
		// 			if (res.statusCode !== 200) {
		// 				console.log('HTTP 状态码异常:', res.statusCode);
		// 				// reject(new Error(`HTTP error: ${res.statusCode}`));
		// 				return resolve(res.data);
		// 			}

		// 			if (res.data.code === 0) {
		// 				resolve(res.data);
		// 				return;
		// 			}

		// 			if (res.data.code !== 0) {
		// 				console.log('接口返回非正常 code:', res.data.code);
		// 				resolve(res.data);
		// 			}
		// 		},
		// 		// 请求失败的回调函数
		// 		fail: (error) => {
		// 			console.error('请求失败:', error);
		// 			reject(error); // 确保 fail 的情况下也触发 reject
		// 		},
		// 		// 请求完成时 隐藏 loading
		// 		complete: () => uni.hideLoading(),
		// 	});
		// });
	} catch (error) {
		console.error('Request failed:', error);
		throw error; // 确保失败的情况下也抛出异常
	}
};
