<script>
	import routerPermission from '@/utils/isLogin.ts';

	export default {
		onLaunch: function () {
			//#ifdef APP-PLUS || MP-WEIXIN
			routerPermission();
			//#endif
			console.log('App Launch');
		},
		onShow: function () {
			console.log('App Show');
		},
		onHide: function () {
			console.log('App Hide');
		},
	};
</script>

<style>
	/*每个页面公共css */
	@import '@/common/css/uni.css';
	@import '@/common/css/common.scss';
	@import '@/common/css/iconfont.css';
	@font-face {
		font-family: CustomFont;
		/* src: url('../../static/iconfont.ttf'); */
		src: url('./static/iconfont.ttf');
	}
</style>
