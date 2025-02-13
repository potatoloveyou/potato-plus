<template>
	<view class="confirm-order bg-active-color">
		<ConfirmorderAddress :addressManage="addressManageStore.selectAddress" />
		<ConfirmOrderList />
		<view class="reserve"></view>
		<view class="safe-area-inset-bottom"></view>

		<view class="order-bottom">
			<button class="bottom-text bg-color" @click="submitOrder">立刻支付￥{{ orderManageStore.totalPrice }}</button>
			<view class="safe-area-inset-bottom"></view>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';

	import ConfirmOrderList from '@/components/order/confirmOrder/ConfirmOrderList';
	import ConfirmorderAddress from '@/components/order/confirmOrder/ConfirmorderAddress';

	import { useAddressManageStore } from '@/stores/addressManage';
	const addressManageStore = useAddressManageStore();

	import { useOrderManageStore } from '@/stores/orderManage';
	const orderManageStore = useOrderManageStore();

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

	const isSubmitOrder = ref(false);
	// 提交订单
	const submitOrder = async () => {
		if (isSubmitOrder.value) return;
		isSubmitOrder.value = true;

		// 获取订单列表
		const firstOrderList = orderManageStore.confirmOrderList[0];
		const temporaryData = {
			shoppingIds: [],
			addressId: addressManageStore.selectAddress._id,
			shoppingItems: [
				{
					goodsId: firstOrderList.goodsDetails._id,
					selectedAttributes: firstOrderList.selectedAttributes,
					quantity: firstOrderList.quantity,
				},
			],
		};
		orderManageStore.confirmOrderList.forEach((item) => {
			temporaryData.shoppingIds.push({
				shoppingId: item._id,
				quantity: item.quantity,
			});
		});

		const res = await addUserOrder(temporaryData);
		const orderId = res.orderResult.insertedId;

		if (res.code == 0) {
			console.log('提交订单成功');
			uni.navigateTo({
				url: `/subPackages/order/payOrder/payOrder?from=confirmOrder&orderId=${orderId}`,
			});
		}
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
		.reserve {
			height: 100rpx;
		}
		.safe-area-inset-bottom {
		}

		.order-bottom {
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100%;
			background-color: #fff;
			.bottom-text {
				margin: 0 30rpx;
				text-align: center;
				border-radius: 10rpx;
				color: #fff;
			}
			.bg-color {
			}
			.safe-area-inset-bottom {
			}
		}
		.collectPopup {
			width: 100%;
			background-color: #fff;
			max-height: 60vh;
			.safe-area-inset-bottom {
			}
		}
	}
</style>
