<template>
	<view class="my-path">
		<view class="my-path-top">
			<view class="manage">管理</view>
			<view class="add-path">新增地址</view>
		</view>
		<view class="path-list">
			<view class="path-item">
				<view class="item-top">
					<view class="recipient">potato</view>
					<view class="phone-number">123456789</view>
				</view>
				<view class="item-bottom">
					<view class="select">默认</view>
					<view class="path-details">扫地机阿斯哦带来快睡觉覅咯</view>
				</view>

				<view class="manage-module"></view>
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
.df-jic {
	display: flex;
	justify-content: center;
}

.my-path {
}
.my-path-top {
	width: 100%;
	@extend .df-aic;
	margin: 20rpx;
	& > view {
		padding: 10rpx 20rpx;
		background-color: #49bdfb;
		color: #fff;
		border-radius: 40rpx;
	}
	justify-content: space-around;
	.manage {
	}
	.add-path {
	}
}
.path-list {
	padding-left: 30rpx;
	.path-item {
		padding: 10rpx;
		border-bottom: 2rpx solid #e0e0e0;
		.item-top {
			padding: 10rpx;
			@extend .df-aic;

			.recipient {
				margin-right: 20rpx;
			}
			.phone-number {
			}
		}
		.item-bottom {
			@extend .df-aic;
			padding: 10rpx;
			.select {
				padding: 4rpx 8rpx;
				background-color: #49bdfb;
				color: #fff;
				border-radius: 10rpx;
				font-size: 24rpx;
				margin-right: 20rpx;
			}
			.path-details {
			}
		}
	}
}
</style>
