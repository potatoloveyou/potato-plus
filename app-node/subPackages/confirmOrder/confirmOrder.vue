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
				to="/subPackages/my/myAddress/myAddress?from=order">
			</uni-list-item>
		</uni-list>

		<ConfirmOrderList />

		<view class="order-bottom">
			<view class="bottom-text bg-color" @click="submitOrder">立刻支付￥{{ shoppingCartStore.totalPrice }}</view>
			<view class="safe-area-inset-bottom"></view>
		</view>
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
	});

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
		// console.log(shoppingCartStore.confirmOrderList);
		// console.log(addressManageStore.selectAddress._id);
		const res = await addUserOrder(temporaryData);
		console.log(res);
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
