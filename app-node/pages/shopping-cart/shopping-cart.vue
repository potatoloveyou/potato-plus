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
			<view class="shop-item" v-for="(item, index) in shoppingCartStore.cartList" :key="item._id">
				<label class="radio" @click="toggleItemSelection({ id: item._id })">
					<radio value="" color="#ff3333" :checked="item.checked" />
				</label>
				<image class="goods-img" :src="item.imgUrl" mode=""></image>
				<view class="goods-details">
					<view class="goods-name">{{ item.name }}</view>
					<view class="goods-color f-color">颜色分类：{{ item.color }}</view>
					<view class="goods-condition">
						<view class="goods-price">￥{{ item.pprice }}</view>
						<view class="goods-num-switch">
							<view class="goods-num" v-if="!item.checked" @click="toggleModifyMode({ id: item._id })">
								x{{ item.num }}
							</view>
							<view class="goods-num-box" v-else>
								<uni-number-box
									:min="1"
									v-model="item.num"
									@change="changeValue({ value: $event, id: item._id })"
									@blur="close" />
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="shop-bottom">
			<label class="radio" @click="checkAllSwitch">
				<radio value="" color="#ff3333" :checked="shoppingCartStore.isCheckAll" />
				<text>全选</text>
			</label>

			<view class="shopping-all" :class="!isEdit ? 'active' : ''">
				<view class="amounts">
					合计:
					<text class="amounts-num">￥{{ shoppingCartStore.amounts }}</text>
				</view>
				<view class="settlement">
					结算
					<text>({{ shoppingCartStore.selectedItems.length }})</text>
				</view>
			</view>

			<view class="shopping-edit" :class="!isEdit ? 'active' : ''">
				<view class="move-collect">移入收藏</view>
				<view class="delete" @click="deleteGoods">删除</view>
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

// 编辑按钮状态
const isEdit = ref(true);
// 编辑按钮
const toggleEditMode = () => {
	isEdit.value = !isEdit.value;
};

// 点击切换数量组件
const toggleModifyMode = shoppingCartStore.toggleItemSelection;

const close = () => {
	console.log(123);
};

// 修改购买数量
const changeValue = shoppingCartStore.updateItemNum;

// 切换单个商品选中状态
const toggleItemSelection = shoppingCartStore.toggleItemSelection;

// 全选商品
const checkAllSwitch = shoppingCartStore.checkAllSwitch;

// 删除选中商品
const deleteGoods = shoppingCartStore.deleteGoods;

onLoad(() => {
	// console.log(shoppingCartStore.amounts);
});
</script>

<style lang="scss" scoped>
.bottom-button {
	color: #fff;
	font-size: 32rpx;
	line-height: 100rpx;
	// padding: 0 40rpx;s
	width: 180rpx;
	text-align: center;
	box-sizing: border-box;
}
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
		background-color: #f3f3f3;
		min-height: 100vh;
		.shop-item {
			display: flex;
			align-items: center;
			padding: 30rpx 20rpx;
			margin-bottom: 20rpx;
			background-color: #fff;
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
				// display: flex;
				// flex-direction: column;
				// justify-content: space-between;
				& > view {
					padding-bottom: 20rpx;
				}
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
					.goods-num-switch {
						.goods-num {
							width: 45rpx;
							height: 45rpx;
							background-color: #eaeaea;
							display: flex;
							justify-content: center;
							align-items: center;
						}
						.goods-num-box {
						}
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
		.shopping-all {
			display: flex;
			align-items: center;
			position: absolute;
			right: 0;
			transition: transform 0.3s ease-in-out; /* 平滑移动动画 */
			transform: translateY(0%);
			&.active {
				transform: translateY(100%);
			}
			.amounts {
				padding: 0 20rpx;
				.amounts-num {
					color: #49bdfb;
				}
			}
			.settlement {
				background-color: #49bdfb;
				@extend .bottom-button;
			}
		}
		.shopping-edit {
			display: flex;
			align-items: center;
			position: absolute;
			right: 0;
			transition: transform 0.3s ease-in-out; /* 平滑移动动画 */
			transform: translateX(101%);

			&.active {
				transform: translateX(0);
			}

			.move-collect {
				background-color: #000;
				@extend .bottom-button;
			}
			.delete {
				background-color: red;
				@extend .bottom-button;
			}
		}
	}
}
</style>