<template>
	<uni-list class="uni-list">
		<uni-list-item
			class="uni-list-item"
			:title="`${addressManage?.addressCity} ${addressManage?.address}`"
			:note="`${addressManage?.recipient} ${addressManage?.phone}`"
			showArrow
			showExtraIcon
			:extraIcon="{ type: 'location', size: '50rpx' }"
			link="navigateTo"
			to="/subPackages/my/myAddress/myAddress?from=order"
			v-if="addressManage">
		</uni-list-item>
		<uni-list-item
			class="uni-list-item uni-list-item-no-address"
			title="暂无地址请先添加地址"
			showArrow
			showExtraIcon
			:extraIcon="{ type: 'location', size: '50rpx' }"
			link="navigateTo"
			to="/subPackages/my/myAddress/myAddress?from=order"
			v-if="!addressManage">
		</uni-list-item>
	</uni-list>
</template>

<script setup>
	import { onLoad } from '@dcloudio/uni-app';
	const prors = defineProps({
		addressManage: Object,
		isModify: Boolean,
	});
</script>

<style lang="scss" scoped>
	.uni-list {
		.uni-list-item {
			::v-deep .uni-list-item__content-title {
				font-size: 32rpx;
				font-weight: bold;
			}
			::v-deep .uni-list-item__content-note {
				font-size: 28rpx;
			}
		}
		.uni-list-item-no-address {
			::v-deep .uni-list-item__content-title {
				// color: red;
				font-size: 36rpx;
				text-align: center;
				color: red;
			}
		}
		.uni-list-item {
		}
		.no-address {
		}
	}
</style>
