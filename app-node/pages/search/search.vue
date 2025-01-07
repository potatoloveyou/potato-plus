<template>
	<view class="search">
		<Lines />
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
			<view class="search-init" @click="goSearchList">搜索</view>
		</view>
		<!-- #endif -->

		<view class="search-item">
			<view class="search-recently">
				<text class="f-color">最近搜索</text>
				<view class="iconfont icon-lajitong" @click="clearHistory"></view>
			</view>

			<view class="recently-title" v-if="historySearch.length > 0">
				<view
					class="recently-item f-color"
					v-for="(item, index) in historySearch"
					:key="index"
					@click="toSearchList(item)">
					{{ item }}
				</view>
			</view>

			<view class="search-end" v-else>暂无搜索记录</view>
		</view>

		<view class="search-item">
			<view class="search-recently">
				<text class="f-color">热门搜索</text>
			</view>
			<view class="recently-title">
				<view class="recently-item f-color">四件套</view>
				<view class="recently-item f-color">面膜</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import {
	onNavigationBarButtonTap,
	onNavigationBarSearchInputChanged,
	onNavigationBarSearchInputConfirmed,
} from '@dcloudio/uni-app';
import Lines from '@/components/common/Lines.vue';

//查询参数
const queryParams = ref({
	// 搜索关键词
	keyword: '',
});

// 存储已搜索过的词
const historySearch = ref(uni.getStorageSync('historySearch') || []);
// 记录最近搜索词
const addSearch = () => {
	historySearch.value = [...new Set([queryParams.value.keyword, ...historySearch.value])].slice(0, 10);
	uni.setStorageSync('historySearch', historySearch.value);
	// console.log(historySearch.value);
};

const search = (res) => {
	if (queryParams.value.keyword == '') {
		uni.showToast({
			title: '关键词不能为空',
			icon: 'none',
		});
	} else {
		toSearchList(queryParams.value.keyword);
	}
	uni.hideKeyboard();
	addSearch();
};

// 监听标题栏输入框输入内容(APP)
onNavigationBarSearchInputChanged((e) => {
	queryParams.value.keyword = e.text;
});

// 原生标题栏按钮点击事件(APP)
onNavigationBarButtonTap((e) => {
	search();
});

// 监听标题栏输入框 搜索(键盘回车) 事件(APP)
onNavigationBarSearchInputConfirmed((e) => {
	search();
});

// 点击搜索按钮(min)
const goSearchList = () => {
	search();
};

// 点击标签进行搜索
const toSearchList = (item) => {
	queryParams.value.keyword = item;

	// #ifdef APP-PLUS
	// 获取当前页面实例
	const pages = getCurrentPages();
	const currentPage = pages[pages.length - 1];

	if (currentPage && currentPage.$getAppWebview) {
		const webView = currentPage.$getAppWebview();

		// 动态设置原生导航栏的 searchInput 文本
		webView.setTitleNViewSearchInputText(queryParams.value.keyword);
	} else {
		console.error('$getAppWebview 不可用，确保运行在 APP-PLUS 环境');
	}
	// #endif

	uni.navigateTo({
		url: `/pages/search/searchList/searchList?keyword=${item}`,
	});
};

// 清除搜索记录
const clearHistory = () => {
	uni.showModal({
		title: '重要提示',
		content: '是否要清除搜索记录',
		cancelText: '取消',
		confirmText: '确定',
		success(res) {
			if (res.confirm) {
				console.log('确认删除');
				uni.removeStorageSync('historySearch');
				historySearch.value = [];
			}
		},
	});
};
</script>

<style lang="scss" scoped>
.search {
	.search-nav {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		.uni-mt-10 {
			flex: 1;
		}
		.search-init {
			font-size: 32rpx;
			padding: 0 40rpx 0 20rpx;
		}
	}
	.search-item {
		padding: 30rpx;
		.search-recently {
			padding: 15rpx 0;
			display: flex;
			justify-content: space-between;
			.iconfont {
				font-size: 44rpx;
			}
		}
		.recently-title {
			// background-color: red;
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			.recently-item {
				padding: 4rpx 24rpx;
				background-color: #e1e1e1;
				border-radius: 26rpx;
				margin: 10rpx;
			}
		}
		.search-end {
			text-align: center;
		}
	}
}
</style>
