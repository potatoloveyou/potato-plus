export const setAccessToken = (token: string) => {
	uni.setStorage({
		key: 'accessToken',
		data: token,
	});
};

export const setRefreshToken = (token: string) => {
	uni.setStorage({
		key: 'refreshToken',
		data: token,
	});
};

export const getAccessToken = () => {
	const accessToken = uni.getStorageSync('accessToken');
	return accessToken;
};

export const getRefreshToken = () => {
	const refreshToken = uni.getStorageSync('refreshToken');
	return refreshToken;
};
