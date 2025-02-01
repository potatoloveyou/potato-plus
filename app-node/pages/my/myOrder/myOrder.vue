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
		<Lines />

		<swiper @change="onChangeTab" :current="topBarIndex" :style="`height:${clentHeight}px;`">
			<swiper-item v-for="(item, index) in variousBarStore.variousBar[0]?.order_bar" :key="item.id">
				<scroll-view
					class="bg-active-color"
					scroll-y
					:style="`height:${clentHeight}px;`"
					@scrolltolower="loadMore(index)">
					<OrderContent />
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
	import OrderContent from '@/components/common/OrderContent.vue';

	import { useVariousBarStore } from '@/stores/variousBar';
	const variousBarStore = useVariousBarStore();

	import { getNavBarHeight } from '@/utils/system.ts';

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
