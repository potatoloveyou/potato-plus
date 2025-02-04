import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { getUserAddress } from '@/api/apis.ts';

export const useAddressManageStore = defineStore('addressManage', () => {
	const addressList = ref([]);

	// 地址接口定义
	interface AddressItem {
		isDefault: boolean;
		recipient: string;
		phone: string;
		addressCity: string;
		address: string;
	}
	// 验证地址格式
	const validateAddress = (address: AddressItem): boolean => {
		if (!address.addressCity) {
			uni.showToast({ title: '请选择所在地区', icon: 'none' });
			return false;
		}
		if (!address.address) {
			uni.showToast({ title: '请填写详细地址', icon: 'none' });
			return false;
		}
		if (!address.recipient) {
			uni.showToast({ title: '请填写收货人名字', icon: 'none' });
			return false;
		}
		if (!address.phone || !/^1[3-9]\d{9}$/.test(address.phone)) {
			uni.showToast({ title: '请填写正确的手机号', icon: 'none' });
			return false;
		}
		uni.showToast({ title: '地址保存成功', icon: 'success' });
		return true;
	};

	// 获取用户收货地址
	const getUserAddressData = async (queryparams: object) => {
		const res = await getUserAddress(queryparams);
		addressList.value = res.data;
	};

	// 计算默认地址
	const defaultAddress = computed(() => {
		return addressList.value.find((item: { isDefault: boolean }) => item.isDefault);
	});

	// 选择地址
	const selectAddress = ref({});

	return {
		addressList,
		validateAddress,
		getUserAddressData,
		defaultAddress,
		selectAddress,
	};
});
