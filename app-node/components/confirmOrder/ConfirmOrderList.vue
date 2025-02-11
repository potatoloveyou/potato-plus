<template>
	<view class="confirm-order-list">
		<view class="confirm-order-item" v-for="(item, index) in orderManageStore.confirmOrderList" :key="item._id">
			<view class="item-top">
				<image class="goods-img" :src="item.goodsDetails.imgUrl" mode="" />
				<view class="goods-details">
					<view class="goods-name">{{ item.goodsDetails.name }}</view>
					<view class="goods-color f-color">颜色：{{ item.selectedAttributes.color }}</view>
					<views class="goods-size f-color">大小：{{ item.selectedAttributes.size }}</views>
				</view>
				<view class="goods-condition">
					<view class="goods-price">
						<view class="goods-pprice">折后￥{{ item.goodsDetails.pprice }}</view>
						<view class="goods-oprice f-color">￥{{ item.goodsDetails.oprice }}</view>
					</view>
					<uni-number-box :min="1" v-model="item.quantity" />
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
				<uni-list-item class="uni-list-item" showArrow>
					<template v-slot:body>
						<text class="slot-box slot-text fs-28rpx">备注</text>
					</template>
					<template v-slot:footer>
						<view class="item-text fs-28rpx">
							<text class="notes">无备注</text>
						</view>
					</template>
				</uni-list-item>
			</uni-list>
		</view>
	</view>
</template>

<script setup>
	import { ref, computed } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';


	import { useOrderManageStore } from '@/stores/orderManage';
	const orderManageStore = useOrderManageStore();
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
					justify-content: space-between;
					.goods-price {
						@extend .df-fdc;
						align-items: flex-end;
						.goods-pprice {
							font-size: 36rpx;
							font-weight: bold;
							color: #49bdfb;
						}
						.goods-oprice {
							font-size: 26rpx;
						}
						.f-color {
						}
					}
				}
			}
			.uni-list {
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
							color: #999;
						}
					}
				}
			}
			.item-bottom {
			}
		}
	}
</style>
