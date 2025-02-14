<template>
	<view class="pay-order">
		<!-- <uni-nav-bar :title="'支付订单'" left-icon="left" statusBar="true" @click-left="clickLift"> </uni-nav-bar> -->
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

		<!-- <button @click="completePayOrder">支付完成</button> -->
		<view class="pay-main">
			<radio-group @change="">
				<label for="">
					<view class="pay-item">
						<uni-icons class="iconfont" fontFamily="CustomFont" :size="50" @click="goSearch">{{
							'&#xe634;'
						}}</uni-icons>
						<view class="pay-item-text">
							<view class="pay-item-text-title">支付宝支付</view>
							<view class="pay-item-text-prompt">推荐有支付宝账号的用户使用</view>
						</view>
						<label class="radio">
							<radio checked="true" color="#ff3333" />
						</label>
					</view>
				</label>

				<label for="">
					<view class="pay-item">
						<uni-icons class="iconfont" fontFamily="CustomFont" :size="50" @click="goSearch">{{
							'&#xe650;'
						}}</uni-icons>
						<view class="pay-item-text">
							<view class="pay-item-text-title">微信支付</view>
							<view class="pay-item-text-prompt">推荐有微信账号的用户使用</view>
						</view>
						<label class="radio">
							<radio color="#ff3333" />
						</label>
					</view>
				</label>
			</radio-group>
		</view>

		<view class="pay-button">
			<button class="pay-button-pay" @click="completePayOrder">付款 ￥{{ orderDatails?.totalPrice }}</button>
			<view class="safe-area-inset-bottom"></view>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';

	import NavBar from '@/components/common/NavBar.vue';

	import { useOrderManageStore } from '@/stores/orderManage';
	const orderManageStore = useOrderManageStore();

	import { getAppointOrder, updateUserOrderStatus } from '@/api/apis';

	const orderDatails = ref({});
	// 获取指定订单数据
	const getAppointOrderData = async (id) => {
		const res = await getAppointOrder(id);
		orderDatails.value = res.data;
		console.log(orderDatails.value);
	};

	// 路径参数
	const routeParams = ref({});
	onLoad((options) => {
		routeParams.value = options;
		getAppointOrderData(routeParams.value.orderId);
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

	const completePayOrder = async () => {
		const res = await updateUserOrderStatus({ orderId: routeParams.value.orderId });
		if (res.code == 0) {
			uni.switchTab({
				url: '/pages/shoppingCart/shoppingCart',
				success(success) {
					uni.showToast({
						title: '支付成功',
						icon: 'success',
					});
				},
			});
		}
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
		.pay-main {
			label {
				.pay-item {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 20rpx 30rpx;
					.iconfont {
					}
					.pay-item-text {
						.pay-item-text-title {
							font-size: 36rpx;
							font-weight: bold;
						}
						.pay-item-text-prompt {
							font-size: 30rpx;
							color: #999;
						}
					}
					.radio {
					}
				}
			}
			label {
				.pay-item {
					.iconfont {
					}
					.pay-item-text {
						.pay-item-text-title {
						}
						.pay-item-text-prompt {
						}
					}
					.radio {
					}
				}
			}
		}
		.pay-button {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			.pay-button-pay {
				background-color: #42b7fb;
				color: #fff;
			}

			.safe-area-inset-bottom {
			}
		}
	}
</style>
