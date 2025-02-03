<template>
	<view class="classify">
		<NavBar>
			<template #titleBar-slot>
				<view class="wx-app-list-nav" @click="goSearch">
					<uni-search-bar
						class="uni-mt-10"
						radius="20"
						clearButton="none"
						placeholder="请输入搜索内容"
						bgColor="#f0f0f0"
						readonly
						cancelButton="none" />
				</view>
			</template>
		</NavBar>
		<Lines />

		<view class="goods-list">
			<scroll-view scroll-y="true" class="list-left" :style="`height:${clentHeight}px;`">
				<view v-for="(item, index) in goodsList" :key="item.id" class="left-item" @click="changeLeftTab(index)">
					<view class="left-name" :class="index == active ? 'left-name-active' : ''">
						{{ item.name }}
					</view>
				</view>
			</scroll-view>

			<scroll-view scroll-y="true" class="list-right" :style="`height:${clentHeight}px;`">
				<view class="right-item" v-for="(item, index) in goodsList[active]?.data" :key="item.name">
					<view class="item-name">{{ item.name }}</view>
					<view class="item-content">
						<view class="content-data" v-for="(list, key) in item.list" :key="list.id" @click="goSearchList(list.name)">
							<image class="content-data-img" :src="list.imgUrl" mode=""></image>
							<view class="content-data-name">{{ list.name }}</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { onLoad, onReady } from '@dcloudio/uni-app';
	import NavBar from '@/components/common/NavBar.vue';
	import Lines from '@/components/common/Lines.vue';

	import { getNavBarHeight } from '@/utils/system.ts';
	import { getGoodsClassify } from '@/api/apis.ts';

	const goodsList = ref([]);
	const goodsClassify = async () => {
		const ref = await getGoodsClassify();
		goodsList.value = ref.data;
		// console.log(goodsList.value);
	};
	onLoad(() => {
		goodsClassify();
	});

	const goSearch = () => {
		uni.navigateTo({
			url: '/subPackages/search/search',
		});
	};

	// 内容块的高度值,不算上原生底部tabBar,不算上原生顶部navBar,若顶部navBar为自定义则会算上
	const clentHeight = ref(0);
	onReady(() => {
		uni.getSystemInfo({
			success: (res) => {
				clentHeight.value = res.windowHeight - getNavBarHeight.value;
			},
		});
	});

	// 左边导航栏的索引
	const active = ref(0);

	// 点击左侧tab
	const changeLeftTab = (index) => {
		if (active.value != index) {
			active.value = index;
			// console.log(index);
		}
	};

	// 点击右侧卡片跳转至搜索
	const goSearchList = (value) => {
		console.log(value);
		uni.navigateTo({
			url: `/subPackages/search/searchList/searchList?keyword=${value}`,
		});
	};
</script>

<style lang="scss" scoped>
	.titleBar {
		.wx-app-list-nav {
			width: 55%;
		}
	}
	.goods-list {
		display: flex;
		width: 100%;
		.list-left {
			width: 200rpx;
			.left-item {
				border-bottom: 4rpx solid #fff;
				font-size: 28rpx;
				background-color: #f1f1f1;
				.left-name {
					font-weight: bold;
					padding: 30rpx;
					box-sizing: border-box;
					text-align: center;
				}
				.left-name-active {
					border-left: 10rpx solid #49bdfb;
					background-color: #fff;
				}
			}
		}
		.list-right {
			flex: 1;
			padding: 0.5rem 0.8rem;
			box-sizing: border-box;
			.right-item {
				.item-name {
					font-weight: bold;
					padding: 30rpx 0;
				}
				.item-content {
					display: flex;
					flex-wrap: wrap;
					.content-data {
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						padding: 10rpx;
						.content-data-img {
							width: 150rpx;
							height: 150rpx;
						}
						.content-data-name {
							padding: 16rpx 0;
						}
					}
				}
			}
		}
	}
</style>
