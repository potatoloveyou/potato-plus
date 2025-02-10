import { setAccessToken, setRefreshToken, getAccessToken, getRefreshToken } from './token.js';
import { renovateToken, isRefreshToken } from '../api/apis.ts';

const base_url = 'http://192.168.39.11:9229';
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
const responseInterceptors: Array<(response: any, originalConfig: Config) => any> = [];

// 注册请求拦截器
export const addRequestInterceptor = (interceptor: (config: Config) => Config | Promise<Config>) => {
	requestInterceptors.push(interceptor);
};

// 注册响应拦截器;
export const addResponseInterceptor = (interceptor: (response: any, originalConfig: Config) => any | Promise<any>) => {
	responseInterceptors.push(interceptor);
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
		...config.header, // 确保用户自定义的头部信息不会被覆盖
		Authorization: `Bearer ${getAccessToken()}`, // 假设您需要在每个请求中包含授权令牌
	};
	return config;
});

// 默认响应拦截器：处理通用的响应情况
addResponseInterceptor(async (response, originalConfig) => {
	const { accessToken, refreshToken } = response.data.headers || {};

	if (response.statusCode === 200 && response.data.code === 5) {
		if (accessToken) {
			setAccessToken(`${accessToken}`);
		}
		if (refreshToken) {
			setRefreshToken(`${refreshToken}`);
		}
	}

	// 检查是否需要刷新 Token
	if (response.data.code === 51 && !isRefreshToken(originalConfig)) {
		try {
			const refreshRes = await renovateToken();
			if (refreshRes.code === 5) {
				// 更新请求头后重新发起原始请求
				const retryConfig = {
					...originalConfig,
					header: {
						...originalConfig.header,
						Authorization: `Bearer ${getAccessToken()}`, // 使用新 Token
					},
				};
				const retryResponse = await request(retryConfig);

				// return retryResponse; // 🟢 返回重试后的结果
				return { ...response, data: retryResponse }; // 确保返回完整结构
			}
		} catch (err) {
			console.error('刷新 Token 失败', err);
			throw err;
		}
	}
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

		if (!isRefreshToken(config)) {
			uni.showLoading({ title: '加载中' });
		}

		// 发送请求
		const rawResponse = await new Promise((resolve, reject) => {
			uni.request({
				...config,
				success: resolve,
				fail: reject,
				complete: () => uni.hideLoading(),
			});
		});

		// 初始化处理后的响应
		let processedResponse = rawResponse;
		// console.log('123', rawResponse);

		// 执行响应拦截器链式处理
		for (const interceptor of responseInterceptors) {
			processedResponse = await interceptor(processedResponse, initialConfig); // 🟢 关键：更新响应
			// console.log('for', processedResponse.data);
		}

		return processedResponse?.data;
	} catch (error) {
		// 全局错误处理
		console.error('Request error:', error);
		uni.showToast({ title: error.message, icon: 'none' });
		throw error;
	}
};
