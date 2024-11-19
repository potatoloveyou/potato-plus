<template>
	<view class="shop">
		<view class="shop-item" v-for="(item, index) in dataList" :key="index">
			<view class="shop-big"><image class="shop-big" :src="item.bigImgUrl" mode=""></image></view>
			<scroll-view class="scroll-content" scroll-x="true">
				<view class="scroll-item">
					<Commodity
						:dataList="item.data"
						itemWidth="200rpx"
						imgHeight="200rpx"
						nameSize="24rpx"
						wrap="nowrap"></Commodity>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import Commodity from '@/components/common/Commodity.vue';

const props = defineProps({
	dataList: {
		type: Array,
	},
});

// const shopList = ref([]);
// shopList.value = props.dataList;
// shopList.value = [
// 	{
// 		id: 1,
// 		imgUrl: '../../static/imgs/classify1.jpg',
// 		name: '阿德杀杀毒哈师大哈拉少等哈拉萨大叔大撒打算手打阿是、婶',
// 		pprice: '299',
// 		oprice: '699',
// 		discount: '5.2',
// 	},
// 	{
// 		id: 2,
// 		imgUrl: '../../static/imgs/classify1.jpg',
// 		name: '阿德杀杀毒哈师大哈拉少等哈拉萨大叔大撒打算手打阿是、婶',
// 		pprice: '399',
// 		oprice: '699',
// 		discount: '5.2',
// 	},
// 	{
// 		id: 3,
// 		imgUrl: '../../static/imgs/classify1.jpg',
// 		name: '阿德杀杀毒哈师大哈拉少等哈拉萨大叔大撒打算手打阿是、婶',
// 		pprice: '499',
// 		oprice: '699',
// 		discount: '5.2',
// 	},
// 	{
// 		id: 4,
// 		imgUrl: '../../static/imgs/classify1.jpg',
// 		name: '阿德杀杀毒哈师大哈拉少等哈拉萨大叔大撒打算手打阿是、婶',
// 		pprice: '499',
// 		oprice: '699',
// 		discount: '5.2',
// 	},
// 	{
// 		id: 5,
// 		imgUrl: '../../static/imgs/classify1.jpg',
// 		name: '阿德杀杀毒哈师大哈拉少等哈拉萨大叔大撒打算手打阿是、婶',
// 		pprice: '499',
// 		oprice: '699',
// 		discount: '5.2',
// 	},
// 	{
// 		id: 6,
// 		imgUrl: '../../static/imgs/classify1.jpg',
// 		name: '阿德杀杀毒哈师大哈拉少等哈拉萨大叔大撒打算手打阿是、婶',
// 		pprice: '499',
// 		oprice: '699',
// 		discount: '5.2',
// 	},
// ];
</script>

<style lang="scss" scoped>
.shop {
	.shop-item {
		.shop-big {
			width: 100%;
			height: 350rpx;
		}
	}
	.scroll-content {
		width: 100%;
		white-space: nowrap;
		.scroll-item {
			display: inline-block;
			// width: 300rpx;
			// height: 300rpx;
		}
	}
}
</style>
