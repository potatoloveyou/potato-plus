<template>
	<view class="details">
		<swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<!-- 			<swiper-item v-for="(item, index) in swiperList" :key="index">
				<view class="swiper-item">
					<image class="swiper-img" :src="item.imgUrl" mode=""></image>
				</view>
			</swiper-item> -->
			<swiper-item>
				<view class="swiper-item">
					<image class="swiper-img" :src="goodsDetail.imgUrl" mode=""></image>
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
		<template>
			<Card cardName="看了又看" />
			<CommodityList :dataList="dataList" />
		</template>

		<view class="details-foot">
			<view class="foot-content">
				<view class="iconfont icon-xiaoxi"></view>
				<view class="iconfont icon-gouwuche"></view>
				<view class="content-text add-shopcart" @click="openCollectPopup">加入购物车</view>
				<view class="content-text purchase">立即购买</view>
			</view>
			<view class="safe-area-inset-bottom"></view>
		</view>

		<uni-popup ref="collectPopup" type="bottom" :is-mask-click="true" :safe-area="false">
			<view class="collectPopup">
				<view class="pop-content">
					<view class="popHeader">
						<view class="close" @click="closeCollectPopup">
							<uni-icons type="closeempty" size="=18" color="#999" />
						</view>
					</view>
					<view>
						<image class="pop-img" src="/static/imgs/xxmLogo.png" mode=""></image>
					</view>
					<Linse />
					<view class="goods-colour">
						<text>颜色分类</text>
						<view class="colour">
							<view class="colour-tiem">透明</view>
						</view>
					</view>
					<Linse />
					<view class="goods-num">
						<text class="goods-num-name">购买数量</text>
						<uni-number-box :min="1" v-model="vModelValue" @change="changeValue" />
					</view>
					<Linse />
				</view>

				<view class="pop-confirm">确认</view>
				<view class="safe-area-inset-bottom"></view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad, onShareAppMessage, onShareTimeline, onNavigationBarButtonTap } from '@dcloudio/uni-app';

import Card from '@/components/common/Card.vue';
import CommodityList from '@/components/common/CommodityList.vue';
import Linse from '@/components/common/Lines.vue';

import { getGoodsDetail } from '@/api/apis.ts';

const goodsDetail = ref({});
const getGoodsDetailData = async (id) => {
	let res = await getGoodsDetail(id);
	goodsDetail.value = res.data;
	console.log(goodsDetail.value);
};

onLoad((e) => {
	getGoodsDetailData(e.id);
});

const swiperList = ref([]);
swiperList.value = [
	{
		imgUrl: '/static/imgs/banner1.jpg',
	},
	{
		imgUrl: '/static/imgs/banner2.jpg',
	},
	{
		imgUrl: '/static/imgs/banner3.jpg',
	},
];

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

// 加入购物车弹窗
const collectPopup = ref(null);
const openCollectPopup = () => {
	collectPopup.value.open();
};

// 关闭info弹窗
const closeCollectPopup = () => {
	collectPopup.value.close();
};

const vModelValue = ref(1);
// 修改购买数量
const changeValue = (value) => {
	// console.log(123);
	console.log(vModelValue.value);
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
		.foot-content {
			@extend .df-aic;
			height: 100rpx;
			.iconfont {
				width: 60rpx;
				height: 60rpx;
				@extend .df-aic;
				justify-content: center;
				border-radius: 100%;
				background-color: #000;
				color: #fff;
				margin: 0 20rpx;
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
			.popHeader {
				display: flex;
				justify-content: flex-end;
				.close {
					padding: 0 6rpx;
				}
			}
			.pop-img {
				width: 260rpx;
				height: 260rpx;
			}
			.goods-colour {
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
			padding: 20rpx 0;
			background-color: #49bdfb;
		}
	}
}
</style>