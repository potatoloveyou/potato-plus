<template>
	<view class="recommend">
		<view class="recommend-item" v-for="(item, index) in dataList" :key="index">
			<image class="item-big" :src="item.bigImgUrl" mode=""></image>
			<view class="item-small">
				<block v-for="(k, i) in item.data" :key="i">
					<image class="item-img" :src="k.imgUrl" mode=""></image>
				</block>
			</view>
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
.recommend {
	padding: 20rpx;
	.recommend-item {
		display: flex;
		flex-direction: column;
		border-radius: 20rpx;
		border: 2rpx solid #ccc;
		overflow: hidden;
		margin: 20rpx 0;
		.item-big {
			width: 100%;
			height: 300rpx;
		}
		.item-small {
			// display: flex;
			// justify-content: space-between;
			// margin-top: 20rpx;
			width: 100%;
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			justify-items: center;
			.item-img {
				width: 200rpx;
				height: 200rpx;
			}
		}
	}
}
</style>
