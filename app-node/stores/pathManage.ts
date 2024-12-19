import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
export const usePathManageStore = defineStore('pathManage', () => {
	// 地址接口定义
	interface PathItem {
		isDefault: boolean;
		name: string;
		phone: string;
		paht: string;
	}
	return {};
});
