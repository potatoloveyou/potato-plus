<template>
	<view class="my-address">
		<view class="my-address-top">
			<view class="manage-switch" @click="toggleManageMode">
				<view class="manage" v-if="!isManage">管理</view>
				<view class="manage" v-if="isManage">退出管理</view>
			</view>
			<view class="add-address" v-if="!isManage" @click="modifyAddressPopup">新增地址</view>
		</view>
		<view class="address-list">
			<view class="address-item" v-for="(item, index) in addressManageStore.addressList" :key="item._id">
				<view class="item-top">
					<view class="top-left">
						<view class="recipient">{{ item.recipient }}</view>
						<view class="phone-number">{{ item.phone }}</view>
					</view>
					<view class="top-right">
						<view class="iconfont icon-daipingjia"></view>
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
				<view class="pop-content">
					<view class="pop-content-item">
						<view class="item-top" @click="showCityPicker">
							<view class="item-text">所在地区</view>
							<view class="iconfont icon-shanglajiantou"></view>
						</view>
						<!-- 						<mpvue-city-picker
							ref="mpvuePicker"
							:pickerValueDefault="pickerValueDefault"
							@onChange="onChange"
							@onCancel="onCancel"
							@onConfirm="onConfirm"></mpvue-city-picker> -->
						<input type="text" v-model="addressCity" placeholder="所在地区" />
					</view>

					<view class="pop-content-item">
						<view class="item-top">
							<view class="item-text">详细地址与门牌号</view>
							<view class="iconfont icon-shanglajiantou"></view>
						</view>
						<input type="text" v-model="address" placeholder="详细地址与门牌号" />
					</view>

					<view class="pop-content-item">
						<view class="item-top">
							<view class="item-text">收货人名字</view>
							<view class="iconfont icon-shanglajiantou"></view>
						</view>
						<input type="text" v-model="recipient" placeholder="收货人名字" />
					</view>

					<view class="pop-content-item">
						<view class="item-top">
							<view class="item-text">手机号</view>
							<view class="iconfont icon-shanglajiantou"></view>
						</view>
						<input type="text" v-model="phone" placeholder="手机号" />
					</view>
				</view>

				<view class="save" @click="addAddress(newAddress)">保存地址</view>
				<view class="safe-area-inset-bottom"></view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
import { ref } from 'vue';

import mpvueCityPicker from 'mpvue-citypicker';

import { useAddressManageStore } from '@/stores/addressManage.ts';
const addressManageStore = useAddressManageStore();

const isManage = ref(false);
const toggleManageMode = () => {
	isManage.value = !isManage.value;
};

// 切换地址为默认地址
const toggleDefaultAddress = addressManageStore.toggleDefaultAddress;

// 删除地址
const removeAddress = addressManageStore.removeAddress;

// 加入购物车弹窗
const collectPopup = ref(null);
// 修改地址按钮
const modifyAddressPopup = () => {
	collectPopup.value.open();
	console.log(123);
};

// // 三级弹窗
// const mpvuePicker = ref(null);
// const pickerValueDefault = [0, 0, 2];
// const cityName = ref('所在地区');
// const showCityPicker = () => {
// 	mpvuePicker.value.show();
// };
// const onConfirm = (e) => {
// 	console.log(e);
// 	cityName.value = e.label;
// };

const addressCity = ref('');
const address = ref('');
const recipient = ref('');
const phone = ref('');
const newAddress = ref({});

const validateAddress = (address) => {
	if (!address.recipient) {
		uni.showToast({ title: '请填写收货人名字', icon: 'none' });
		return false;
	}
	if (!address.phone || !/^1[3-9]\d{9}$/.test(address.phone)) {
		uni.showToast({ title: '请填写正确的手机号', icon: 'none' });
		return false;
	}
	if (!address.addressCity) {
		uni.showToast({ title: '请选择所在地区', icon: 'none' });
		return false;
	}
	if (!address.address) {
		uni.showToast({ title: '请填写详细地址', icon: 'none' });
		return false;
	}
	return true;
};

// 添加地址
const addAddress = () => {
	// 整合新地址数据
	newAddress.value = {
		recipient: recipient.value,
		phone: phone.value,
		addressCity: addressCity.value,
		address: address.value,
		isDefault: false,
	};

	// 校验表单数据
	if (!validateAddress(newAddress.value)) return;

	// 同步添加地址
	addressManageStore.addAddress(newAddress.value);

	uni.showToast({ title: '地址保存成功', icon: 'success' });

	// 清空表单
	recipient.value = '';
	phone.value = '';
	addressCity.value = '';
	address.value = '';
	newAddress.value = {};

	// 关闭弹窗
	collectPopup.value.close();
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
	.pop-content {
		padding: 0 20rpx;
		.pop-content-item {
			padding: 20rpx 0;
			border-bottom: 2rpx solid #e0e0e0;
			.item-top {
				@extend .df-aic;
				.item-text {
				}
				.iconfont {
				}
			}
		}
	}
	.save {
		text-align: center;
		background-color: #49bdfb;
		color: #fff;
		padding: 30rpx 0;
	}
}
</style>
