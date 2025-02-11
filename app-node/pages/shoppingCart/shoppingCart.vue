<template>
	<view class="shoppingCart">
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
			<scroll-view scroll-y :style="`height:${clentHeight}px;`">
				<view class="shop-item" v-for="(item, index) in shoppingCartStore.cartList" :key="item._id">
					<label class="radio">
						<radio
							value=""
							color="#49bdfb"
							:checked="item.checked"
							@click="toggleItemSelection({ id: item.goodsDetails._id })" />
					</label>
					<image
						class="goods-img"
						:src="item.goodsDetails.imgUrl"
						mode=""
						@click="goDetails(item.goodsDetails._id)"></image>
					<view class="goods-details">
						<view class="goods-name" @click="goDetails(item.goodsDetails._id)">{{ item.goodsDetails.name }}</view>
						<view class="goods-color f-color">颜色分类：{{ item.selectedAttributes.color }}</view>
						<view class="goods-size f-color">大小：{{ item.selectedAttributes.size }}</view>

						<view class="goods-condition">
							<view class="goods-price">￥{{ item.goodsDetails.pprice }}</view>
							<view class="goods-num-switch">
								<view class="goods-num" v-if="!item.checked" @click="toggleModifyMode({ id: item.goodsDetails._id })">
									x{{ item.quantity }}
								</view>
								<view class="goods-num-box" v-else>
									<uni-number-box
										:min="1"
										v-model="item.quantity"
										@change="updateShoppingCart({ value: $event, item })" />
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<view class="shop-bottom">
			<label class="radio">
				<radio value="" color="#49bdfb" :checked="shoppingCartStore.isCheckAll" @click="checkAllSwitch" />
				<text>全选</text>
			</label>

			<view class="shopping-all" :class="!isEdit ? 'active' : ''">
				<view class="amounts">
					合计:
					<text class="amounts-num">￥{{ shoppingCartStore.amounts }}</text>
				</view>
				<view class="settlement" @click="settlement">
					结算
					<text v-if="shoppingCartStore.selectedItems.length">({{ shoppingCartStore.selectedItems.length }})</text>
				</view>
			</view>

			<view class="shopping-edit" :class="!isEdit ? 'active' : ''">
				<view class="move-collect">移入收藏</view>
				<view class="delete" @click="deleteShoppingCartGoods">删除</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { onLoad, onReady, onShow } from '@dcloudio/uni-app';
	import NavBar from '@/components/common/NavBar.vue';

	import { getAccessToken, getRefreshToken } from '@/utils/token.ts';

	// 定义登录页面
	let loginPage = '';
	// #ifdef MP-WEIXIN
	loginPage = '/subPackages/login/weixinLogin/weixinLogin';
	// #endif

	// #ifdef APP
	loginPage = '/subPackages/login/appLogin/appLogin';
	// #endif

	const checkLogin = () => {
		if (!getAccessToken() || !getRefreshToken()) {
			uni.reLaunch({ url: loginPage }); // 确保跳转生效
		}
	};

	onShow(() => {
		checkLogin();
	});

	import { useShoppingCartStore } from '@/stores/shoppingCart';
	const shoppingCartStore = useShoppingCartStore();

	import { useOrderManageStore } from '@/stores/orderManage';
	const orderManageStore = useOrderManageStore();

	import { getUserShoppingCart, delUserShoppingCart, updateUserShoppingCart } from '@/api/apis.ts';

	import { getNavBarHeight } from '@/utils/system.ts';
	// 内容块的高度值
	const clentHeight = ref(0);
	onReady(() => {
		uni.getSystemInfo({
			success: (res) => {
				// getNavBarHeight状态栏高度
				clentHeight.value = res.windowHeight - uni.upx2px(100) - getNavBarHeight.value;
			},
		});
	});

	// 获取购物车数据
	const getUserShoppingCartData = async () => {
		const res = await getUserShoppingCart();

		// 如果接口返回的数据中包含商品列表
		if (res?.data) {
			// 为每个商品添加 checked 属性，并存储到 Pinia
			shoppingCartStore.cartList = res.data.map((item) => ({
				...item, // 保留原有的商品属性
				checked: false, // 默认未选中
			}));
		} else {
			console.warn('购物车数据为空');
			shoppingCartStore.cartList = [];
		}
	};

	onLoad(() => {
		// getUserShoppingCartData();
	});

	// 编辑按钮状态
	const isEdit = ref(true);
	// 编辑按钮
	const toggleEditMode = () => {
		isEdit.value = !isEdit.value;
	};

	// 点击切换数量组件
	const toggleModifyMode = shoppingCartStore.toggleItemSelection;

	// 切换单个商品选中状态
	const toggleItemSelection = shoppingCartStore.toggleItemSelection;

	// 全选商品
	const checkAllSwitch = shoppingCartStore.checkAllSwitch;

	// 删除商品
	const deleteShoppingCartGoods = async () => {
		try {
			// 新增 / 修改的临时数据;
			const tempShoppingCart = {
				shoppingCartItemIds: [],
			};

			shoppingCartStore.selectedItems.forEach((item) => {
				tempShoppingCart.shoppingCartItemIds.push(item._id);
			});
			// console.log(tempShoppingCart);

			const res = await delUserShoppingCart(tempShoppingCart);
			await getUserShoppingCartData();
			uni.removeTabBarBadge({
				index: 2,
			});
		} catch (error) {}
	};

	// 输入框值改变时触发更新购物车商品数量
	const updateShoppingCart = async ({ value, item }) => {
		// 新增 / 修改的临时数据;
		const tempShoppingCart = {
			shoppingCartItemId: item._id,
			quantity: value,
		};

		const res = await updateUserShoppingCart(tempShoppingCart);
		// console.log(res);
	};

	// 结算
	const settlement = () => {
		if (shoppingCartStore.selectedItems.length) {
			orderManageStore.confirmOrderList = shoppingCartStore.selectedItems;

			uni.navigateTo({
				url: '/subPackages/order/confirmOrder/confirmOrder',
			});
			return;
		}
		uni.showToast({ title: '你还没有选择商品哦~', icon: 'none' });
	};

	// 跳转到商品详情页
	const goDetails = (id) => {
		// console.log(id);
		uni.navigateTo({
			url: `/subPackages/details/details?id=${id}`,
		});
	};
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
	.shoppingCart {
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
				.icon-xiaoxi {
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
					& > view {
						padding-bottom: 10rpx;
					}
					.goods-name {
					}
					.f-color {
						font-size: 24rpx;
					}
					.goods-color {
						// font-size: 24rpx;
					}
					.goods-size {
						// font-size: 24rpx;
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
			.active {
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
