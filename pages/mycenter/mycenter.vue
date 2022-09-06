<template>
	<view class="page"><u-button @click="submit" type="primary" color="#0ab99c" class="logoutBtn" text="退出登录"></u-button></view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {}
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
