<template>
	<view class="my-address">
		<view class="my-address-top">
			<view class="manage-switch" @click="toggleManageMode">
				<view class="manage" v-if="!isManage">管理</view>
				<view class="manage" v-if="isManage">退出管理</view>
			</view>
			<view class="add-address" v-if="!isManage" @click="addCollectPopupOpen">新增地址</view>
		</view>
		<view class="address-list">
			<view class="address-item" v-for="(item, index) in addressManageStore.addressList" :key="item._id">
				<view class="item-top">
					<view class="top-left">
						<view class="recipient">{{ item.recipient }}</view>
						<view class="phone-number">{{ item.phone }}</view>
					</view>
					<view class="top-right">
						<view class="iconfont icon-daipingjia" @click="updateCollectPopupOpen(item)"></view>
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
						<view class="item-top">
							<view class="item-text">所在地区</view>
							<label class="radio" @click="tempAddress.isDefault = !tempAddress.isDefault">
								<radio value="" color="#49bdfb" :checked="tempAddress.isDefault" />
								<text>默认地址</text>
							</label>
						</view>
						<input type="text" v-model="tempAddress.addressCity" placeholder="所在地区" />
					</view>

					<view class="pop-content-item">
						<view class="item-top">
							<view class="item-text">详细地址与门牌号</view>
						</view>
						<input type="text" v-model="tempAddress.address" placeholder="详细地址与门牌号" />
					</view>

					<view class="pop-content-item">
						<view class="item-top">
							<view class="item-text">收货人名字</view>
						</view>
						<input type="text" v-model="tempAddress.recipient" placeholder="收货人名字" />
					</view>

					<view class="pop-content-item">
						<view class="item-top">
							<view class="item-text">手机号</view>
						</view>
						<input type="text" v-model="tempAddress.phone" placeholder="手机号" />
					</view>
				</view>

				<view class="save" @click="saveAddress">保存地址</view>
				<view class="safe-area-inset-bottom"></view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';

	import { useAddressManageStore } from '@/stores/addressManage.ts';
	const addressManageStore = useAddressManageStore();

	import { getUserAddressList, addAddAddress } from '@/api/apis.ts';

	// 查询参数
	const queryparams = ref({
		userId: '123',
		offset: 0,
		limit: 10,
	});

	// 获取用户收货地址
	const getUserAddressData = async () => {
		const res = await getUserAddressList(queryparams.value);
		addressManageStore.addressList = res.data;
	};

	onLoad(() => {
		getUserAddressData();
	});

	// 管理状态
	const isManage = ref(false);
	const toggleManageMode = () => {
		isManage.value = !isManage.value;
	};

	// // 切换地址为默认地址
	// const toggleDefaultAddress = addressManageStore.toggleDefaultAddress;

	// // 删除地址
	// const removeAddress = addressManageStore.removeAddress;

	// 新增/修改的临时数据
	const tempAddress = ref({
		isDefault: false,
		recipient: '',
		phone: '',
		addressCity: '',
		address: '',
	});

	// 是否为编辑模式（true：新增，false：修改）
	const isEditing = ref(true);

	// 弹窗实例
	const collectPopup = ref(null);
	const collectPopupOpen = () => {
		collectPopup.value.open();
	};
	const collectPopupClose = () => {
		collectPopup.value.close();
	};

	// 添加地址
	const addAddressAdd = async () => {
		// 调用 validateAddress 校验
		const isValid = addressManageStore.validateAddress(tempAddress.value);
		if (!isValid) {
			return; // 校验未通过，直接退出
		}
		try {
			const res = await addAddAddress({
				userId: queryparams.value.userId,
				...tempAddress.value,
			});
			if (res.code === 0) {
				uni.showToast({ title: '地址添加成功', icon: 'success' });
				// 关闭弹窗
				collectPopupClose();
				// 更新地址列表
				await getUserAddressData();
			} else {
				uni.showToast({ title: '地址添加失败', icon: 'none' });
			}
		} catch (error) {
			console.log(error);
		}

		// console.log(res);
	};

	// 点击新增地址打开弹窗
	const addCollectPopupOpen = () => {
		isEditing.value = true; // 新增模式
		tempAddress.value = {
			// 初始化为空数据
			isDefault: false,
			recipient: '',
			phone: '',
			addressCity: '',
			address: '',
		};
		collectPopupOpen();
	};

	// 点击修改地址打开弹窗
	const updateCollectPopupOpen = (item) => {
		isEditing.value = false; // 修改模式
		tempAddress.value = { ...item }; // 深拷贝数据
		collectPopupOpen();
	};

	// 保存地址（新增或修改）
	const saveAddress = async () => {
		if (isEditing.value) {
			// 新增地址
			await addAddressAdd();
		} else {
			// 修改地址
			// await addressManageStore.updateAddress(tempAddress.value._id, tempAddress.value);
			uni.showToast({ title: '地址更新成功', icon: 'success' });
			collectPopupClose(); // 关闭弹窗
		}
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
					justify-content: space-between;
					.item-text {
					}
					.radio {
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
