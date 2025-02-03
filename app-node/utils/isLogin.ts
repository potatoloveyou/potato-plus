import { getAccessToken, getRefreshToken } from './token';

// ````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````

/**
 * @description 自定义路由拦截
 */

//不需要登录的页面,白名单
let whiteList = [
	'/pages/index/index',
	'/pages/classify/classify',
	'/subPackages/login/appLogin/appLogin',
	'/subPackages/login/weixinLogin/weixinLogin',
];
// 定义登录页面
let loginPage = '';
// #ifdef MP-WEIXIN
loginPage = '/subPackages/login/weixinLogin/weixinLogin';
// #endif

// #ifdef APP
loginPage = '/subPackages/login/appLogin/appLogin';
// #endif

export default async function () {
	let list = ['navigateTo', 'redirectTo', 'reLaunch', 'switchTab'];
	list.forEach((item) => {
		//用遍历的方式分别为,uni.navigateTo,uni.redirectTo,uni.reLaunch,uni.switchTab这4个路由方法添加拦截器
		uni.addInterceptor(item, {
			invoke(e: { url: string }) {
				// 调用前拦截
				//获取用户的token
				const accessToken = getAccessToken();
				const refreshToken = getRefreshToken();

				//获取要跳转的页面路径（url去掉"?"和"?"后的参数）
				const url = e.url && e.url?.split('?')[0];

				// 如果在whiteList里面就不需要登录
				let notNeed = whiteList.includes(url);

				if (whiteList.includes(url)) return e; // 直接放行

				if (!accessToken || !refreshToken) {
					uni.showToast({ title: '您已掉线请重新登录', icon: 'none' });
					uni.navigateTo({ url: loginPage });
					return false; // 拦截
				}
				return e; // 直接放行
			},
			fail(err) {
				// 失败回调拦截
				console.log(err);
			},
		});
	});
}
