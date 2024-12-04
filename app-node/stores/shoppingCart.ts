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
			num: 3,
		},
	]);

	// 全选
	const checkAll = (): void => {
		cartList.value.forEach((item) => (item.checked = true));
	};

	// 取消全选
	const checkNoAll = (): void => {
		cartList.value.forEach((item) => (item.checked = false));
	};

	// 切换单个商品选中状态
	const toggleItemSelection = ({ id }: { id: string }): void => {
		const item = cartList.value.find((product) => product.id === id);
		if (item) {
			item.checked = !item.checked;
		}
		// console.log(selectedItems.value);
		// console.log(selectedItemIds.value);
	};

	// 判断是否全选
	const isCheckAll = computed(() => selectedItems.value.length === cartList.value.length);

	// 切换全选状态
	const checkAllSwitch = (): void => {
		isCheckAll.value ? checkNoAll() : checkAll();
	};

	// 计算选中的商品数量
	const selectedItems = computed(() => cartList.value.filter((item) => item.checked));

	// 计算选中的商品 ID 列表
	const selectedItemIds = computed(() => selectedItems.value.map((item) => item.id));

	// 计算选中商品的总金额
	// 数组累加方法	reduce.((保存上一次计算的结果,遍历对象),逻辑,初始值0)
	const amounts = computed(() => {
		return selectedItems.value.reduce((sum, item) => sum + item.pprice * item.num, 0);
	});

	// 修改商品数量
	const updateItemNum = ({ value, id }: { value: number; id: string }): void => {
		const item = cartList.value.find((product) => product.id === id);
		if (item) {
			item.num = value > 0 ? value : 1; // 确保数量至少为1
		}
		console.log(cartList.value);
	};

	// 删除商品
	const deleteGoods = (): void => {
		cartList.value = cartList.value.filter((item) => !selectedItemIds.value.includes(item.id));
		uni.showToast({
			title: '删除成功',
			icon: 'none',
		});
	};

	return {
		cartList,
		toggleItemSelection,
		isCheckAll,
		checkAllSwitch,
		amounts,
		selectedItems, // 提供选中的商品列表
		selectedItemIds,
		updateItemNum,
		deleteGoods,
	};
});
