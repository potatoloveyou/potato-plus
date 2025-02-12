<template>
	<view class="confirm-order bg-active-color">
		<ConfirmorderAddress :addressManage="addressManageStore.selectAddress" />
		<ConfirmOrderList />

		<view class="order-bottom">
			<view class="bottom-text bg-color" @click="submitOrder">立刻支付￥{{ orderManageStore.totalPrice }}</view>
			<view class="safe-area-inset-bottom"></view>
		</view>

		<uni-popup ref="collectPopup" type="bottom" :safe-area="false"> </uni-popup>
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
