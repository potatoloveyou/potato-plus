import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useShoppingCartStore = defineStore('shoppingCart', () => {
	// 响应式购物车列表
	const cartList = ref([]);

	// 切换单个商品选中状态
	const toggleItemSelection = ({ id }: { id: string }): void => {
		const item = cartList.value.find((product: { goodsDetails: { _id: string } }) => product.goodsDetails._id === id);
		if (item) {
			item.checked = !item.checked;
		}

		// 判断是否还有勾选上的商品
		if (selectedItems.value.length) {
			uni.setTabBarBadge({
				index: 2,
				text: selectedItems.value.length.toString(),
			});
		} else {
			uni.removeTabBarBadge({
				index: 2,
			});
		}
	};

	// 计算选中的商品
	const selectedItems = computed(() => cartList.value.filter((item: any) => item.checked));

	// 判断是否全选
	const isCheckAll = computed(() => selectedItems.value.length === cartList.value.length && cartList.value.length != 0);

	// 全选
	const checkAll = (): void => {
		cartList.value.forEach((item: { checked: boolean }) => (item.checked = true));

		// 显示数字标
		uni.setTabBarBadge({
			index: 2,
			text: selectedItems.value.length.toString(),
		});
	};

	// 取消全选
	const checkNoAll = (): void => {
		cartList.value.forEach((item: { checked: boolean }) => (item.checked = false));

		//隐藏数字标
		uni.removeTabBarBadge({
			index: 2, //tabbar下标
		});
	};

	// 切换全选状态
	const checkAllSwitch = (): void => {

		isCheckAll.value ? checkNoAll() : checkAll();
	};

	// 计算选中商品的总金额
	// 数组累加方法	reduce.((保存上一次计算的结果,遍历对象),逻辑,初始值0)
	const amounts = computed(() => {
		return selectedItems.value.reduce(
			(sum: number, item: { goodsDetails: { pprice: number }; quantity: number }) =>
				sum + item.goodsDetails.pprice * item.quantity,
			0,
		);
	});

	// 获取指定商品数量
	const getCartItemQuantity = (itemId: string): number => {
		const item = cartList.value.find(
			(product: { goodsDetails: { _id: string } }) => product.goodsDetails._id === itemId,
		);
		return item ? item.quantity : 0;
	};

	return {
		cartList,
		selectedItems,
		toggleItemSelection,
		isCheckAll,
		checkAllSwitch,
		amounts,
		getCartItemQuantity,
	};
});
