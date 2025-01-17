import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useShoppingCartStore = defineStore('shoppingCart', () => {
	// // 商品接口定义
	// interface CartItem {
	// 	checked: boolean;
	// 	_id: string;
	// 	name: string;
	// 	color: string;
	// 	imgUrl: string;
	// 	pprice: number;
	// 	num: number;
	// }

	// 响应式购物车列表
	const cartList = ref([]);

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
		const item = cartList.value.find((product) => product._id === id);
		if (item) {
			item.checked = !item.checked;
		}
	};

	// 计算选中的商品数量
	const selectedItems = computed(() => cartList.value.filter((item) => item.checked));

	// 判断是否全选
	const isCheckAll = computed(() => selectedItems.value.length === cartList.value.length && cartList.value.length != 0);

	// 切换全选状态
	const checkAllSwitch = (): void => {
		isCheckAll.value ? checkNoAll() : checkAll();
	};

	// 计算选中的商品 ID 列表
	const selectedItemIds = computed(() => selectedItems.value.map((item) => item._id));

	// 计算选中商品的总金额
	// 数组累加方法	reduce.((保存上一次计算的结果,遍历对象),逻辑,初始值0)
	const amounts = computed(() => {
		return selectedItems.value.reduce((sum, item) => sum + item.pprice * item.num, 0);
	});

	// 修改商品数量
	const updateItemNum = ({ value, id }: { value: number; id: string }): void => {
		const item = cartList.value.find((product) => product._id === id);
		if (item) {
			item.num = value > 0 ? value : 1; // 确保数量至少为1
		}
	};

	// 删除商品
	const deleteGoods = (): void => {
		cartList.value = cartList.value.filter((item) => !selectedItemIds.value.includes(item._id));
		uni.showToast({
			title: '删除成功',
			icon: 'none',
		});
	};

	// 加入购物车
	const addShopCart = (goods: CartItem): void => {
		// 判断商品是否已存在购物车
		const existingItem = cartList.value.find((item) => item._id === goods._id);
		if (existingItem) {
			// 如果存在，则增加数量
			existingItem.num += goods.num || 1; // 确保传入数量为空时默认为1
		} else {
			// 如果不存在，确保传入对象的完整性
			const newGoods: CartItem = {
				checked: false, // 默认未选中
				_id: goods._id,
				name: goods.name || '未知商品',
				color: goods.color || '默认颜色',
				imgUrl: goods.imgUrl || '/static/imgs/default.jpg',
				pprice: goods.pprice || 0, // 确保价格为数字
				num: goods.num || 1, // 默认数量为1
			};
			cartList.value.push(newGoods);
		}
	};

	// 获取指定商品数量
	const getCartItemQuantity = (itemId: string): number => {
		const item = cartList.value.find((cartItem) => cartItem._id === itemId);
		return item ? item.num : 0;
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
		addShopCart,
		getCartItemQuantity,
	};
});
