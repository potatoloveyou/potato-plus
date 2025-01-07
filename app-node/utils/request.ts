// const base_url = 'http://localhost:9229';
const base_url = 'http://192.168.190.71:9229';

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
				if (res.statusCode != 200) {
					return reject();
				}
				if (res.data.code === 0) {
					resolve(res.data);
				}
			},
			// 请求失败的回调函数
			fail: (error) => {
				console.log(error);
			},
			// 请求完成
			complete: () => {
				setTimeout(function () {
					uni.hideLoading();
				}, 200);
			},
		});
	});
};
