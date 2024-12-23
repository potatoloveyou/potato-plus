<template>
	<view class="my-address">
		<view class="my-address-top">
			<view class="manage-switch" @click="toggleManageMode">
				<view class="manage" v-if="!isManage">管理</view>
				<view class="manage" v-if="isManage">退出管理</view>
			</view>
			<view class="add-address" v-if="!isManage">新增地址</view>
		</view>
		<view class="address-list">
			<view class="address-item" v-for="(item, index) in addressManageStore.addressList" :key="item._id">
				<view class="item-top">
					<view class="top-left">
						<view class="recipient">{{ item.recipient }}</view>
						<view class="phone-number">{{ item.phone }}</view>
					</view>
					<view class="top-right">
						<view class="iconfont icon-daipingjia" @click="modifyAddressPopup"></view>
					</view>
				</view>
				<view class="item-bottom">
					<view class="address-details">{{ item.address }}</view>
					<view class="select" v-if="item.isDefault">默认</view>
				</view>
				<view class="manage-module" v-if="isManage">
					<label class="radio" @click="toggleDefaultAddress(item._id)">
						<radio value="" color="#49bdfb" :checked="item.isDefault" />
						<text>默认</text>
					</label>

					<view class="delete" @click="removeAddress(item._id)">删除</view>
				</view>
			</view>
		</view>

		<uni-popup ref="collectPopup" type="bottom" :safe-area="false">
			<view class="collectPopup">
				<view class="pop-content"></view>
				<view class="safe-area-inset-bottom"></view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { useAddressManageStore } from '@/stores/addressManage.ts';
const addressManageStore = useAddressManageStore();

const isManage = ref(false);
const toggleManageMode = () => {
	isManage.value = !isManage.value;
};

// 切换地址为默认地址
const toggleDefaultAddress = addressManageStore.toggleDefaultAddress;

// 添加地址
const addAddress = addressManageStore.addAddress;

// 删除地址
const removeAddress = addressManageStore.removeAddress;

// 加入购物车弹窗
const collectPopup = ref(null);
// 修改地址按钮
const modifyAddressPopup = () => {
	collectPopup.value.open();
	console.log(123);
};
</script>

<style lang="scss" scoped>
.df-aic {
	display: flex;
	align-items: center;
}
.df-jic {
	display: flex;
	justify-content: center;
}

.my-address {
}
.my-address-top {
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
	.add-address {
	}
}
.address-list {
	padding-left: 30rpx;
	.address-item {
		padding: 10rpx;
		border-bottom: 2rpx solid #e0e0e0;

		& > view {
			padding: 15rpx 0;
		}
		.item-top {
			@extend .df-aic;
			justify-content: space-between;
			.top-left {
				@extend .df-aic;

				.recipient {
					margin-right: 20rpx;
				}
				.phone-number {
				}
			}
			.top-right {
				.iconfont {
					font-size: 40rpx;
					padding-right: 40rpx;
				}
			}
		}
		.item-bottom {
			@extend .df-aic;

			.address-details {
			}

			.select {
				padding: 4rpx 8rpx;
				background-color: #49bdfb;
				color: #fff;
				border-radius: 10rpx;
				font-size: 24rpx;
				margin-left: 20rpx;
			}
		}
		.manage-module {
			@extend .df-aic;
			justify-content: space-between;
			.radio {
			}
			.delete {
				padding: 10rpx 20rpx;
				background-color: #f0f0f0;
				border-radius: 15rpx;
				margin-right: 50rpx;
			}
		}
	}
}
.collectPopup {
	background-color: #fff;
	border-radius: 20rpx 20rpx 0 0;
	max-height: 80vh;
}
</style>
