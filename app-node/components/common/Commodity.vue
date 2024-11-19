<template>
	<view class="commodity" :style="`flex-wrap:${wrap};`">
		<view class="commodity-item" v-for="(item, index) in dataList" :key="item.id" :style="`width:${itemWidth};`">
			<image class="commodity-img" :src="item.imgUrl" mode="" :style="`height:${imgHeight};`"></image>

			<view class="commodity-content">
				<text class="commodity-name" :style="`font-size:${nameSize};`">{{ item.name }}</text>
				<view class="price">
					<text class="pprice">￥{{ item.pprice }}</text>
					<text class="oprice">￥{{ item.oprice }}</text>
				</view>
				<text class="discount">{{ item.discount }}折</text>
			</view>
		</view>
	</view>
</template>

<script setup>
const props = defineProps({
	// 数据
	dataList: {
		type: Array,
	},
	// item宽度
	itemWidth: {
		type: String,
		default: '375rpx',
	},
	// 图片高度
	imgHeight: {
		type: String,
		default: '375prx',
	},
	// 文字大小
	nameSize: {
		type: String,
		default: '32rpx',
	},
	// 是否换行
	wrap: {
		type: String,
		default: 'wrap',
	},
});
</script>

<style lang="scss" scoped>
.commodity {
	// display: grid;
	// grid-template-columns: repeat(2, 1fr);
	display: flex;
	// flex-wrap: wrap;
	.commodity-item {
		// width: 375rpx;
		padding-bottom: 20rpx;
		.commodity-img {
			width: 100%;
			// height: 375rpx;
		}
		.commodity-content {
			text-align: center;
			.commodity-name {
				text-overflow: ellipsis;
				overflow: hidden;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				padding: 0 20rpx;
			}
			.price {
				padding-top: 6rpx;
				.oprice {
					text-decoration: line-through;
					font-size: 24rpx;
					color: #999;
				}
			}
			.discount {
				border-radius: 4rpx;
				border: 1px solid #ff3333;
				padding: 2rpx 10rpx;
				font-size: 20rpx;
				color: #ff3333;
			}
		}
	}
}
</style>
