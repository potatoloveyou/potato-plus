<template>
	<view class="pay-order">
		<NavBar>
			<template #titleBar-slot>
				<view class="wx-app-pay-order-nav">
					<view class="nav-icons">
						<uni-icons class="iconfont" type="left" size="30" @click="clickLift"></uni-icons>
					</view>
					<text class="nav-text">支付订单</text>
					<view></view>
				</view>
			</template>
		</NavBar>

		<button @click="completePayOrder">支付完成</button>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';

	import NavBar from '@/components/common/NavBar.vue';

	// 路径参数
	const routeParams = ref({});
	onLoad((options) => {
		routeParams.value = options;
	});
	const clickLift = () => {
		if (routeParams.value.from === 'confirmOrder' && routeParams.value.orderId) {
			uni.navigateTo({
				url: `/subPackages/order/continuePayOrder/continuePayOrder?orderId=${routeParams.value.orderId}&from=payOrder`,
			});
			return;
		}
		uni.navigateBack({
			delta: 1,
		});
	};

	const completePayOrder = () => {
		uni.switchTab({
			url: '/pages/shoppingCart/shoppingCart',
			success(success) {
				uni.showToast({
					title: '支付成功',
					icon: 'success',
				});
			},
		});
	};
</script>

<style lang="scss" scoped>
	.pay-order {
		.wx-app-pay-order-nav {
			width: 100%;
			display: flex;
			align-items: center;
			.nav-icons {
				.iconfont {
					margin-left: 10rpx;
				}
			}
			& > view {
				flex: 1;
			}
			.nav-close {
				text {
					font-size: 38rpx;
					margin-left: 60rpx;
					color: #666666;
				}
			}
			.nav-text {
			}
		}
	}
</style>
