<template>
	<view class="my-order">
		<!-- <Lines /> -->

		<scroll-view scroll-x="true" :scroll-into-view="scrollIntoIndex" class="scroll-content">
			<view
				class="scroll-item"
				:id="'top' + index"
				v-for="(item, index) in variousBarStore.variousBar[0]?.order_bar"
				:key="item.id"
				@click="changeTab(index)">
				<text :class="topBarIndex == index ? 'f-active-color' : 'f-color'">{{ item.name }}</text>
			</view>
		</scroll-view>
		<!-- <Lines /> -->

		<swiper @change="onChangeTab" :current="topBarIndex" :style="`height:${clentHeight}px;`">
			<swiper-item v-for="(item, index) in variousBarStore.variousBar[0]?.order_bar" :key="item.id">
				<scroll-view
					class="bg-active-color"
					scroll-y
					:style="`height:${clentHeight}px;`"
					@scrolltolower="loadMore(index)">
					<!-- <view v-for="(item, index) in 50" :key="item">{{ item }}</view> -->
					<OrderContent v-if="isData" />

					<view class="no-order" v-else>
						<view>你还没有订单</view>
						<view class="no-order-home" @click="goHome">去首页逛逛吧</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { onLoad, onReady } from '@dcloudio/uni-app';

	import OrderContent from '@/components/order/OrderContent.vue';

	import { useVariousBarStore } from '@/stores/variousBar';
	const variousBarStore = useVariousBarStore();

	import { getNavBarHeight } from '@/utils/system.ts';

	// 内容块的高度值
	const clentHeight = ref(0);
	onReady(() => {
		uni.getSystemInfo({
			success(res) {
				// getNavBarHeight状态栏高度
				clentHeight.value = res.windowHeight - getNavBarHeight.value;
			},
		});
	});

	// 顶部tab
	const orderBar = ref([]);
	// 滑块数据
	const newTopBar = ref([]);

	/**
	 * 数字	状态含义	说明
	 * 0	待支付	订单已创建，等待用户支付。
	 * 01	已取消	订单被取消(未付款)。
	 * 011 支付超时：用户未在规定时间内支付，订单自动取消。
	 *
	 * 02	退款中	订单被取消(已付款)，用户申请退款。
	 * 03	已退款	退款已完成，款项已退回用户账户。
	 *
	 * 1	待发货	订单已支付，等待发货。
	 *
	 * 2	待收货	订单已发货，等待用户确认收货。
	 * 21	退货中	用户申请退货。
	 * 22	已退货	退货已完成，款项已退回用户账户。
	 * 23	换货中	用户申请换货，正在处理。
	 * 24	已换货	换货已完成，用户已收到新商品。
	 *
	 * 3	已完成	订单已完成，用户已确认收货。
	 *
	 * 4	待评价	订单已完成，等待用户评价。
	 * 41	已评价	用户已评价订单。
	 *
	 * 5	异常订单	订单出现异常，需人工介入处理。
	 * 51 物流异常：物流信息异常（如长时间未更新）。
	 * 52 库存异常：库存不足导致订单无法正常处理。
	 * 53 用户信息异常：用户提供的地址或联系方式有误。
	 *
	 */

	const state = ref('');
	const isData = ref(true);

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
			url: '/pages/index/index',
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
				.f-active-color {
					padding: 10rpx 0;
					border-bottom: 6rpx solid #49bdfb;
				}
			}
			#top {
			}
		}
		.bg-active-color {
			// background-color: red;
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
