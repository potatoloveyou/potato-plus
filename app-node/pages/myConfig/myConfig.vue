<template>
	<view class="my-config">
		<view class="my-section">
			<view class="my-config-item">
				<view class="content-left">
					<image class="content-img" src="../../static/imgs/xxmLogo.png" mode=""></image>
					<view class="content-name">我可能会发光</view>
				</view>
				<view class="content-right">
					<view class="iconfont icon-xialajiantou1-copy"></view>
				</view>
			</view>

			<view class="my-config-item" @click="goMyPath">
				<view class="content-left">
					<view class="content-name">地址管理</view>
				</view>
				<view class="content-right">
					<view class="iconfont icon-xialajiantou1-copy"></view>
				</view>
			</view>

			<view class="my-config-item">
				<view class="content-left">
					<view class="content-name">账号与安全</view>
				</view>
				<view class="content-right">
					<view class="iconfont icon-xialajiantou1-copy"></view>
				</view>
			</view>

			<view class="my-config-item">
				<view class="content-left">
					<view class="content-name">绑定第三方账号</view>
				</view>
				<view class="content-right">
					<view class="iconfont icon-xialajiantou1-copy"></view>
				</view>
			</view>

			<view class="my-config-item">
				<view class="content-left">
					<view class="content-name">支付</view>
				</view>
				<view class="content-right">
					<view class="right-text">支付宝账号，先用后付等</view>
					<view class="iconfont icon-xialajiantou1-copy"></view>
				</view>
			</view>

			<view class="my-config-item">
				<view class="content-left">
					<view class="content-name">消息通知</view>
				</view>
				<view class="content-right">
					<view class="iconfont icon-xialajiantou1-copy"></view>
				</view>
			</view>

			<view class="my-config-item">
				<view class="content-left">
					<view class="content-name">清理缓存</view>
				</view>
				<view class="content-right">
					<view class="right-text">xxx</view>
					<view class="iconfont icon-xialajiantou1-copy"></view>
				</view>
			</view>

			<view class="my-config-item">
				<view class="content-left">
					<view class="content-name">关于potato商场</view>
				</view>
				<view class="content-right">
					<view class="iconfont icon-xialajiantou1-copy"></view>
				</view>
			</view>
		</view>
		<view class="exit">退出登录</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';

const goMyPath = () => {
	uni.navigateTo({
		url: '/pages/my/myPath/myPath',
	});
};
</script>

<style lang="scss" scoped>
.df-aic {
	display: flex;
	align-items: center;
}
.mb-30rpx {
	margin-bottom: 30rpx;
}
.opacity_5 {
	opacity: 0.5;
}

.my-config {
	background-color: #f6f6f6;
	height: 100vh;
}
.my-section {
	padding-left: 30rpx;
	background-color: #fff;
}
.my-config-item {
	padding: 26rpx 0;
	border-bottom: 2rpx solid #e0e0e0;
	@extend .df-aic;
	justify-content: space-between;

	.content-left {
		@extend .df-aic;
		.content-img {
			width: 120rpx;
			height: 120rpx;
			border-radius: 50%;
			margin-right: 20rpx;
		}
		.content-name {
			font-size: 36rpx;
		}
	}
	.content-right {
		padding-right: 30rpx;
		@extend .df-aic;
		.right-text {
			font-size: 26rpx;
			// @extend .opacity_4;
			opacity: 0.5;
		}
		.iconfont {
			font-size: 36rpx;
			// color: #666;
			// opacity: 0.3;
			@extend .opacity_5;
		}
	}
}
.exit {
	margin-top: 50rpx;
	width: 100%;
	line-height: 3rem;
	text-align: center;
	background-color: #42b7fb;
}
</style>
