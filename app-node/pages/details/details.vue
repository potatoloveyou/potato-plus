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

		<!-- 		<view class="details-foot" :class="!isPopup ? 'active' : ''">
			<view class="foot-content">
				<view class="iconfont icon-xiaoxi"></view>
				<view class="iconfont icon-gouwuche" @click="goShoppingCart"></view>

				<uni-icons class="iconfont" type="chat" size="30"></uni-icons>
				<uni-icons class="iconfont" type="cart" size="30" @click="goShoppingCart"></uni-icons>
				<view class="content-text add-shopcart" @click="openCollectPopup">加入购物车</view>
				<view class="content-text purchase">立即购买</view>
			</view>
			<view class="safe-area-inset-bottom"></view>
		</view> -->

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
			<!--  -->
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
							<view class="goods-limit">可购5件</view>
							<view class="text">请选择 尺码</view>
						</view>
					</view>
					<Linse />

					<view class="goods-colour">
						<view class="colour-title">颜色分类</view>
						<view class="colour">
							<view class="colour-tiem">透明</view>
						</view>
					</view>
					<Linse />
					<view class="goods-num">
						<text class="goods-num-name">购买数量</text>
						<uni-number-box :min="1" v-model="goodsNum" @change="changeValue({ value: $event, id: goodsDetail._id })" />
					</view>
					<Linse />
				</view>

				<button class="pop-confirm" @click="addShopCart">确认</button>

				<view class="safe-area-inset-bottom"></view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
	import { ref, watch } from 'vue';
	import { onLoad, onReady, onShareAppMessage, onShareTimeline, onNavigationBarButtonTap } from '@dcloudio/uni-app';

	import Card from '@/components/common/Card.vue';
	import CommodityList from '@/components/common/CommodityList.vue';
	import Linse from '@/components/common/Lines.vue';

	import { getGoodsDetail } from '@/api/apis.ts';

	import { useShoppingCartStore } from '@/stores/shoppingCart';
	const shoppingCartStore = useShoppingCartStore();

	// 商品详情数据
	const goodsDetail = ref({});
	const getGoodsDetailData = async (id) => {
		let res = await getGoodsDetail(id);
		goodsDetail.value = res.data;
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
	const changeValue = ({ value }) => {};

	// 确认添加到购物车
	const addShopCart = () => {
		// 使用浅拷贝，避免直接修改响应式对象
		let goods = { ...goodsDetail.value };
		goods['checked'] = false;
		goods['num'] = goodsNum.value;
		shoppingCartStore.addShopCart(goods);

		options.value[2].info = shoppingCartStore.getCartItemQuantity(goodsDetail.value._id);
		uni.showToast({
			title: '已加入购物车',
			icon: 'none',
		});
		closeCollectPopup();
	};

	// 底部左侧点击事件
	const onClick = (event) => {
		// console.log(event);
		switch (event.content.icon) {
			case 'chat':
				console.log('客服');
				break;
			case 'shop':
				console.log('店铺');
				break;
			case 'cart':
				uni.switchTab({
					url: '/pages/tabBar/shoppingCart/shoppingCart',
				});
				break;
			default:
				break;
		}
	};

	// 编辑按钮状态
	const isPopup = ref(true);
	// 加入购物车弹窗
	const collectPopup = ref(null);
	// 右侧按钮组点击事件
	const buttonClick = (event) => {
		// console.log(event);
		switch (event.content.text) {
			case '加入购物车':
				collectPopup.value.open();
				isPopup.value = !isPopup.value;
				break;
			case '立即购买':
				console.log('立即购买');
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
			path: `/pages/details/details?id=${goodsDetail.value._id}`,
		};
	});

	// 分享朋友圈(用不了，得认证小程序、花钱才可以开通分享朋友圈)
	onShareTimeline(() => {
		return {
			title: goodsDetail.value.name,
			path: `/pages/details/details?id=${goodsDetail.value._id}`,
		};
	});

	onNavigationBarButtonTap((e) => {
		if (e.type == 'share') {
			uni.share({
				provider: 'weixin',
				type: 0,
				scene: 'WXSceneSession',
				title: goodsDetail.value.name,
				href: `/pages/details/details?id=${goodsDetail.value._id}`,
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
						// position: absolute;
						padding-bottom: 30rpx;
						// transform: translateX(300rpx);
						padding-left: 300rpx;
						& > view {
							padding-bottom: 2rpx;
						}
						.pprice {
							color: #49bdfb;
							font-size: 42rpx;
						}
						.goods-limit {
						}
						.text {
						}
					}
				}
				.goods-colour {
					padding: 20rpx 0;
					.colour-title {
						font-weight: bold;
						padding-bottom: 10rpx;
					}
					.colour {
						.colour-tiem {
						}
					}
				}
				.goods-num {
					padding: 20rpx 0;
					display: flex;
					justify-content: space-between;
				}
			}
			.pop-confirm {
				width: 100%;
				text-align: center;
				color: #fff;
				// padding: 20rpx 0;
				background-color: #49bdfb;
			}
		}
	}
</style>
