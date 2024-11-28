import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useShoppingCartStore = defineStore('shoppingCart', () => {
	// 商品接口定义
	interface CartItem {
		checked: boolean;
		id: string;
		name: string;
		color: string;
		imgUrl: string;
		pprice: number; // 改为数字类型以便于金额计算
		num: number;
	}

	// 响应式购物车列表
	const cartList = ref<CartItem[]>([
		{
			checked: false,
			id: '12356468545614',
			name: '大羽绒服',
			color: '红色',
			imgUrl: '/static/imgs/classify1.jpg',
			pprice: 199,
			num: 1,
		},
		{
			checked: false,
			id: '12356468545615',
			name: '羽绒服',
			color: '蓝色',
			imgUrl: '/static/imgs/classify2.jpg',
			pprice: 299,
			num: 2,
		},
	]);

	// // 被选中商品的 ID 列表
	// const select = ref<string[]>([]);

	// // 全选商品
	// const checkAll = (): void => {
	// 	cartList.value.forEach((item) => (item.checked = true));
	// 	select.value = cartList.value.map((item) => item.id);
	// };

	// // 取消全选
	// const checkNoAll = (): void => {
	// 	cartList.value.forEach((item) => (item.checked = false));
	// 	select.value = [];
	// };

	// 全选
	const checkAll = (): void => {
		cartList.value.forEach((item) => (item.checked = true));
	};

	// 取消全选
	const checkNoAll = (): void => {
		cartList.value.forEach((item) => (item.checked = false));
	};

	// // 切换单个商品选中状态
	// const toggleItemSelection = (id: string): void => {
	// 	const item = cartList.value.find((product) => product.id === id);
	// 	if (item) {
	// 		item.checked = !item.checked;
	// 		if (item.checked) {
	// 			select.value.push(id);
	// 		} else {
	// 			select.value = select.value.filter((selectedId) => selectedId !== id);
	// 		}
	// 	}
	// 	console.log(id);
	// };

	// 切换单个商品选中状态
	const toggleItemSelection = (id: string): void => {
		const item = cartList.value.find((product) => product.id === id);
		if (item) {
			item.checked = !item.checked;
		}
	};

	// 计算选中的商品数量
	const selectedItems = computed(() => cartList.value.filter((item) => item.checked));

	// // 判断是否全选
	// const isCheckAll = computed(() => select.value.length === cartList.value.length);

	// 判断是否全选
	const isCheckAll = computed(() => selectedItems.value.length === cartList.value.length);

	// 切换全选状态
	const checkAllSwitch = (): void => {
		isCheckAll.value ? checkNoAll() : checkAll();
	};

	// // 动态计算总金额
	// const amounts = computed(() => {
	// 	return cartList.value.filter((item) => item.checked).reduce((sum, item) => sum + item.pprice * item.num, 0);
	// });

	// 计算选中商品的总金额
	const amounts = computed(() => {
		return selectedItems.value.reduce((sum, item) => sum + item.pprice * item.num, 0);
	});

	// return {
	// 	cartList,
	// 	select,
	// 	checkAll,
	// 	checkNoAll,
	// 	toggleItemSelection,
	// 	isCheckAll,
	// 	checkAllSwitch,
	// 	amounts,
	// };

	return {
		cartList,
		checkAll,
		checkNoAll,
		toggleItemSelection,
		isCheckAll,
		checkAllSwitch,
		amounts,
		selectedItems, // 提供选中的商品列表
	};
});
