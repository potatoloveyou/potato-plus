<template>
	<view class="commodityList">
		<Commodity :dataList="dataList" />
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
