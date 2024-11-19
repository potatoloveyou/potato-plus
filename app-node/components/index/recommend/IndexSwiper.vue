<template>
	<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
		<swiper-item v-for="(item, index) in dataList" :key="index">
			<image class="swiper-imgs" :src="item.imgUrl" mode=""></image>
		</swiper-item>
	</swiper>
</template>

<script setup>
const props = defineProps({
	dataList: {
		type: Array,
	},
});
</script>

<style lang="scss" scoped>
swiper {
	width: 100%;
	height: 340rpx;
	.swiper-imgs {
		width: 100%;
		height: 100%;
	}
}
</style>
