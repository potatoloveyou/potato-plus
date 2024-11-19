<template>
	<view class="icons">
		<view class="icons-item" v-for="(item, index) in dataList" :key="index">
			<image class="icons-img" :src="item.imgUrl" mode=""></image>
			<text class="icons-name">{{ item.name }}</text>
		</view>
	</view>
</template>

<script setup>
const props = defineProps({
	dataList: {
		type: Array,
	},
});
</script>

<style lang="scss" scoped>
.icons {
	display: grid;
	grid-template-columns: repeat(4, 150rpx);
	justify-content: space-around;
	.icons-item {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding-top: 20rpx;
		align-items: center;
		.icons-img {
			width: 150rpx;
			height: 150rpx;
			// width: 100%;
			// height: 100%;
			// padding-top: 100%;
		}
	}
}
</style>
