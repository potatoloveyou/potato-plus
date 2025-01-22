<template>
	<view class="login">
		<!-- #ifdef APP -->
		<button @click="appLogin">授权登录</button>
		<button @click="appLogOut">退出登录</button>
		<!-- #endif -->
	</view>
</template>

<script setup>
	import { app_getPhoneNumberLogin, appUserLogOut } from '@/api/apis.ts';

	
</script>

<style lang="scss" scoped></style>
