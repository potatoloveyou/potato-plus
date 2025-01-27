<template>
	<view class="weixinLogin">
		<!-- <view class="logo">
			<image class="logo-img" src="/static/imgs/xxmLogo.png" mode=""></image>
		</view> -->

		<form class="form" @submit="formSubmit">
			<view class="clean-wrapper">
				<input
					class="input"
					v-model="formData.phone"
					name="phone"
					type="tel"
					inputmode="tel"
					auto-blur="true"
					placeholder="请输入手机号" />
				<text class="uni-icon" v-if="showPhoneClearIcon" @click="clearPhoneIcon">&#xe434;</text>
			</view>

			<view class="clean-wrapper">
				<input
					class="input"
					v-model="formData.email"
					name="email"
					type="email"
					inputmode="email"
					auto-blur="true"
					placeholder="请输入邮箱" />
				<text class="uni-icon" v-if="showEmailClearIcon" @click="clearEmailIcon">&#xe434;</text>
			</view>

			<view class="clean-wrapper">
				<input
					class="input"
					v-model="formData.verificationCode"
					name="verificationCode"
					type="text"
					inputmode="text"
					placeholder="请输入邮箱验证码" />
				<button :disabled="!validatePhone || !validateEmail" @click="getEmailVerify">获得邮箱验证码</button>
			</view>
			<button class="submit" :disabled="!validatePhone || !validateEmail || validateCode" form-type="submit">
				提交
			</button>
		</form>
	</view>
</template>

<script setup>
	import { ref, computed } from 'vue';
	import { getWeixinEmailVerify, weixinLogin } from '@/api/apis.ts';

	const formData = ref({
		phone: '',
		email: '',
		verificationCode: '',
	});

	// 是否显示清除图标
	const showPhoneClearIcon = computed(() => formData.value.phone);
	const showEmailClearIcon = computed(() => formData.value.email);

	const clearPhoneIcon = (e) => {
		formData.value.phone = '';
	};

	const validatePhone = computed(() => /^1[3-9]\d{9}$/.test(formData.value.phone));

	const validateEmail = computed(() => /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(formData.value.email));

	const validateCode = computed(() => !formData.value.verificationCode);

	const getEmailVerify = async () => {
		if (validatePhone.value && validateEmail.value) {
			uni.showToast({ title: '验证码已发送', icon: 'none' });
			await getWeixinEmailVerify(formData.value);
		}
	};

	const formSubmit = (e) => {
		uni.login({
			provider: 'weixin',
			success(success) {
				const { code } = success;
				uni.getSystemInfo({
					async success(res) {
						const { deviceBrand, deviceModel, osVersion } = res;
						const data = {
							...e.detail.value,
							js_code: code,
							deviceInfo: {
								// 设备品牌类型
								deviceName: `${deviceBrand} ${deviceModel}`,
								// 操作系统版本
								osVersion,
								// 登录方式
								provider: `weixin`,
							},
						};
						// console.log('data', data);

						const response = await weixinLogin(data);
						console.log(response);
					},
				});
			},
		});
	};
</script>

<style lang="scss" scoped>
	.df-aic {
		display: flex;
		align-items: center;
	}
	.weixinLogin {
		.phone-register {
		}
		.form {
			.clean-wrapper {
				display: flex;
				align-items: center;
				background-color: #f0f0f0;
				margin: 50rpx 0;
				.input {
					flex: 1;
					line-height: 100rpx;
					height: 100rpx;
				}
				.uni-icon {
					width: 100rpx;
					height: 100rpx;
					@extend .df-aic;
					justify-content: center;
				}
			}
			.verify {
				input {
				}
			}
			button {
			}
		}

		.weixinLogin-title {
			width: 100%;
			height: 100vh;
			.iconfont {
				font-size: 60rpx;
			}
			.icon-guanbi {
			}
			.logo {
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 120rpx 0;
				.logo-img {
					width: 180rpx;
					height: 180rpx;
				}
			}
			.phone-register {
				width: 100%;
				height: 100rpx;
				line-height: 100rpx;
				text-align: center;
				color: #fff;
				background-color: #49bdfb;
				border-radius: 50rpx;
			}
		}
	}
</style>
