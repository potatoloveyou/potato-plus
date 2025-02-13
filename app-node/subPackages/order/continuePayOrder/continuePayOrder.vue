<template>
	<!-- 继续支付页 -->
	<view class="continue-pay-order">
		<ConfirmorderAddress :addressManage="addressManageStore.selectAddress" :orderId="orderId" />

		<view class="confirm-order-list">
			<view class="confirm-order-item" v-for="(item, index) in orderDatails?.shoppingItems" :key="item._id">
				<view class="item-top">
					<image class="goods-img" :src="item.goodsDetails.imgUrl" mode="" />
					<view class="goods-details">
						<view class="goods-name">{{ item.goodsDetails.name }}</view>
						<view class="goods-color f-color">颜色：{{ item.selectedAttributes.color }}</view>
						<views class="goods-size f-color">大小：{{ item.selectedAttributes.size }}</views>
					</view>
					<view class="goods-condition">
						<view class="goods-pprice">折后￥{{ item.goodsDetails.pprice }}</view>
						<view class="goods-oprice f-color">原价￥{{ item.goodsDetails.oprice }}</view>
						<view class="goods-num f-color">x{{ item.quantity }}</view>
					</view>
				</view>
			</view>
			<uni-list class="uni-list">
				<uni-list-item class="uni-list-item" showArrow>
					<template v-slot:body>
						<text class="slot-box slot-text fs-28rpx">配送</text>
					</template>
					<template v-slot:footer>
						<view class="item-text fs-28rpx">
							<text>快递 包邮</text>
							<text>48小时内发货</text>
						</view>
					</template>
				</uni-list-item>
				<uni-list-item class="uni-list-item">
					<template v-slot:body>
						<text class="slot-box slot-text fs-28rpx">订单编号:</text>
					</template>
					<template v-slot:footer>
						<view class="item-text fs-28rpx">
							<text class="notes">{{ orderDatails._id }}</text>
						</view>
					</template>
				</uni-list-item>
				<uni-list-item class="uni-list-item">
					<template v-slot:body>
						<text class="slot-box slot-text fs-28rpx">创建时间:</text>
					</template>
					<template v-slot:footer>
						<view class="item-text fs-28rpx">
							<text class="notes">{{ orderDatails.createdAt }}</text>
						</view>
					</template>
				</uni-list-item>
			</uni-list>
		</view>

		<view class="confirm-order-bottom">
			<view class="bottom-container">
				<view class="cancel-btn" @click="deleteOrder">
					<uni-icons class="iconfont" fontFamily="CustomFont" size="48rpx">{{ '&#xe68d;' }}</uni-icons>
					<text class="cancel-btn-text">取消</text>
				</view>

				<view class="container-right">
					<view class="total-middle">
						<view class="total-price">
							<text class="total-price-text"
								>合计:￥
								<text class="total-quantity"> 共{{ orderDatails.totalQuantity }}件</text>
							</text>
							<text class="total-price-text-number">{{ orderDatails.totalPrice }}</text></view
						>
						<view class="total-discount">共减￥{{ orderDatails.totalDiscount }}</view>
					</view>

					<view class="pay-btn">
						<view class="pay-btn-text">立即支付</view>
						<!-- <view class="pay-remaining-time">剩余{{ orderDatails.expiresIn }}</view> -->
					</view>
				</view>
			</view>
			<view class="safe-area-inset-bottom"></view>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';

	import ConfirmorderAddress from '@/components/order/confirmOrder/ConfirmorderAddress';

	import { useAddressManageStore } from '@/stores/addressManage';
	const addressManageStore = useAddressManageStore();

	import { getAppointOrder, delUserOrder } from '@/api/apis';

	// const addressDetails = ref({});
	const orderDatails = ref({});
	// 获取预约订单数据
	const getAppointOrderData = async (id) => {
		const res = await getAppointOrder(id);
		// console.log(res.data);
		orderDatails.value = res.data;
		addressManageStore.selectAddress = res.data.addressDetails;
		console.log(addressManageStore.selectAddress);
	};

	const orderId = ref('');
	onLoad((options) => {
		orderId.value = options.orderId;
		getAppointOrderData(orderId.value);
	});

	// 删除订单
	const deleteOrder = () => {
		//

		uni.showModal({
			title: '确定要删除订单吗',
			async success(success) {
				if (success.confirm) {
					const res = await delUserOrder(orderDatails.value._id);
					if (res.code == 0) {
						uni.navigateBack({
							delta: 1,
							success(success) {
								uni.showToast({
									title: '删除成功',
									icon: 'success',
								});
							},
						});
					}
				}
			},
		});
	};
</script>

<style lang="scss" scoped>
	.fs-28rpx {
		font-size: 28rpx;
	}
	.df {
		display: flex;
	}
	.df-aic {
		@extend .df;
		align-items: center;
	}
	.df-fdc {
		@extend .df;
		flex-direction: column;
	}
	.df-fdc-aife {
		@extend .df-fdc;
		align-items: flex-end;
	}
	.continue-pay-order {
		height: 100vh;
		background-color: #f7f7f7;
		.confirm-order-list {
			margin-top: 20rpx;
			.confirm-order-item {
				background-color: #fff;
				margin-bottom: 20rpx;
				padding: 0 20rpx;
				.item-top {
					@extend .df;
					.goods-img {
						width: 180rpx;
						height: 180rpx;
					}
					.goods-details {
						flex: 1;
						padding-left: 20rpx;
						.goods-name {
							font-size: 30rpx;
							font-weight: bold;
						}
						.goods-color {
						}
						.f-color {
							font-size: 24rpx;
						}
						.goods-size {
						}
					}
					.goods-condition {
						@extend .df-fdc-aife;
						.goods-pprice {
							font-size: 36rpx;
							font-weight: bold;
							color: #49bdfb;
						}
						.goods-oprice {
						}
						.f-color {
							@extend .fs-28rpx;
						}
						.goods-num {
						}
					}
				}
			}
			.uni-list {
				//
				.uni-list-item {
					// padding: 5rpx 0;
					.fs-28rpx {
						@extend .fs-28rpx;
					}
					.slot-box {
						@extend .df-aic;
					}
					.slot-text {
						flex: 1;
					}
					.item-text {
						@extend .df-fdc-aife;
						.notes {
							color: #999;
						}
					}
					::v-deep .uni-list-item__container {
						padding-left: 20rpx;
					}
				}
				.uni-list-item {
					.slot-box {
					}
					.slot-text {
					}
					.fs-28rpx {
					}
					.item-text {
						.notes {
						}
					}
				}
				.uni-list-item {
					.slot-box {
					}
					.slot-text {
					}
					.fs-28rpx {
					}
					.item-text {
						.notes {
						}
					}
				}
			}
		}
		.confirm-order-bottom {
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100%;
			background-color: #fff;

			.bottom-container {
				padding: 30rpx 40rpx;
				// box-sizing: border-box;
				@extend .df-aic;
				justify-content: space-between;
				.cancel-btn {
					@extend .df-fdc;
					padding-left: 20rpx;
					.iconfont {
					}
					.cancel-btn-text {
						color: #999;
						font-size: 20rpx;
					}
				}
				.container-right {
					@extend .df;
					.total-quantity {
					}

					.total-middle {
						@extend .df-fdc-aife;
						@extend .fs-28rpx;
						.total-price {
							.total-price-text {
								position: relative;
								.total-quantity {
									position: absolute;
									top: 0;
									left: -80%;
									color: #999;
								}
							}
							.total-price-text-number {
								color: #49bdfb;
								font-size: 42rpx;
								font-weight: bold;
							}
						}
						.total-discount {
							color: #49bdfb;
							font-size: 26rpx;
						}
					}

					.pay-btn {
						background-color: #49bdfb;
						@extend .df-aic;
						padding: 0 20rpx;
						color: #fff;
						margin-left: 20rpx;
						.pay-btn-text {
						}
						.pay-remaining-time {
						}
					}
				}
			}
			.safe-area-inset-bottom {
			}
		}
	}
</style>
