import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useOrderManageStore = defineStore('orderManage', () => {
	// 确认订单商品列表
	const confirmOrderList = ref([]);

	// 计算确认订单商品总金额
	const totalPrice = computed(() => {
		return confirmOrderList.value.reduce(
			(sum: number, item: { goodsDetails: { pprice: number }; quantity: number }) => {
				return sum + item.goodsDetails.pprice * item.quantity;
			},
			0,
		);
	});

	return {
		confirmOrderList,
		totalPrice,
	};
});
