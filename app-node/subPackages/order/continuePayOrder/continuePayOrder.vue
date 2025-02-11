<template>
	<view class="continue-pay-order">
		<ConfirmorderAddress :addressManage="orderDatails?.addressDetails" />
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
						<!-- <view class="goods-price"> -->
						<view class="goods-pprice">折后￥{{ item.goodsDetails.pprice }}</view>
						<view class="goods-oprice f-color">￥{{ item.goodsDetails.oprice }}</view>
						<view class="goods-num f-color">x{{ item.quantity }}</view>
						<!-- </view> -->
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
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';

	import ConfirmorderAddress from '@/components/order/confirmOrder/ConfirmorderAddress';

	import { getAppointOrder } from '@/api/apis';

	// const addressDetails = ref({});
	const orderDatails = ref({});
	// 获取预约订单数据
	const getAppointOrderData = async (id) => {
		const res = await getAppointOrder(id);
		console.log(res.data);
		// addressDetails.value = res.data.addressDetails;
		orderDatails.value = res.data;
	};

	onLoad((options) => {
		getAppointOrderData(options.orderId);
	});
</script>

<style lang="scss" scoped>
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
	.continue-pay-order {
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
						@extend .df-fdc;
						align-items: flex-end;
						.goods-pprice {
							font-size: 36rpx;
							font-weight: bold;
							color: #49bdfb;
						}
						.goods-oprice {
						}
						.f-color {
							font-size: 28rpx;
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
						font-size: 28rpx;
					}
					.slot-box {
						@extend .df-aic;
					}
					.slot-text {
						flex: 1;
					}
					.item-text {
						@extend .df-fdc;
						align-items: flex-end;
						.notes {
							color: #999;
						}
					}
					::v-deep .uni-list-item__container {
						padding-left: 20rpx;
					}
				}
			}
		}
	}
</style>
