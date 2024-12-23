<template>
	<view class="my">
		<view class="my-header">
			<view class="header-main">
				<view class="iconfont icon-shezhi-copy" @click="goMyConfig"></view>
				<view class="header-user">
					<image class="user-img" src="/static/imgs/xxmLogo.png" mode=""></image>
					<view class="user-name">用户名称</view>
				</view>
				<view class="iconfont icon-xiaoxi"></view>
			</view>
		</view>

		<view class="my-order">
			<view class="order-content">
				<view class="order-title">
					<view class="order-my">我的订单</view>
					<view class="order-all">
						全部订单
						<view class="iconfont icon-xialajiantou1-copy"></view>
					</view>
				</view>

				<view class="order-list">
					<view class="order-item">
						<view class="iconfont icon-gerenzhongxindingdandaifukuan"></view>
						<view class="item-text">待付款</view>
					</view>
					<view class="order-item">
						<view class="iconfont icon-a-fahuodaifahuo"></view>
						<view class="item-text">待发货</view>
					</view>
					<view class="order-item">
						<view class="iconfont icon-daishouhuo"></view>
						<view class="item-text">待收货</view>
					</view>
					<view class="order-item">
						<view class="iconfont icon-pingjia"></view>
						<view class="item-text">待评价</view>
					</view>
					<view class="order-item">
						<view class="iconfont icon-tuikuan"></view>
						<view class="item-text">退款管理</view>
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
import NavBar from '@/components/common/NavBar.vue';
import MyContentList from '@/components/my/MyContentList.vue';

// 跳转到我的设置
const goMyConfig = () => {
	uni.navigateTo({
		url: '/pages/myConfig/myConfig',
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
