<template>
	<view class="my">
		<view class="my-header">
			<view class="header-main">
				<view class="iconfont icon-shezhi-copy" @click="goMyConfig"></view>

				<view class="header-user" @click="goLogin">
					<image class="user-img" src="/static/imgs/xxmLogo.png" mode=""></image>
					<view class="user-name">用户名称</view>
				</view>

				<view class="iconfont icon-xiaoxi"></view>
			</view>
		</view>

		<button @click="goAppLogin">APP登录注册</button>
		<button @click="goWeixinLogin">微信登录注册</button>
		<button @click="testToken1">测试token</button>

		<view class="my-order">
			<view class="order-content">
				<view class="order-title">
					<view class="order-my">我的订单</view>
					<view class="order-all" @click="goMyOrder">
						全部订单
						<view class="iconfont icon-xialajiantou1-copy"></view>
					</view>
				</view>

				<view class="order-list">
					<view class="order-item" v-for="item in variousBarStore.variousBar[0]?.order_bar.slice(1)" :key="item.id">
						<view class="iconfont" :class="item.class"></view>
						<view class="item-text">{{ item.name }}</view>
					</view>
				</view>
			</view>
		</view>

		<view class="my-content">
			<MyContentList />
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	import MyContentList from '@/components/my/MyContentList.vue';

	import { useVariousBarStore } from '@/stores/variousBar';
	const variousBarStore = useVariousBarStore();

	import { getAccessToken, getRefreshToken } from '@/utils/token.ts';

	// 定义登录页面
	let loginPage = '';
	// #ifdef MP-WEIXIN
	loginPage = '/subPackages/login/weixinLogin/weixinLogin';
	// #endif

	// #ifdef APP
	loginPage = '/subPackages/login/appLogin/appLogin';
	// #endif

	onShow(() => {
		if (!getAccessToken() || !getRefreshToken()) {
			uni.showToast({ title: '您已掉线请重新登录', icon: 'none' });
			uni.navigateTo({ url: loginPage });
		}
	});

	import { testToken } from '@/api/apis.ts';

	const testToken1 = async () => {
		const res = await testToken();
		console.log('testToken1', res);
	};

	onLoad(() => {});

	// 跳转到我的设置
	const goMyConfig = () => {
		uni.navigateTo({
			url: '/subPackages/my/myConfig/myConfig',
		});
	};

	// 跳转到我的订单
	const goMyOrder = () => {
		uni.navigateTo({
			url: '/subPackages/my/myOrder/myOrder',
		});
	};

	const goLogin = () => {
		// #ifdef APP
		uni.navigateTo({
			url: '/subPackages/login/appLogin/appLogin',
		});
		// #endif

		// #ifdef MP-WEIXIN
		uni.navigateTo({
			url: '/subPackages/login/weixinLogin/weixinLogin',
		});
		// #endif
	};

	// 跳转到APP登录注册
	const goAppLogin = () => {
		uni.navigateTo({
			url: '/subPackages/login/appLogin/appLogin',
		});
	};

	// 跳转到微信小程序登录注册
	const goWeixinLogin = () => {
		uni.navigateTo({
			url: '/subPackages/login/weixinLogin/weixinLogin',
		});
	};
</script>

<style lang="scss" scoped>
	.df-aic {
		display: flex;
		align-items: center;
	}
	.dg-jic {
		display: grid;
		justify-items: center;
	}
	.my {
		background-color: #f6f6f6;
		height: 100vh;
	}
	.my-header {
		background: linear-gradient(to bottom, transparent, #fff 800rpx), linear-gradient(to right, #beecd8 20%, #f4e2d8);
		width: 100%;
		height: 400rpx;
		position: relative;
		box-sizing: border-box;
		padding: 180rpx 40rpx 0;
		.header-main {
			display: flex;
			justify-content: space-between;
			.iconfont {
				font-size: 50rpx;
				padding: 20rpx;
			}

			.header-user {
				position: absolute;
				left: 50%;
				top: 60%;
				transform: translateX(-50%) translateY(-50%);
				.user-img {
					width: 180rpx;
					height: 180rpx;
					border-radius: 50%;
					border: 2rpx solid #ccc;
					background-color: #fff;
				}
				.user-name {
					text-align: center;
				}
			}
		}
	}
	.my-order {
		margin-bottom: 30rpx;
		.order-content {
			background-color: #fff;
			.order-title {
				@extend .df-aic;
				justify-content: space-between;
				padding: 30rpx;
				.order-my {
					font-weight: bold;
					font-size: 36rpx;
				}
				.order-all {
					@extend .df-aic;
					color: #666;
					font-size: 30rpx;
					.iconfont {
						font-size: 24rpx;
						padding-left: 10rpx;
						color: #666;
						opacity: 0.4;
					}
				}
			}
			.order-list {
				@extend .dg-jic;
				grid-template-columns: repeat(5, 1fr);
				padding: 30rpx 0;
				.order-item {
					@extend .dg-jic;
					.iconfont {
						font-size: 60rpx;
						padding-bottom: 10rpx;
					}
					.item-text {
						color: #666;
						font-size: 25rpx;
					}
				}
			}
		}
	}
</style>
