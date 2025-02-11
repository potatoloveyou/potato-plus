<template>
	<view class="confirm-order bg-active-color">
		<uni-list class="uni-list">
			<uni-list-item
				class="uni-list-item"
				:title="`${addressManageStore.selectAddress?.addressCity} ${addressManageStore.selectAddress?.address}`"
				:note="`${addressManageStore.selectAddress?.recipient} ${addressManageStore.selectAddress?.phone}`"
				showArrow
				showExtraIcon
				:extraIcon="{ type: 'location', size: '50rpx' }"
				link="navigateTo"
				to="/subPackages/my/myAddress/myAddress?from=order"
				v-if="addressManageStore.selectAddress">
			</uni-list-item>
			<uni-list-item
				class="uni-list-item uni-list-item-no-address"
				title="暂无地址请先添加地址"
				showArrow
				showExtraIcon
				:extraIcon="{ type: 'location', size: '50rpx' }"
				link="navigateTo"
				to="/subPackages/my/myAddress/myAddress?from=order"
				v-if="!addressManageStore.selectAddress">
			</uni-list-item>
		</uni-list>

		<ConfirmOrderList />

		<view class="order-bottom">
			<view class="bottom-text bg-color" @click="submitOrder">立刻支付￥{{ shoppingCartStore.totalPrice }}</view>
			<view class="safe-area-inset-bottom"></view>
		</view>

		<uni-popup ref="collectPopup" type="bottom" :safe-area="false"> </uni-popup>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';

	import ConfirmOrderList from '@/components/confirmOrder/ConfirmOrderList';

	import { useShoppingCartStore } from '@/stores/shoppingCart';
	const shoppingCartStore = useShoppingCartStore();

	import { useAddressManageStore } from '@/stores/addressManage';
	const addressManageStore = useAddressManageStore();

	import { addUserOrder } from '@/api/apis.ts';

	// 查询参数
	const queryparams = ref({
		offset: 0,
		limit: 10,
	});

	// 默认地址
	onLoad(async () => {
		await addressManageStore.getUserAddressData(queryparams.value);
		addressManageStore.selectAddress = addressManageStore.defaultAddress;
		// console.log(addressManageStore.selectAddress);
		if (!addressManageStore.selectAddress) {
			console.log('请选择地址');
		}
	});

	// 弹窗实例
	const collectPopup = ref(null);
	const collectPopupOpen = () => {
		collectPopup.value.open();
	};
	const collectPopupClose = () => {
		collectPopup.value.close();
	};

	// 提交订单
	const submitOrder = async () => {
		const temporaryData = {
			shoppingIds: [],
			addressId: addressManageStore.selectAddress._id,
		};
		shoppingCartStore.confirmOrderList.forEach((item) => {
			temporaryData.shoppingIds.push({
				shoppingId: item._id,
				quantity: item.quantity,
			});
		});
		const res = await addUserOrder(temporaryData);
		console.log(res);
		uni.switchTab({
			url: '/pages/shoppingCart/shoppingCart',
			success(success) {
				uni.showToast({
					title: '提交成功',
					icon: 'success',
				});
			},
		});
	};
</script>

<style lang="scss" scoped>
	.df-aic {
		display: flex;
		align-items: center;
	}
	.bg-active-color {
	}
	.confirm-order {
		height: 100vh;
		.uni-list {
			.uni-list-item {
				::v-deep .uni-list-item__content-title {
					font-size: 32rpx;
					font-weight: bold;
				}
				::v-deep .uni-list-item__content-note {
					font-size: 28rpx;
				}
			}
			.uni-list-item-no-address {
				::v-deep .uni-list-item__content-title {
					// color: red;
					font-size: 36rpx;
					text-align: center;
					color: red;
				}
			}
			.uni-list-item {
			}
			.no-address {
			}
		}
		.order-bottom {
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100%;
			.bottom-text {
				margin: 0 30rpx;
				text-align: center;
				border-radius: 10rpx;
				padding: 20rpx 0;
				color: #fff;
			}
			.bg-color {
			}
			.safe-area-inset-bottom {
			}
		}
	}
</style>
