<template>
	<view class="nav-bar">
		<view class="statuBar" :style="`height: ${getStatusBarHeight}px`"></view>
		<view class="titleBar" :style="`height:${getTitleBarHeight}px`">
			<slot name="titleBar-slot"></slot>
		</view>
	</view>
</template>

<script setup>
import { getStatusBarHeight, getTitleBarHeight } from '@/utils/system.ts';
</script>

<style lang="scss" scoped>
.nav-bar {
	width: 100%;
	.titleBar {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
	}
}
</style>
