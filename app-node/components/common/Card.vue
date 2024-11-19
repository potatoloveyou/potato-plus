<template>
	<view class="card">
		<view>-</view>
		<view class="card-name">{{ cardName }}</view>
		<view>-</view>
	</view>
</template>

<script setup>
const props = defineProps({
	cardName: String,
});
</script>

<style lang="scss" scoped>
.card {
	padding: 20rpx 0;
	display: flex;
	justify-content: center;
	font-weight: bold;
	.card-name {
		padding: 0 20rpx;
		font-size: 32rpx;
	}
}
</style>
