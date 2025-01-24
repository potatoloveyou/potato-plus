<template>
	<view class="weixinLogin">
		<!-- <NavBar /> -->

		<view class="logo">
			<image class="logo-img" src="/static/imgs/xxmLogo.png" mode=""></image>
		</view>

		<view class="phone-register" @click="weixinLogin">手机号登录</view>
	</view>
</template>

<script setup>
	const weixinLogin = () => {
		uni.getProvider({
			service: 'oauth',
			async success(res) {
				console.log(res);
			},
		});
	};
</script>

<style lang="scss" scoped>
	.weixinLogin {
		.weixinLogin-title {
			width: 100%;
			height: 100vh;
			.iconfont {
				font-size: 60rpx;
			}
			.icon-guanbi {
			}
			.logo {
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 120rpx 0;
				.logo-img {
					width: 180rpx;
					height: 180rpx;
				}
			}
			.phone-register {
				width: 100%;
				height: 100rpx;
				line-height: 100rpx;
				text-align: center;
				color: #fff;
				background-color: #49bdfb;
				border-radius: 50rpx;
			}
		}
	}
</style>
