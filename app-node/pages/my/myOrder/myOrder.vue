<template>
	<view class="my-order">
		<Lines />

		<scroll-view scroll-x="true" :scroll-into-view="scrollIntoIndex" class="scroll-content">
			<view
				class="scroll-item"
				:id="'top' + index"
				v-for="(item, index) in orderBar"
				:key="item._id"
				@click="changeTab(index)">
				<text :class="topBarIndex == index ? 'f-active-color' : 'f-color'">{{ item.name }}</text>
			</view>
		</scroll-view>
		<Lines />

		<swiper @change="onChangeTab" :current="topBarIndex" :style="`height:${clentHeight}px;`">
			<swiper-item v-for="(item, index) in newTopBar" :key="item._id">
				<scroll-view
					scroll-y
					:style="`height:${clentHeight}px;`"
					@scrolltolower="loadMore(index)"
					class="bg-active-color">
					<view class="order-content">
						<view class="order-item" v-for="item in 5" :key="item">
							<view class="item-top">
								<view class="order-status f-active-color">待买家支付</view>
							</view>
							<view class="item-content">
								<image class="goods-img" src="../../../static/imgs/xxmLogo.png" mode="" />
								<view class="goods-">
									<view class="goods-details">
										<view class="goods-name">毛衣</view>
										<view class="goods-color f-color">颜色分类：黑色</view>
										<view class="refund f-active-color">7天无理由退换</view>
									</view>

									<view class="goods-condition">
										<view class="goods-price"
											>￥
											<view class="price">299.99</view>
										</view>
										<view class="goods-num">x 1</view>
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
						</view>
					</view>

					<!-- <view class="no-order">
						<view>你还没有订单</view>
						<view class="no-order-home" @click="goHome">去首页逛逛吧</view>
					</view> -->
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { onLoad, onReady } from '@dcloudio/uni-app';

	import Lines from '@/components/common/Lines.vue';

	import { getNavBarHeight } from '@/utils/system.ts';
	import { getMyOrderBar } from '@/api/apis.ts';

	// 内容块的高度值
	const clentHeight = ref(0);
	onReady(() => {
		uni.getSystemInfo({
			success: (res) => {
				// getNavBarHeight状态栏高度
				clentHeight.value = res.windowHeight - getNavBarHeight.value;
			},
		});
	});

	// 顶部tab
	const orderBar = ref([]);
	// 滑块数据
	const newTopBar = ref([]);

	const getMyOrderBarData = async () => {
		const res = await getMyOrderBar();
		orderBar.value = res.orderBar;
		newTopBar.value = res.orderBar;
		console.log(res);
	};

	onLoad(() => {
		getMyOrderBarData();
	});

	// 选中索引
	const topBarIndex = ref(0);
	// 顶部tab跟随索引
	const scrollIntoIndex = ref('top0');

	// 点击顶部tab
	const changeTab = (index) => {
		if (topBarIndex.value == index) {
			return;
		}
		topBarIndex.value = index;

		scrollIntoIndex.value = 'top' + index;

		console.log(topBarIndex.value, scrollIntoIndex.value);

		// // 首次滑动
		// if (newTopBar.value[topBarIndex.value].load == 'first') {
		// 	addData();
		// }
	};

	// 滑动swiper
	const onChangeTab = (e) => {
		changeTab(e.detail.current);
	};

	// 上拉加载更多
	const loadMore = (index) => {
		// newTopBar.value[index].loadText = '加载中...';
		// addData();
	};

	// 跳转到首页
	const goHome = () => {
		uni.switchTab({
			url: '/pages/tabBar/index/index',
		});
	};
</script>

<style lang="scss" scoped>
	.fs-25rpx {
		font-size: 25rpx;
	}
	.my-order {
		.scroll-content {
			width: 100%;
			height: 80rpx;
			white-space: nowrap;
			.scroll-item {
				display: inline-block;
				padding: 10rpx 30rpx;
				font-size: 36rpx;
			}
			#top {
			}
		}

		.order-content {
			.order-item {
				background-color: #fff;
				margin-bottom: 20rpx;
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
								@extend .fs-25rpx;
							}
							.f-color {
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
								.price {
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
		.no-order {
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			height: 100%;
			.no-order-home {
				padding: 10rpx 20rpx;
				margin: 20rpx 0;
				border: 1px solid #49bdfb;
				border-radius: 40rpx;
				color: #49bdfb;
			}
		}
	}
</style>
