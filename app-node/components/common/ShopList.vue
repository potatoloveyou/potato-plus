<template>
	<view class="shop-list">
		<!-- #ifdef MP-WEIXIN -->
		<view class="search-nav">
			<uni-search-bar
				class="uni-mt-10"
				radius="20"
				placeholder="nike"
				clearButton="auto"
				cancelButton="none"
				v-model="queryParams.keyword"
				@confirm="search" />
			<view class="search-init" @click="goSearchList">筛选</view>
		</view>
		<!-- #endif -->
		<view class="shop-top f-color">
			<view class="shop-item" v-for="(item, index) in shopList.data" :key="index" @click="changTab(index)">
				<view :class="shopList.currentIndex == index ? 'f-active-color' : ''">{{ item.name }}</view>
				<view class="shop-icon">
					<view
						class="iconfont icon-xialajiantou1 up"
						:class="shopList.data[index].sort == 1 && shopList.data[index].status == 1 ? 'f-active-color' : ''"></view>
					<view
						class="iconfont icon-shanglajiantou down"
						:class="shopList.data[index].sort == 2 && shopList.data[index].status == 1 ? 'f-active-color' : ''"></view>
				</view>
			</view>
		</view>
		<Lines />

		<CommodityList :dataList="dataList" />
	</view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { onLoad, onReady } from '@dcloudio/uni-app';
import {
	onNavigationBarButtonTap,
	onNavigationBarSearchInputChanged,
	onNavigationBarSearchInputConfirmed,
} from '@dcloudio/uni-app';

import Lines from '@/components/common/Lines.vue';
import CommodityList from '@/components/common/CommodityList.vue';

import { getGoodsSearch } from '@/api/apis.ts';

const props = defineProps({
	keyword: {
		type: String,
		default: '',
	},
});

//查询参数
const queryParams = ref({
	// 搜索关键词
	keyword: '',
	limit: 10,
	// offset为limit倍数
	offset: 0,
});

const dataList = ref([]);
// 请求商品数据
const getGoodsSearchData = async (data) => {
	try {
		const res = await getGoodsSearch(data);
		dataList.value = res.data;
		// console.log(res);
	} catch (e) {
		// console.log(e);
	}
};

const shopList = ref({});
shopList.value = {
	// 蓝标是否在这里 1是在 0是不在
	currentIndex: 0,
	data: [
		{
			name: '价格',
			// 0表示未被选中 1表示为上，2表示为下
			status: 1,
			// pprice: 1,
			key: 'pprice',
			sort: 1,
		},
		{
			name: '折扣',
			status: 0,
			// discount: 1,
			key: 'discount',
			sort: 1,
		},
		{
			name: '品牌',
			status: 0,
			// brand: 1,
			key: 'brand',
			sort: 1,
		},
	],
};

// 点击排序状态切换
const changTab = (index) => {
	// 旧的索引值
	const idx = shopList.value.currentIndex;
	// 旧的索引对应的data
	const item = shopList.value.data[idx];

	// 如果点击的是同一个
	if (idx == index) {
		item.sort = item.sort == 1 ? 2 : 1;
		getGoodsSearchData({ ...queryParams.value, [item.key]: item.sort });
		return;
	}

	// 把旧的data的status变回0
	item.status = 0;
	// 把旧的data的sort变为1
	item.sort = 1;
	// console.log(item);

	// 新的index对应的data
	const newItem = shopList.value.data[index];
	// 修改currentIndex为新的index
	shopList.value.currentIndex = index;
	// 把新的data的status修改为1
	newItem.status = 1;
	getGoodsSearchData({ ...queryParams.value, [newItem.key]: newItem.sort });
};

const search = (res) => {
	// console.log(shopList.value.data[shopList.value.currentIndex]);
	// console.log(queryParams.value);
	getGoodsSearchData({
		...queryParams.value,
		[shopList.value.data[shopList.value.currentIndex].key]: shopList.value.data[shopList.value.currentIndex].sort,
	});
};

const goSearchList = () => {
	getGoodsSearchData({
		...queryParams.value,
		[shopList.value.data[shopList.value.currentIndex].key]: shopList.value.data[shopList.value.currentIndex].sort,
	});
};

// 监听标题栏输入框输入内容(APP)
onNavigationBarSearchInputChanged((e) => {
	queryParams.value.keyword = e.text;
});

// 原生标题栏按钮点击事件(APP)
onNavigationBarButtonTap((e) => {
	// console.log(e);
	getGoodsSearchData({
		...queryParams.value,
		[shopList.value.data[shopList.value.currentIndex].key]: shopList.value.data[shopList.value.currentIndex].sort,
	});
});

// 监听标题栏输入框 搜索(键盘回车) 事件(APP)
onNavigationBarSearchInputConfirmed((e) => {
	// console.log(e);
	getGoodsSearchData({
		...queryParams.value,
		[shopList.value.data[shopList.value.currentIndex].key]: shopList.value.data[shopList.value.currentIndex].sort,
	});
});

onLoad((event) => {
	let { keyword } = event;
	queryParams.value.keyword = keyword;
	getGoodsSearchData({ ...queryParams.value, pprice: 1 });
});
</script>

<style scoped lang="scss">
.df-jcc-aic {
	display: flex;
	justify-content: center;
	align-items: center;
}

.shop-list {
	.search-nav {
		width: 100%;
		// display: flex;
		// justify-content: center;
		// align-items: center;
		@extend .df-jcc-aic;
		.uni-mt-10 {
			flex: 1;
		}
		.search-init {
			font-size: 32rpx;
			padding: 0 40rpx 0 20rpx;
		}
	}
	.shop-top {
		@extend .df-jcc-aic;
		padding: 10rpx 0;
		.shop-item {
			flex: 1;
			@extend .df-jcc-aic;
			height: 80rpx;
			.shop-icon {
				margin-left: 10rpx;
				.iconfont {
					width: 16rpx;
					height: 16rpx;
					font-size: 20rpx;
				}
				.up {
				}
				.down {
				}
			}
		}
	}
}
</style>
