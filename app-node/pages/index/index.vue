<template>
	<view class="index">
		<!-- 推荐模板 -->
		<!-- <IndexSwiper /> -->
		<!-- <Recommend /> -->
		<!-- <Card cardName="猜你喜欢" /> -->
		<!-- <CommodityList /> -->

		<!-- 其他模板 -->
		<!-- <Banner /> -->
		<!-- <Icons /> -->
		<!-- <Card cardName="热销爆品" /> -->
		<!-- <Hot /> -->
		<!-- <Card cardName="推荐店铺" /> -->
		<!-- <Shop /> -->
		<!-- <Card cardName="为您推荐" /> -->
		<!-- <CommodityList /> -->

		<NavBar>
			<template #titleBar-slot>
				<view class="wx-app-index-nav">
					<view class="nav-icons">
						<view class="iconfont icon-search" @click="goSearch"></view>
						<view class="iconfont icon-xiaoxi"></view>
					</view>
					<text class="nav-text">首页</text>
				</view>
			</template>
		</NavBar>

		<scroll-view scroll-x="true" :scroll-into-view="scrollIntoIndex" class="scroll-content">
			<view
				class="scroll-item"
				:id="'top' + index"
				v-for="(item, index) in topBar"
				:key="item.id"
				@click="changeTab(index)">
				<text :class="topBarIndex == index ? 'f-active-color' : 'f-color'">{{ item.name }}</text>
			</view>
		</scroll-view>

		<swiper @change="onChangeTab" :current="topBarIndex" :style="`height:${clentHeight}px;`">
			<swiper-item v-for="(item, index) in newTopBar" :key="index">
				<scroll-view scroll-y="true" :style="`height:${clentHeight}px;`" @scrolltolower="loadMore(index)">
					<block v-if="item.data.length > 0">
						<block v-for="(k, i) in item.data" :key="i">
							<!-- 首页推荐 -->
							<IndexSwiper v-if="k.type == 'swiperList'" :dataList="k.data" />
							<template v-if="k.type == 'recommendList'">
								<Recommend :dataList="k.data" />
								<Card cardName="猜你喜欢" />
							</template>

							<!-- 除推荐外 -->
							<Banner v-if="k.type == 'bannerList'" :dataList="k.imgUrl" />
							<template v-if="k.type == 'iconsList'">
								<Icons :dataList="k.data" />
								<Card cardName="热销爆品" />
							</template>
							<template v-if="k.type == 'hotList'">
								<Hot :dataList="k.data" />
								<Card cardName="推荐店铺" />
							</template>
							<template v-if="k.type == 'shopList'">
								<Shop :dataList="k.data" />
								<Card cardName="为您推荐" />
							</template>

							<CommodityList v-if="k.type == 'commodityList'" :dataList="k.data" />
						</block>
					</block>
					<view v-else>暂无数据</view>
					<view class="load-text">{{ item.loadText }}</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad, onReady } from '@dcloudio/uni-app';
import IndexSwiper from '@/components/index/recommend/IndexSwiper.vue';
import Recommend from '@/components/index/recommend/Recommend.vue';
import Card from '@/components/common/Card.vue';
import CommodityList from '@/components/common/CommodityList.vue';

import Banner from '@/components/index/Outdoors/Banner.vue';
import Icons from '@/components/index/Outdoors/Icons.vue';
import Hot from '@/components/index/Outdoors/Hot.vue';
import Shop from '@/components/index/Outdoors/Shop.vue';
import NavBar from '@/components/common/NavBar.vue';

import { getIndexList, getIndexClassify } from '@/api/apis.ts';

// 内容块的高度值
const clentHeight = ref(0);
// 兼容可视区域高度
const getClentHeight = () => {
	const res = uni.getSystemInfoSync();
	const system = res.platform;
	if (system == 'ios') {
		return 44 + res.statusBarHeight;
	} else if (system == 'android') {
		return 48 + res.statusBarHeight;
	} else {
		return 0;
	}
};

onReady(() => {
	uni.getSystemInfo({
		success: (res) => {
			clentHeight.value = res.windowHeight - uni.upx2px(80) - getClentHeight();
		},
	});
});

// 顶部topBar内容
const topBar = ref([]);
// 承载数据
const newTopBar = ref([]);

const initData = (res) => {
	return topBar.value.map((_, index) => ({
		data: index === 0 ? res.data : [],
		load: 'first',
		loadText: '上拉加载更多...',
	}));
};

const getIndexData = async () => {
	const res = await getIndexList();
	topBar.value = res.data.topBar;
	newTopBar.value = initData(res.data);
};

onLoad(() => {
	getIndexData();
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

	// 首次滑动
	if (newTopBar.value[topBarIndex.value].load == 'first') {
		addData();
	}
};

// 滑动内容
const onChangeTab = (event) => {
	changeTab(event.detail.current);
};

// 查询参数
const queryparams = ref({
	index: 2,
	offset: 1,
});

// 对应显示不同数据
const addData = async () => {
	let index = topBarIndex.value;

	// 切换到那个就存储哪个的id
	let id = topBar.value[index].id;
	// 对应topBar的id存储到queryparams的index中
	queryparams.value.index = id;

	//
	let page = Math.ceil(newTopBar.value[index].data.length / 5) + 1;
	console.log(page);
	queryparams.value.offset = page;
	// console.log(queryparams.value);

	// 请求不同数据
	let res = await getIndexClassify(queryparams.value);
	newTopBar.value[index].data = [...newTopBar.value[index].data, ...res.data];
	console.log(queryparams.value);

	// 记录已滑动过的
	newTopBar.value[index].load = 'last';

	newTopBar.value[index].loadText = '上拉加载更多...';
};

// 上拉加载更多
const loadMore = (index) => {
	newTopBar.value[index].loadText = '加载中...';
	addData();
};

// 跳转到搜索页面
const goSearch = () => {
	uni.navigateTo({
		url: '/pages/search/search',
	});
};
</script>

<style lang="scss" scoped>
.wx-app-index-nav {
	.nav-icons {
		position: absolute;
		left: 0;
		display: flex;
		.iconfont {
			font-size: 50rpx;
			padding-left: 50rpx;
		}
	}
	.nav-text {
		font-size: 40rpx;
	}
}
.f-active-color {
	padding: 10rpx 0;
	border-bottom: 6rpx solid #49bdfb;
}

.scroll-content {
	width: 100%;
	height: 80rpx;
	white-space: nowrap;
	.scroll-item {
		display: inline-block;
		padding: 10rpx 30rpx;
		font-size: 36rpx;
	}
}
.load-text {
	border-top: 2rpx solid #636363;
	line-height: 60rpx;
	text-align: center;
}
</style>
