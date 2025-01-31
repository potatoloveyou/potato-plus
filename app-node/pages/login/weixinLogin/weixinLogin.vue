<template>
	<view class="weixinLogin">
		<NavBar>
			<template #titleBar-slot>
				<view class="wx-app-index-nav">
					<view>
						<text class="iconfont icon-guanbi" @click="goIndex"></text>
					</view>
					<text class="nav-text">登录页</text>
					<view></view>
				</view>
			</template>
		</NavBar>

		<view class="logo">
			<image class="logo-img" src="/static/imgs/xxmLogo.png" mode=""></image>
		</view>

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
				<!-- <button class="get-verify" plain="true" :disabled="!validatePhone || !validateEmail" @click="getEmailVerify">
					获得邮箱验证码
				</button> -->
				<view
					class="get-verify"
					:class="!validatePhone || !validateEmail || isVerify ? 'none' : 'auto'"
					@click.stop="getEmailVerify">
					{{ countMsg }}
				</view>
			</view>
			<button
				class="submit"
				:disabled="!validatePhone || !validateEmail || validateCode"
				form-type="submit"
				type="primary">
				一键登录
			</button>
		</form>
	</view>
</template>

<script setup>
	import { ref, computed } from 'vue';

	import NavBar from '@/components/common/NavBar.vue';

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

	const isVerify = ref(false);
	const countdown = ref(60);
	const countMsg = computed(() => {
		return isVerify.value ? `${countdown.value}s 后重新获取` : '获得邮箱验证码';
	});

	// 发送邮箱验证码
	const getEmailVerify = async () => {
		if (!validatePhone.value || !validateEmail.value || isVerify.value) return;
		try {
			await getWeixinEmailVerify(formData.value);
			uni.showToast({ title: '验证码已发送', icon: 'none' });

			isVerify.value = true; // 禁用按钮

			const timer = setInterval(() => {
				countdown.value -= 1;

				if (countdown.value <= 0) {
					clearInterval(timer);
					countdown.value = 60; // 重置倒计时
					isVerify.value = false; // 倒计时结束，启用按钮
				}
			}, 1000);
		} catch (error) {
			uni.showToast({ title: '发送验证码失败', icon: 'none' });
		}
	};

	// 表单提交
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

						const response = await weixinLogin(data);
						// console.log('response', response);

						if (response.code !== 5) {
							console.log('有错，登录不了', response);
							return;
						}

						uni.showToast({
							title: '登录成功',
							icon: 'none',
						});

						uni.switchTab({
							url: '/pages/tabBar/index/index',
						});
					},
				});
			},
		});
	};

	const goIndex = () => {
		uni.switchTab({
			url: '/pages/tabBar/index/index',
		});
	};
</script>

<style lang="scss" scoped>
	.df-jcc-aic {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.weixinLogin {
		height: 100vh;
		.wx-app-index-nav {
			width: 100%;
			display: flex;
			align-items: center;
			& > view {
				flex: 1;
			}
			.iconfont {
				font-size: 50rpx;
				margin-left: 40rpx;
			}
			.icon-guanbi {
			}
			.nav-text {
			}
		}

		.logo {
			@extend .df-jcc-aic;
			padding: 100rpx 0;
			.logo-img {
				width: 300rpx;
				height: 300rpx;
			}
		}

		.form {
			.clean-wrapper {
				display: flex;
				align-items: center;
				background-color: #f0f0f0;
				margin: 0 70rpx 30rpx;
				border-radius: 50rpx;
				overflow: hidden;
				font-size: 28rpx;
				.input {
					flex: 1;
					line-height: 80rpx;
					height: 80rpx;
					padding: 0 30rpx;
				}
				.uni-icon {
					width: 80rpx;
					height: 80rpx;
					@extend .df-jcc-aic;
					justify-content: center;
				}
				.get-verify {
					padding: 0 20rpx;
				}
				.auto {
					pointer-events: auto;
					color: #1aad19;
				}
				.none {
					pointer-events: none;
					opacity: 0.3;
				}
			}
			.clean-wrapper {
				.input {
				}
				.uni-icon {
				}
			}
			.clean-wrapper {
				.input {
				}
				.get-verify {
				}
				.none {
				}
				.auto {
				}
			}

			.submit {
				margin: 0 70rpx;
				border-radius: 50rpx;
			}
		}
		button {
		}
	}
</style>
