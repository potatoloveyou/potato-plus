<template>
	<view class="details">
		<swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item>
				<view class="swiper-item">
					<image class="swiper-img" :src="goodsDetail.imgUrl" mode="aspectFit"></image>
				</view>
			</swiper-item>
		</swiper>

		<view class="details-goods">
			<view class="price">
				<view class="pprice">￥{{ goodsDetail.pprice }}</view>
				<view class="oprice">原价￥{{ goodsDetail.oprice }}</view>
			</view>
			<text class="goods-name">{{ goodsDetail.name }}</text>
		</view>

		<view>
			<image class="details-img" src="../../static/imgs/more.jpg" mode=""></image>
			<image class="details-img" src="../../static/imgs/more.jpg" mode=""></image>
			<image class="details-img" src="../../static/imgs/more.jpg" mode=""></image>
			<image class="details-img" src="../../static/imgs/more.jpg" mode=""></image>
			<image class="details-img" src="../../static/imgs/more.jpg" mode=""></image>
		</view>
		<view>
			<Card cardName="看了又看" />
			<CommodityList :dataList="dataList" />
		</view>

		<view class="details-foot" :class="!isPopup ? 'active' : ''">
			<uni-goods-nav
				:fill="true"
				:options="options"
				:button-group="customButtonGroup"
				@click="onClick"
				@buttonClick="buttonClick" />
			<view class="safe-area-inset-bottom"></view>
		</view>

		<uni-popup ref="collectPopup" type="bottom" :is-mask-click="false" :safe-area="false" v-model:show="isPopup">
			<view class="collectPopup">
				<view class="pop-content">
					<view class="popHeader">
						<view class="close" @click="closeCollectPopup">
							<uni-icons type="closeempty" size="=18" color="#999" />
						</view>
					</view>

					<view class="goods-intro">
						<image class="pop-img" :src="goodsDetail.imgUrl" mode=""></image>

						<view class="goods-information">
							<view class="pprice">￥333</view>
							<view class="goods-quantity">
								<view class="goods-limit">可购5件</view>
								<view class="goods-stock">库存{{ goodsDetail.stock }}</view>
							</view>
							<view class="text">请选择 尺码</view>
						</view>
					</view>
					<Linse />

					<view class="goods-option">
						<view class="option-title">颜色:</view>
						<view class="option">
							<view
								class="option-tiem"
								:class="selectedAttributes.color == item ? 'click' : ''"
								v-for="item in goodsDetail?.attributes?.color"
								:key="item"
								@click="selectAttribute('color', item)">
								{{ item }}
							</view>
						</view>
					</view>
					<Linse />
					<view class="goods-option">
						<view class="option-title">尺寸:</view>
						<view class="option">
							<view
								class="option-tiem"
								:class="selectedAttributes.size == item ? 'click' : ''"
								v-for="item in goodsDetail?.attributes?.size"
								:key="item"
								@click="selectAttribute('size', item)">
								{{ item }}
							</view>
						</view>
					</view>
					<Linse />
					<view class="goods-num">
						<text class="goods-num-name">购买数量</text>
						<uni-number-box :min="1" v-model="goodsNum" />
					</view>
					<Linse />
				</view>

				<button class="pop-confirm" @click="checkSwitch">确认</button>

				<view class="safe-area-inset-bottom"></view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { onLoad, onReady, onShareAppMessage, onShareTimeline, onNavigationBarButtonTap } from '@dcloudio/uni-app';

	import Card from '@/components/common/Card.vue';
	import CommodityList from '@/components/common/CommodityList.vue';
	import Linse from '@/components/common/Lines.vue';

	import { getGoodsDetail, getUserShoppingCart, addUserShoppingCart } from '@/api/apis.ts';

	import { useShoppingCartStore } from '@/stores/shoppingCart';
	const shoppingCartStore = useShoppingCartStore();

	import { useOrderManageStore } from '@/stores/orderManage';
	const orderManageStore = useOrderManageStore();

	// 商品详情数据
	const goodsDetail = ref({});
	const getGoodsDetailData = async (id) => {
		const res = await getGoodsDetail(id);
		goodsDetail.value = res.data;
		// console.log(goodsDetail.value);
	};

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
			shoppingCartStore.cartList = [];
		}
		console.log(shoppingCartStore.cartList);
	};

	onLoad((e) => {
		getGoodsDetailData(e.id);
	});

	const dataList = ref([]);
	dataList.value = [
		{
			id: 1,
			imgUrl: '/static/imgs/classify1.jpg',
			name: '阿德杀杀毒哈师大哈拉少等哈拉萨大叔大撒打算手打阿是、婶',
			pprice: '299',
			oprice: '699',
			discount: '5.2',
		},
		{
			id: 2,
			imgUrl: '/static/imgs/classify1.jpg',
			name: '阿德杀杀毒哈师大哈拉少等哈拉萨大叔大撒打算手打阿是、婶',
			pprice: '399',
			oprice: '699',
			discount: '5.2',
		},
		{
			id: 3,
			imgUrl: '/static/imgs/classify1.jpg',
			name: '阿德杀杀毒哈师大哈拉少等哈拉萨大叔大撒打算手打阿是、婶',
			pprice: '499',
			oprice: '699',
			discount: '5.2',
		},
		{
			id: 4,
			imgUrl: '/static/imgs/classify1.jpg',
			name: '阿德杀杀毒哈师大哈拉少等哈拉萨大叔大撒打算手打阿是、婶',
			pprice: '499',
			oprice: '699',
			discount: '5.2',
		},
	];

	// 底部左边
	const options = ref([]);
	options.value = [
		{
			icon: 'chat',
			text: '客服',
		},
		{
			icon: 'shop',
			text: '店铺',
			infoBackgroundColor: '#007aff',
			infoColor: '#f5f5f5',
		},
		{
			icon: 'cart',
			text: '购物车',
			info: 0,
		},
	];

	onReady(() => {
		options.value[2].info = shoppingCartStore.getCartItemQuantity(goodsDetail.value._id);
	});

	// 底部右边按钮
	const customButtonGroup = ref([]);
	customButtonGroup.value = [
		{
			text: '加入购物车',
			backgroundColor: 'linear-gradient(90deg, #1E83FF, #0053B8)',
			color: '#fff',
		},
		{
			text: '立即购买',
			backgroundColor: 'linear-gradient(90deg, #60F3FF, #088FEB)',
			color: '#fff',
		},
	];

	// 购买数量
	const goodsNum = ref(1);
	// 修改购买数量
	const changeValue = (value) => {};

	const selectedAttributes = ref({
		color: '',
		size: '',
	});
	const selectAttribute = (index, value) => {
		selectedAttributes.value[index] = value;
	};
	// 加入购物车
	const shoppingCartAdd = async () => {
		// 新增/修改的临时数据
		const tempShoppingCart = {
			goodsId: goodsDetail.value._id,
			quantity: goodsNum.value,
			selectedAttributes: selectedAttributes.value,
		};
		const res = await addUserShoppingCart(tempShoppingCart);
		await getUserShoppingCartData();
		options.value[2].info = shoppingCartStore.getCartItemQuantity(goodsDetail.value._id);

		if (res.code === 0) {
			uni.showToast({
				title: '加入购物车成功',
				icon: 'success',
			});
		} else {
			uni.showToast({
				title: '加入购物车失败',
				icon: 'none',
			});
		}
		closeCollectPopup();
	};

	// 确认下单
	const settlement = async () => {
		if (!selectedAttributes.value.color || !selectedAttributes.value.size) {
			uni.showToast({
				title: '请选择商品属性',
				icon: 'none',
			});
			return;
		}
		const tempOrder = {
			goodsDetails: goodsDetail.value,
			selectedAttributes: selectedAttributes.value,
			quantity: goodsNum.value,
		};
		orderManageStore.confirmOrderList = [];
		orderManageStore.confirmOrderList.push(tempOrder);
		uni.navigateTo({
			url: '/subPackages/order/confirmOrder/confirmOrder',
		});
	};

	const checkSwitch = () => {
		mark.value ? shoppingCartAdd() : settlement();
	};

	// 底部左侧点击事件
	const onClick = (event) => {
		switch (event.content.icon) {
			case 'chat':
				console.log('客服');
				break;
			case 'shop':
				console.log('店铺');
				break;
			case 'cart':
				uni.switchTab({
					url: '/pages/shoppingCart/shoppingCart',
				});
				break;
			default:
				break;
		}
	};

	// mark
	const mark = ref(true);
	// 是否展示底部添加商品组件
	const isPopup = ref(true);
	// 加入购物车弹窗
	const collectPopup = ref(null);
	// 右侧按钮组点击事件
	const buttonClick = (event) => {
		// console.log(event);
		isPopup.value = !isPopup.value;
		selectedAttributes.value = {
			color: '',
			size: '',
		};
		switch (event.content.text) {
			case '加入购物车':
				mark.value = true;
				collectPopup.value.open();
				break;
			case '立即购买':
				mark.value = false;
				collectPopup.value.open();
				break;
			default:
				break;
		}
	};

	// 关闭info弹窗
	const closeCollectPopup = () => {
		collectPopup.value.close();
		isPopup.value = !isPopup.value;
	};

	// 分享给好友
	onShareAppMessage(() => {
		return {
			title: goodsDetail.value.name,
			path: `/subPackages/details/details?id=${goodsDetail.value._id}`,
		};
	});

	// 分享朋友圈(用不了，得认证小程序、花钱才可以开通分享朋友圈)
	onShareTimeline(() => {
		return {
			title: goodsDetail.value.name,
			path: `/subPackages/details/details?id=${goodsDetail.value._id}`,
		};
	});

	onNavigationBarButtonTap((e) => {
		if (e.type == 'share') {
			uni.share({
				provider: 'weixin',
				type: 0,
				scene: 'WXSceneSession',
				title: goodsDetail.value.name,
				href: `/subPackages/details/details?id=${goodsDetail.value._id}`,
				imageUrl: goodsDetail.value.imgUrl,

				success(res) {
					uni.showTabBar({
						title: '分享成功',
					});
				},
				fail() {},
			});
		}
	});
</script>

<style lang="scss" scoped>
	.df-aic {
		display: flex;
		align-items: center;
	}
	::-webkit-scrollbar {
		display: none;
		width: 0;
		height: 0;
		color: transparent;
	}
	.details {
		padding-bottom: 100rpx;
		height: calc(100vh - 100rpx);
		overflow-y: auto;
		.swiper {
			width: 100%;
			height: 700rpx;
			.swiper-item {
				.swiper-img {
				}
			}
			.swiper-img {
				width: 100%;
				height: 700rpx;
			}
		}
		.details-goods {
			text-align: center;
			font-weight: bold;
			font-size: 36rpx;
			padding: 10rpx 0;
			.price {
				padding: 40rpx;
				.pprice {
					padding: 10rpx;
				}
				.oprice {
					text-decoration: line-through;
					font-size: 24rpx;
				}
			}
			.goods-name {
			}
		}
		.details-img {
			width: 100%;
		}

		.details-foot {
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100%;
			background-color: #fff;
			z-index: 999;
			transition: transform 0.3s ease-in-out; /* 平滑移动动画 */
			transform: translateY(0%);
			.safe-area-inset-bottom {
			}
			&.active {
				transform: translateY(100%);
			}
			.foot-content {
				@extend .df-aic;
				height: 100rpx;
				.iconfont {
					// width: 60rpx;
					// height: 60rpx;
					// @extend .df-aic;
					// justify-content: center;
					margin-left: 40rpx;
				}
				.content-text {
					margin: 0 30rpx;
					background-color: #000;
					color: #fff;
					padding: 15rpx 30rpx;
					border-radius: 40rpx;
				}
				.purchase {
					background-color: #49bdfb;
				}
			}
		}
		.active {
		}

		.collectPopup {
			background-color: #fff;
			border-radius: 30rpx 30rpx 0 0;
			max-height: 60vh;
			.pop-content {
				padding: 30rpx;
				position: relative;
				.popHeader {
					display: flex;
					justify-content: flex-end;
					.close {
						// padding: 0 6rpx;
						width: 40rpx;
						height: 40rpx;
						@extend .df-aic;
						justify-content: center;
						border: 1rpx solid #000;
						border-radius: 50%;
					}
				}
				.goods-intro {
					display: flex;
					padding-bottom: 30rpx;
					.pop-img {
						position: absolute;
						top: -5%;
						width: 260rpx;
						height: 260rpx;
					}
					.goods-information {
						padding-bottom: 30rpx;
						padding-left: 300rpx;
						& > view {
							padding-bottom: 2rpx;
						}
						.pprice {
							color: #49bdfb;
							font-size: 42rpx;
						}
						.goods-quantity {
							display: flex;
							justify-content: space-between;
							align-items: center;
							.goods-limit {
								// font-size: 24rpx;
								padding-right: 50rpx;
							}
							.goods-stock {
								color: #636363;
								font-size: 24rpx;
							}
						}
						.text {
						}
					}
				}
				.goods-option {
					padding: 20rpx 0;
					.option-title {
						font-weight: bold;
						padding-bottom: 10rpx;
					}
					.option {
						display: flex;
						.option-tiem {
							background-color: #99999930;
							padding: 10rpx;
							margin-right: 30rpx;
							width: 80rpx;
							text-align: center;
						}
						.click {
							background-color: #49bdfb;
							color: #fff;
						}
					}
				}
				.goods-option {
					.option-title {
					}
					.option {
						.option-tiem {
						}
						.active {
						}
					}
				}

				.goods-num {
					padding: 20rpx 0;
					display: flex;
					justify-content: space-between;
					.goods-num-name {
					}
				}
			}
			.pop-confirm {
				width: 100%;
				text-align: center;
				color: #fff;
				// padding: 20rpx 0;
				background-color: #49bdfb;
			}
			.safe-area-inset-bottom {
			}
		}
	}
</style>
