<template>
	<view class="my-order">
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

		<swiper @change="onChangeTab" :current="topBarIndex" :style="`height:${clentHeight}px;`">
			<swiper-item v-for="(item, index) in variousBarStore.variousBar[0]?.order_bar" :key="item.id">
				<scroll-view
					class="bg-active-color"
					scroll-y
					:style="`height:${clentHeight}px;`"
					@scrolltolower="loadMore(index)">
					<OrderContent v-if="newTopBar[index]?.data.length" :orderList="newTopBar[index]?.data" />

					<view class="no-order" v-else>
						<view>你还没有相关订单</view>
						<view class="no-order-home" @click="goHome" v-if="index == 0">去首页逛逛吧</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { onLoad, onReady, onShow } from '@dcloudio/uni-app';

	import OrderContent from '@/components/order/OrderContent/OrderContent.vue';

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

	import { getUserOrder } from '@/api/apis.ts';

	// 滑块数据
	const newTopBar = ref([]);
	// 初始化数据
	const initData = (res) => {
		return topBar.value.map((_, index) => ({
			data: index === 0 ? res.data : [],
			loadText: '上拉加载更多...',
			limit: 10,
			offset: index === 0 ? 1 : 0,
		}));
	};
	// 获取用户订单数据
	const getUserOrderData = async () => {
		const queryparams = {
			status: '00',
			offset: 0,
			limit: 10,
		};
		const res = await getUserOrder(queryparams);
		newTopBar.value = initData(res);
		// console.log('newTopBar', newTopBar.value);
	};

	// 顶部tab
	const topBar = ref([]);
	onLoad(() => {
		getUserOrderData();
		topBar.value = variousBarStore.variousBar[0]?.order_bar;
	});

	const isFirstLoad = ref(true);
	onShow(() => {
		if (isFirstLoad.value) {
			isFirstLoad.value = false; // 首次进入后标记为 false，防止重复请求
		} else {
			getUserOrderData(); // 仅在 navigateBack 返回时调用
		}
	});

	// 选中索引
	const topBarIndex = ref(0);
	// 顶部tab跟随索引
	const scrollIntoIndex = ref('top0');
	// 点击顶部tab
	const changeTab = async (index) => {
		if (topBarIndex.value == index) {
			return;
		}
		topBarIndex.value = index;

		scrollIntoIndex.value = 'top' + index;

		addData(index);
	};

	// 滑动swiper
	const onChangeTab = (e) => {
		changeTab(e.detail.current);
	};

	const addData = async (index) => {
		// 获取当前订单类型的 ID
		const statusId = variousBarStore.variousBar[0]?.order_bar?.[index]?.id.toString();
		const currentTab = newTopBar.value[index];

		// 计算 offset
		const offset = currentTab.data.length >= 10 ? currentTab.offset * currentTab.limit : 0;

		const queryparams = {
			status: statusId,
			offset,
			limit: currentTab.limit,
		};

		// 请求订单数据
		const res = await getUserOrder(queryparams);

		if (res?.data?.length) {
			// **每次请求都覆盖旧数据，防止超时订单残留**
			currentTab.data = res.data;
			currentTab.offset++;

			// **如果返回的数据不足 limit，说明没有更多了**
			currentTab.loadText = res.data.length < currentTab.limit ? '没有更多数据了' : '上拉加载更多...';
		} else {
			// **无数据时，清空当前数据**
			currentTab.data = [];
			currentTab.loadText = '没有更多数据了';
		}
	};

	// 上拉加载更多
	const loadMore = (index) => {
		newTopBar.value[index].loadText = '加载中...';
		addData(index);
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
		}
		.bg-active-color {
			.no-order {
				.no-order-home {
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
