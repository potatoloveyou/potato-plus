import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useVariousBarStore = defineStore('variousBar', () => {
	const variousBar = ref([]);
	return {
		variousBar,
	};
});
