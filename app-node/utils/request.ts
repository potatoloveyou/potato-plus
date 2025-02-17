const base_url = 'http://192.168.39.7:9229';

interface Config {
	url: string;
	data?: any;
	method?: 'GET' | 'OPTIONS' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT';
	header?: object;
}

export const request = (config: Config) => {
	let { url, data = {}, method = 'GET', header = {} } = config;
	url = `${base_url}${url}`;
	// header['content-type'] = 'application/json';
	// header['content-type'] = 'application/x-www-form-urlencoded';
	uni.showLoading({
		title: '加载中',
	});
	return new Promise((resolve, reject) => {
		uni.request({
			url,
			data,
			method,
			header,
			// 请求成功的回调函数
			success: (res: any) => {
				if (res.statusCode !== 200) {
					console.log('HTTP 状态码异常:', res.statusCode);
					return reject(new Error(`HTTP error: ${res.statusCode}`));
				}

				if (res.data.code === 0) {
					resolve(res.data);
				} else {
					console.log('接口返回非正常 code:', res.data.code);
					reject(new Error(`API error: code ${res.data.code}`));
				}
			},
			// 请求失败的回调函数
			fail: (error) => {
				console.error('请求失败:', error);
				reject(error); // 确保 fail 的情况下也触发 reject
			},
			// 请求完成
			complete: () => {
				uni.hideLoading(); // 确保每次请求完成时都隐藏 loading
			},
		});
	});
};
