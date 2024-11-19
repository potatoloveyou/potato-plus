import { computed } from 'vue';
const SYSTEM_INFO = uni.getSystemInfoSync();

// 获取状态栏高度
export const getStatusBarHeight = computed(() => SYSTEM_INFO.statusBarHeight || 15);

// 获取标题栏高度
export const getTitleBarHeight = computed(() => {
	if (uni.getMenuButtonBoundingClientRect) {
		const { top, height } = uni.getMenuButtonBoundingClientRect();
		return (top - getStatusBarHeight.value) * 2 + height;
	} else {
		return 50;
	}
});

// 获取导航栏高度
export const getNavBarHeight = computed(() => getStatusBarHeight.value + getTitleBarHeight.value);
