<template>
	<uni-list class="my-content-list">
		<uni-list-item class="my-content-item" showArrow @click="change" link>
			<template v-slot:header>
				<uni-icons class="iconfont" fontFamily="CustomFont" :size="26">{{ '&#xe6de;' }}</uni-icons>
			</template>
			<template v-slot:body>
				<text class="slot-box slot-text">我的收藏</text>
			</template>
			<template v-slot:footer>
				<text class="slot-box">1</text>
			</template>
		</uni-list-item>

		<uni-list-item class="my-content-item" showArrow @click="change" link>
			<template v-slot:header>
				<uni-icons class="iconfont" fontFamily="CustomFont" :size="26">{{ '&#xe605;' }}</uni-icons>
			</template>
			<template v-slot:body>
				<text class="slot-box slot-text">我的优惠卷</text>
			</template>
			<template v-slot:footer>
				<text class="slot-box">1</text>
			</template>
		</uni-list-item>

		<uni-list-item class="my-content-item" showArrow @click="change" link>
			<template v-slot:header>
				<uni-icons class="iconfont" fontFamily="CustomFont" :size="26">{{ '&#xe60f;' }}</uni-icons>
			</template>
			<template v-slot:body>
				<text class="slot-box slot-text">我的积分</text>
			</template>
			<template v-slot:footer>
				<text class="slot-box">1</text>
			</template>
		</uni-list-item>

		<view class="mb-30rpx"></view>

		<uni-list-item class="my-content-item" showArrow @click="change" link>
			<template v-slot:header>
				<uni-icons class="iconfont" fontFamily="CustomFont" :size="26">{{ '&#xe83d;' }}</uni-icons>
			</template>
			<template v-slot:body>
				<text class="slot-box slot-text">加入超级VIP</text>
			</template>
			<template v-slot:footer>
				<text class="slot-box">1</text>
			</template>
		</uni-list-item>

		<uni-list-item class="my-content-item" showArrow @click="change" link>
			<template v-slot:header>
				<uni-icons class="iconfont" fontFamily="CustomFont" :size="26">{{ '&#xe8ac;' }}</uni-icons>
			</template>
			<template v-slot:body>
				<text class="slot-box slot-text">帮助中心</text>
			</template>
			<template v-slot:footer>
				<text class="slot-box">1</text>
			</template>
		</uni-list-item>

		<uni-list-item class="my-content-item" showArrow @click="change" link>
			<template v-slot:header>
				<uni-icons class="iconfont" fontFamily="CustomFont" :size="26">{{ '&#xec2e;' }}</uni-icons>
			</template>
			<template v-slot:body>
				<text class="slot-box slot-text">联系客服</text>
			</template>
			<template v-slot:footer>
				<text class="slot-box">1</text>
			</template>
		</uni-list-item>
	</uni-list>
</template>

<script setup>
	const change = () => {
		console.log('change');
	};
</script>

<style lang="scss" scoped>
	.df-aic {
		display: flex;
		align-items: center;
	}
	.mb-30rpx {
		padding-bottom: 30rpx;
	}
	.my-content-list {
		margin-bottom: 100px;
		// background-color: #f6f6f6;
		// height: 100vh;
		.my-content-item {
			.iconfont {
				padding-right: 24rpx;
			}
			.slot-box {
				display: flex;
				align-items: center;
			}
			.slot-text {
				flex: 1;
			}
		}
	}
</style>
