<template>
	<view class="appLogin">
		<button @click="login">授权登录</button>
		<button @click="getToken">获取token</button>
	</view>
</template>

<script setup>
	import { appLogin, appUserLogOut } from '@/api/apis.ts';

	import { getAccessToken, getRefreshToken } from '@/utils/token.ts';

	const login = async () => {
		uni.login({
			provider: 'univerify',
			univerifyStyle: {
				// 自定义登录框样式
				//参考`univerifyStyle 数据结构`
				fullScreen: false, // 是否全屏显示，默认值： false
				title: '快速登录',
				backgroundColor: '#ffffff', // 授权页面背景颜色，默认值：#ffffff
				icon: {
					path: '../../static/my/头像.png', // 自定义显示在授权框中的logo，仅支持本地图片 默认显示App logo
				},
				phoneNum: {
					color: '#000000', // 手机号文字颜色 默认值：#000000
					fontSize: '18', // 手机号字体大小 默认值：18
				},
				slogan: {
					color: '#8a8b90', //  slogan 字体颜色 默认值：#8a8b90
					fontSize: '12', // slogan 字体大小 默认值：12
				},
				// 一键登录
				authButton: {
					normalColor: '#3479f5', // 授权按钮正常状态背景颜色 默认值：#3479f5
					highlightColor: '#2861c5', // 授权按钮按下状态背景颜色 默认值：#2861c5（仅ios支持）
					disabledColor: '#73aaf5', // 授权按钮不可点击时背景颜色 默认值：#73aaf5（仅ios支持）
					textColor: '#ffffff', // 授权按钮文字颜色 默认值：#ffffff
					title: '本机号码一键登录', // 授权按钮文案 默认值：“本机号码一键登录”
				},
				// 其他登录方式
				otherLoginButton: {
					visible: 'true', // 是否显示其他登录按钮，默认值：true
					normalColor: '#f8f8f8', // 其他登录按钮正常状态背景颜色 默认值：#f8f8f8
					highlightColor: '#dedede', // 其他登录按钮按下状态背景颜色 默认值：#dedede
					textColor: '#000000', // 其他登录按钮文字颜色 默认值：#000000
					title: '密码登录', // 其他登录方式按钮文字 默认值：“其他登录方式”
					borderWidth: '1px', // 边框宽度 默认值：1px（仅ios支持）
					borderColor: '#c5c5c5', //边框颜色 默认值： #c5c5c5（仅ios支持）
				},
				// 自定义按钮登录方式
				buttons: {
					// 仅全屏模式生效，配置页面下方按钮  （3.1.14+ 版本支持）
					iconWidth: '45px', // 图标宽度（高度等比例缩放） 默认值：45px
					list: [
						{
							provider: 'apple',
							iconPath: '/static/test.jpg', // 图标路径仅支持本地图片
						},
						{
							provider: 'weixin',
							iconPath: '/static/test.jpg',
						},
					],
				},
				privacyTerms: {
					defaultCheckBoxState: 'true', // 条款勾选框初始状态 默认值： true
					textColor: '#8a8b90', // 文字颜色 默认值：#8a8b90
					termsColor: '#1d4788', //  协议文字颜色 默认值： #1d4788
					prefix: '我已阅读并同意', // 条款前的文案 默认值：“我已阅读并同意”
					suffix: '并使用本机号码登录', // 条款后的文案 默认值：“并使用本机号码登录”
					fontSize: '12', // 字体大小 默认值：12,
					privacyItems: [
						// 自定义协议条款，最大支持2个，需要同时设置url和title. 否则不生效
						{
							url: 'https://', // 点击跳转的协议详情页面
							title: '用户服务协议', // 协议名称
						},
					],
				},
			},
			success(loginRes) {
				// 登录成功，获取 openId 和 accessToken
				const { access_token, openid } = loginRes.authResult;

				uni.getSystemInfo({
					async success(res) {
						const { deviceBrand, deviceModel, osVersion } = res;
						const data = {
							accessToken: access_token,
							openId: openid,
							deviceInfo: {
								// 设备品牌类型
								deviceName: `${deviceBrand} ${deviceModel}`,
								// 操作系统版本
								osVersion,
								// 登录方式
								provider: `APP-univerify`,
							},
						};
						// console.log(data);

						// 发送到后端;
						const response = await appLogin(data);
						console.log('服务器返回的结果：', response);

						if (response.code !== 5) {
							console.log('有错，登录不了', response);
							return;
						}

						// 关闭一键登录授权界面
						uni.closeAuthView();

						uni.showToast({
							title: '登录成功',
							icon: 'none',
						});

						uni.switchTab({
							url: '/pages/tabBar/index/index',
						});
					},
				});
			},
			// 当用户点击自定义按钮时，会触发uni.login的fail回调[点击其他登录方式，可以跳转页面，或执行事件]
			fail(err) {
				// 登录失败提示
				uni.showToast({
					title: '登录失败，请重试',
					icon: 'none',
				});
				console.error('登录失败：', err);
			},
		});
	};

	const getToken = () => {
		console.log('getAccessToken', getAccessToken());
		console.log('getRefreshToken', getRefreshToken());
	};
</script>

<style lang="scss" scoped></style>
