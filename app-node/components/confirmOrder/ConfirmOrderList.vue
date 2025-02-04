<template>
	<view class="confirm-order-list">
		<view class="confirm-order-item" v-for="(item, index) in shoppingCartStore.confirmOrderList" :key="item._id">
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

			<uni-list class="item-bottom">
				<uni-list-item title="列表文字" showArrow showExtraIcon :extraIcon="{ type: 'location' }"></uni-list-item>
			</uni-list>
		</view>
	</view>
</template>

<script setup>
	import { ref, computed } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';

	import { useShoppingCartStore } from '@/stores/shoppingCart';
	const shoppingCartStore = useShoppingCartStore();

	onLoad(() => {
		shoppingCartStore.confirmOrderList = shoppingCartStore.selectedItems;
	});
</script>

<style lang="scss" scoped>
	.df-aic {
		display: flex;
		align-items: center;
	}
	.confirm-order-list {
		margin-top: 20rpx;
		.confirm-order-item {
			background-color: #fff;
			margin-bottom: 20rpx;
			padding: 0 20rpx;
			.item-top {
				display: flex;
				.goods-img {
					width: 180rpx;
					height: 180rpx;
				}
				.goods-details {
					flex: 1;
					padding-left: 20rpx;
					.goods-name {
						font-size: 32rpx;
						font-weight: bold;
					}
					.goods-color {
					}
					.f-color {
						font-size: 26rpx;
					}
					.goods-size {
					}
				}
				.goods-condition {
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					.goods-price {
						display: flex;
						flex-direction: column;
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
			.item-bottom {
			}
		}
	}
</style>
