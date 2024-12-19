<template>
	<view class="my-content-list">
		<view class="my-content-item">
			<view class="item-left">
				<view class="iconfont icon-shoucang"></view>
				<view class="item-name">我的收藏</view>
			</view>
			<view class="item-right">
				<view class="item-num">1</view>
				<view class="iconfont icon-xialajiantou1-copy"></view>
			</view>
		</view>
		<view class="my-content-item">
			<view class="item-left">
				<view class="iconfont icon-youhuijuan"></view>
				<view class="item-name">我的优惠卷</view>
			</view>
			<view class="item-right">
				<view class="item-num">0</view>
				<view class="iconfont icon-xialajiantou1-copy"></view>
			</view>
		</view>
		<view class="my-content-item mb-30rpx">
			<view class="item-left">
				<view class="iconfont icon-jifen"></view>
				<view class="item-name">我的积分</view>
			</view>
			<view class="item-right">
				<view class="item-num">1</view>
				<view class="iconfont icon-xialajiantou1-copy"></view>
			</view>
		</view>
		<view class="my-content-item mb-30rpx">
			<view class="item-left">
				<view class="iconfont icon-VIP"></view>
				<view class="item-name">加入超级VIP</view>
			</view>
			<view class="item-right">
				<view class="item-num">1</view>
				<view class="iconfont icon-xialajiantou1-copy"></view>
			</view>
		</view>
		<view class="my-content-item">
			<view class="item-left">
				<view class="iconfont icon-bangzhu"></view>
				<view class="item-name">帮助中心</view>
			</view>
			<view class="item-right">
				<view class="item-num">1</view>
				<view class="iconfont icon-xialajiantou1-copy"></view>
			</view>
		</view>
		<view class="my-content-item">
			<view class="item-left">
				<view class="iconfont icon-kefu"></view>
				<view class="item-name">联系客服</view>
			</view>
			<view class="item-right">
				<view class="item-num">1</view>
				<view class="iconfont icon-xialajiantou1-copy"></view>
			</view>
		</view>
		<view class="my-content-item">
			<view class="item-left">
				<view class="iconfont icon-shangjia"></view>
				<view class="item-name">商家入驻</view>
			</view>
			<view class="item-right">
				<view class="item-num">1</view>
				<view class="iconfont icon-xialajiantou1-copy"></view>
			</view>
		</view>
	</view>
</template>

<script setup></script>

<style lang="scss" scoped>
.df-aic {
	display: flex;
	align-items: center;
}
.mb-30rpx {
	margin-bottom: 30rpx;
}
.my-content-item {
	@extend .df-aic;
	justify-content: space-between;
	background-color: #fff;
	padding: 24rpx 30rpx;
	border-bottom: 2rpx solid #e0e0e0;
	.item-left {
		@extend .df-aic;
		.iconfont {
			font-size: 50rpx;
			padding-right: 25rpx;
		}
		.item-name {
			font-weight: bold;
			font-size: 32rpx;
		}
	}
	.item-right {
		@extend .df-aic;
		.item-num {
			font-size: 32rpx;
			padding: 0 20rpx;
		}
		.iconfont {
			font-size: 44rpx;
			opacity: 0.5;
		}
	}
}
</style>
