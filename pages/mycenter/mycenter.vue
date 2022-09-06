<template>
	<view class="page"><u-button @click="logout" type="primary" color="#0ab99c" class="logoutBtn" text="退出登录"></u-button></view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {
		logout(){
			uni.clearStorageSync("admin-token");
			uni.showToast({
				title: '退出登录成功',
				icon: 'none'
			})
			uni.navigateTo({
				url:'/pages/login/login'
			})
		}
	}
};
</script>

<style>
.page {
	display: flex;
	flex-flow: row wrap;
}
.logoutBtn {
	align-self: flex-end;
}
</style>
