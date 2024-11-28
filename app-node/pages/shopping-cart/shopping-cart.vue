<template>
	<view class="shopping-cart">
		<NavBar>
			<template #titleBar-slot>
				<view class="wx-app-index-nav">
					<view class="nav-left">
						<view class="iconfont icon-xiaoxi"></view>
						<view class="edit-switch" @click="toggleEditMode">
							<view class="edit" v-if="isEdit">编辑</view>
							<view class="edit" v-else>完成</view>
						</view>
					</view>
					<text class="nav-text">购物车</text>
					<view></view>
				</view>
			</template>
		</NavBar>

		<view class="shop-list">
			<view class="shop-item" v-for="(item, index) in shoppingCartStore.cartList" :key="item.id">
				<label class="radio" @click="toggleItemSelection(item.id)">
					<radio value="" color="#ff3333" :checked="item.checked" />
				</label>
				<image class="goods-img" :src="item.imgUrl" mode=""></image>
				<view class="goods-details">
					<view class="goods-name">{{ item.name }}</view>
					<view class="goods-color f-color">颜色分类：{{ item.color }}</view>
					<view class="goods-condition">
						<view class="goods-price">￥{{ item.pprice }}</view>
						<view class="goods-num">*{{ item.num }}</view>
					</view>
				</view>
			</view>
		</view>

		<view class="shop-bottom">
			<label class="radio" @click="checkAllSwitch">
				<radio value="" color="#ff3333" :checked="shoppingCartStore.isCheckAll" />
				<text>全选</text>
			</label>
			<view class="price-all">
				<view class="amounts">
					合计:
					<text class="amounts-num">￥{{ shoppingCartStore.amounts }}</text>
				</view>
				<view class="settlement">
					结算
					<text>({{ shoppingCartStore.selectedItems.length }})</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad, onReady } from '@dcloudio/uni-app';
import NavBar from '@/components/common/NavBar.vue';

import { useShoppingCartStore } from '@/stores/shoppingCart';
const shoppingCartStore = useShoppingCartStore();

const isEdit = ref(true);
// 编辑按钮
const toggleEditMode = () => {
	isEdit.value = !isEdit.value;
};

// 切换单个商品选中状态
const toggleItemSelection = shoppingCartStore.toggleItemSelection;

// 全选商品
const checkAllSwitch = shoppingCartStore.checkAllSwitch;

onLoad(() => {
	console.log(shoppingCartStore.amounts);
});
</script>

<style lang="scss" scoped>
.shopping-cart {
	.wx-app-index-nav {
		width: 100%;
		display: flex;
		justify-content: center;

		& > view {
			flex: 1;
		}
		.nav-left {
			display: flex;
			align-items: center;
			& > view {
				padding-left: 40rpx;
			}
			.iconfont {
				font-size: 50rpx;
				// padding-left: 50rpx;
			}
			.edit-switch {
				.edit {
					font-size: 34rpx;
					color: #636363;
				}
			}
		}
		.nav-text {
			font-size: 40rpx;
		}
	}

	.shop-list {
		padding-bottom: 100rpx;
		.shop-item {
			display: flex;
			align-items: center;
			padding: 20rpx;
			background-color: #f7f7f7;
			margin: 10rpx;
			.radio {
			}
			.goods-img {
				width: 200rpx;
				height: 200rpx;
			}
			.goods-details {
				flex: 1;
				height: 200rpx;
				padding-left: 20rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.goods-name {
				}
				.goods-color {
					font-size: 24rpx;
				}
				.goods-condition {
					display: flex;
					justify-content: space-between;
					.goods-price {
					}
					.goods-num {
					}
				}
			}
		}
	}

	.shop-bottom {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 100rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-top: 2rpx solid #cccccc;
		background-color: #fff;
		.radio {
			padding-left: 20rpx;
		}
		.price-all {
			display: flex;
			align-items: center;
			.amounts {
				padding: 0 20rpx;
				.amounts-num {
					color: #49bdfb;
				}
			}
			.settlement {
				background-color: #49bdfb;
				color: #fff;
				font-size: 36rpx;
				line-height: 100rpx;
				padding: 0 40rpx;
			}
		}
	}
}
</style>
