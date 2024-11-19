<template>
	<view class="banner">
		<image class="banner-img" :src="dataList" mode=""></image>
	</view>
</template>

<script setup>
const props = defineProps({
	dataList: {
		type: String,
	},
});
</script>

<style lang="scss" scoped>
.banner {
	width: 100%;
	height: 400rpx;
	.banner-img {
		width: 100%;
		height: 100%;
	}
}
</style>
