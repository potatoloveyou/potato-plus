<template>
	<view class="my">
		<view class="my-header">
			<view class="header-main">
				<view class="iconfont icon-shezhi-copy"></view>
				<view class="header-user">
					<image class="user-img" src="/static/imgs/xxmLogo.png" mode=""></image>
					<view class="user-name">用户名称</view>
				</view>
				<view class="iconfont icon-xiaoxi"></view>
			</view>
		</view>

		<view class="my-order">
			<view class="order-title">
				<view class="my-order">我的订单</view>
				<view class="all-order">
					全部订单
					<uni-icons type="right" size="20"></uni-icons>
				</view>
			</view>
			<view class="order-list">
				<image src="" mode=""></image>
				<view>待付款</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import NavBar from '@/components/common/NavBar.vue';
</script>

<style lang="scss" scoped>
.my-header {
	background: linear-gradient(to bottom, transparent, #fff 800rpx), linear-gradient(to right, #beecd8 20%, #f4e2d8);
	width: 100%;
	height: 400rpx;
	position: relative;
	box-sizing: border-box;
	padding: 200rpx 50rpx 0;
	.header-main {
		display: flex;
		justify-content: space-between;
		.iconfont {
			font-size: 50rpx;
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
				color: #fff;
			}
		}
	}
}
</style>
