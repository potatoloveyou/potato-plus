<template>
	<view class="scroll-list">
		<ShopList :keyword="keyword" />
	</view>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue';
import { onLoad, onReady } from '@dcloudio/uni-app';

import ShopList from '@/components/common/ShopList.vue';

const keyword = ref('');
onLoad((e) => {
	// console.log(e.keyword);
	keyword.value = e.keyword;

	// #ifdef APP-PLUS
	// 获取当前页面实例
	const pages = getCurrentPages();
	const currentPage = pages[pages.length - 1];

	if (currentPage && currentPage.$getAppWebview) {
		const webView = currentPage.$getAppWebview();

		// 动态设置原生导航栏的 searchInput 文本
		webView.setTitleNViewSearchInputText(keyword.value);
	} else {
		console.error('$getAppWebview 不可用，确保运行在 APP-PLUS 环境');
	}
	// #endif
});
</script>

<style lang="scss" scoped></style>
