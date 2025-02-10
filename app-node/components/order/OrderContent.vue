<template>
	<view class="order-content">
		<view class="order-item" v-for="item in orderList" :key="item._id">
			<view class="item-top">
				<view class="order-status f-active-color">待买家支付</view>
			</view>
			<view class="item-content" v-for="good in item.shoppingItems" :key="good.goodsDetails._id">
				<image class="goods-img" :src="good.goodsDetails.imgUrl" mode="" />
				<view class="goods-">
					<view class="goods-details">
						<view class="goods-name">{{ good.goodsDetails.name }}</view>
						<view class="goods-color f-color">颜色分类：{{ good.selectedAttributes.color }}</view>
						<view class="goods-size f-color">大小：{{ good.selectedAttributes.size }}</view>
						<view class="refund f-active-color">7天无理由退换</view>
					</view>

					<view class="goods-condition">
						<view class="goods-price"
							>￥
							<view class="pprice">{{ good.goodsDetails.pprice }}</view>
						</view>
						<view class="goods-num">x {{ good.quantity }}</view>
					</view>
				</view>
			</view>

			<view class="item-amounts">
				<view class="amounts"
					>实付款￥
					<view class="price">299.99</view>
				</view>
			</view>

			<view class="item-bottom-button">
				<view class="more">更多</view>
				<view class="bottom-button">
					<view class="add-cart">查看物流</view>
					<view class="add-cart">加入购物车</view>
					<view class="again-payment">再来一单</view>
				</view>
			</view>
			<!-- <button>支付</button> -->
		</view>
	</view>
</template>

<script setup>
	import { ref, defineProps } from 'vue';

	const props = defineProps({
		orderList: Array,
	});
</script>

<style lang="scss" scoped>
	.fs-25rpx {
		font-size: 25rpx;
	}
	.order-content {
		.order-item {
			background-color: #fff;
			margin-bottom: 40rpx;
			.item-top {
				display: flex;
				justify-content: flex-end;
				align-items: center;
				padding: 10rpx 30rpx;
				.order-store {
					font-weight: bold;
					font-size: 35rpx;
				}
				.order-status {
				}
				.f-active-color {
				}
			}
			.item-content {
				display: flex;
				margin-bottom: 10rpx;

				.goods-img {
					width: 180rpx;
					height: 180rpx;
					padding-left: 30rpx;
				}
				.goods- {
					flex: 1;
					display: flex;
					justify-content: space-between;
					padding: 10rpx 30rpx;
					.goods-details {
						.goods-name {
						}
						.goods-color {
						}
						.f-color {
							@extend .fs-25rpx;
						}
						.goods-size {
						}
						.refund {
							@extend .fs-25rpx;
						}
						.f-active-color {
						}
					}
					.goods-condition {
						.goods-price {
							@extend .fs-25rpx;
							display: flex;
							align-items: center;
							.pprice {
								font-weight: bold;
								font-size: 36rpx;
							}
						}
						.goods-num {
							@extend .fs-25rpx;

							display: flex;
							justify-content: flex-end;
						}
					}
				}
			}

			.item-amounts {
				padding: 10rpx 30rpx;
				display: flex;
				justify-content: flex-end;
				.amounts {
					@extend .fs-25rpx;
					display: flex;
					align-items: center;
					.price {
						font-weight: bold;
						font-size: 36rpx;
					}
				}
			}
			.item-bottom-button {
				padding: 10rpx 0 20rpx;
				margin-right: 10rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.more {
					padding-left: 20rpx;
				}
				.bottom-button {
					display: flex;
					// justify-content: flex-end;
					& > view {
						padding: 15rpx 20rpx;
						margin: 0 10rpx;
						background-color: #f3f3f3;
					}
					.add-cart {
					}
					.again-payment {
					}
					.again {
						background-color: #49bdfb;
						color: #fff;
					}
				}
			}
		}
	}
</style>
