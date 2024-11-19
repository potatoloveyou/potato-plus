<template>
	<view class="hot">
		<Commodity :dataList="dataList" itemWidth="250rpx" imgHeight="250rpx" />
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
</script>

<style lang="scss" scoped></style>
