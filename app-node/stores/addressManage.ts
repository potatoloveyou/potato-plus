import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useAddressManageStore = defineStore('addressManage', () => {
	// 地址接口定义
	interface AddressItem {
		_id: string;
		isDefault: boolean;
		recipient: string;
		phone: string;
		addressCity: string;
		address: string;
	}

	const addressList = ref<AddressItem[]>([
		{
			_id: '1',
			isDefault: true,
			recipient: 'potato1',
			phone: '123456789',
			addressCity: '广东省广州市增城区',
			address: '广州华商学院',
		},
		{
			_id: '2',
			isDefault: false,
			recipient: 'potato2',
			phone: '123456789',
			addressCity: '广东省广州市增城区',
			address: '广州华商学院',
		},
	]);

	const defaultAddress = computed(() => addressList.value.find((item) => item.isDefault));

	// const validateAddress = (address: AddressItem): boolean => {
	// 	if (!address.recipient || !address.phone || !address.address) {
	// 		console.error('Invalid address data:', address);
	// 		return false;
	// 	}
	// 	return true;
	// };

	// 切换默认地址
	const toggleDefaultAddress = (_id: string) => {
		addressList.value.forEach((item) => {
			item.isDefault = item._id === _id;
		});
	};

	const validateAddress = (address: AddressItem): boolean => {
		if (!address.recipient) {
			uni.showToast({ title: '请填写收货人名字', icon: 'none' });
			return false;
		}
		if (!address.phone || !/^1[3-9]\d{9}$/.test(address.phone)) {
			uni.showToast({ title: '请填写正确的手机号', icon: 'none' });
			return false;
		}
		if (!address.addressCity) {
			uni.showToast({ title: '请选择所在地区', icon: 'none' });
			return false;
		}
		if (!address.address) {
			uni.showToast({ title: '请填写详细地址', icon: 'none' });
			return false;
		}
		return true;
	};

	// 添加地址
	const addAddress = (newAddress: AddressItem) => {
		if (!validateAddress(newAddress)) {
			throw new Error('Invalid address data');
		}

		addressList.value.push(newAddress);
	};

	// 删除地址
	const removeAddress = (_id: string) => {
		addressList.value = addressList.value.filter((item) => item._id !== _id);
	};

	// 更新地址
	// Partial<Type>是TypeScript提供的一个工具类型,用于将对象类型的所有属性变为可选。
	const updateAddress = (_id: string, updatedData: Partial<AddressItem>) => {
		const addressIndex = addressList.value.findIndex((item) => item._id === _id);
		if (addressIndex === -1) {
			throw new Error('Address not found');
		}
		addressList.value[addressIndex] = {
			...addressList.value[addressIndex],
			...updatedData,
		};
	};

	return {
		addressList,
		defaultAddress,
		toggleDefaultAddress,
		addAddress,
		removeAddress,
		updateAddress,
	};
});
