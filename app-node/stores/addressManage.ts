import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useAddressManageStore = defineStore('addressManage', () => {
	// 地址接口定义
	interface AddressItem {
		_id: string;
		isDefault: boolean;
		recipient: string;
		phone: string;
		address: string;
	}

	const addressList = ref<AddressItem[]>([
		{
			_id: '1',
			isDefault: true,
			recipient: 'potato1',
			phone: '123456789',
			address: '广东省广州市增城区广州华商学院',
		},
		{
			_id: '2',
			isDefault: false,
			recipient: 'potato2',
			phone: '123456789',
			address: '广东省广州市增城区广州华商学院',
		},
	]);

	// 切换地址为默认地址
	const toggleDefaultAddress = (_id: string) => {
		addressList.value.forEach((item) => {
			item.isDefault = item._id === _id;
		});
	};

	// 添加地址
	const addAddress = (newAddress: AddressItem) => {
		addressList.value.push(newAddress);
	};

	// // 修改 store 中的 addAddress 方法
	// const addAddress = async (newAddress: AddressItem) => {
	// 	return new Promise<void>((resolve, reject) => {
	// 		try {
	// 			setTimeout(() => {
	// 				addressList.value.push(newAddress); // 模拟异步保存
	// 				resolve();
	// 			}, 1000); // 假设 1 秒后保存完成
	// 		} catch (error) {
	// 			reject(error);
	// 		}
	// 	});
	// };

	// 删除地址
	const removeAddress = (_id: string) => {
		addressList.value = addressList.value.filter((item) => item._id !== _id);
	};

	return {
		addressList,
		toggleDefaultAddress,
		addAddress,
		removeAddress,
	};
});
