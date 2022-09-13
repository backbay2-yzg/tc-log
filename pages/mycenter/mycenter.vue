<template>
	<view class="page">
		<u-button @click="clearDataCache" type="primary" color="#0ab99c" text="清理数据缓存" class="tc-mg20"></u-button>
		<u-button @click="clearUserInfo" type="primary" color="#0ab99c" text="清理用户信息" class="tc-mg20"></u-button>
		<u-button @click="logout" type="primary" color="#0ab99c" text="退出登录" class="tc-mg20">
		</u-button>
	</view>
</template>

<script>
	import {
		PROJECT_NAME_LIST,
		DAILY_TASK_TYPE_LIST,
		DAILY_RECEIVE_LIST,
		USER_INFO,
		ACCESS_TOKEN
	} from '@/common/constants.js'
	export default {
		data() {
			return {};
		},
		methods: {
			clearDataCache() {
				// uni.removeStorageSync(PROJECT_NAME_LIST);
				// uni.removeStorageSync(DAILY_TASK_TYPE_LIST);
				// uni.removeStorageSync(DAILY_RECEIVE_LIST);
				uni.clearStorageSync();
				uni.showToast({
					title: '数据缓存已清空',
					icon: 'success'
				})
			},
			clearUserInfo() {
				uni.removeStorageSync(USER_INFO);
				uni.showToast({
					title: '用户信息已清空',
					icon: 'success'
				})
			},
			logout() {
				uni.removeStorageSync(ACCESS_TOKEN);
				uni.showToast({
					title: '退出登录成功',
					icon: 'success'
				})
				uni.redirectTo({
					url: '/pages/login/login'
				})
			}
		}
	};
</script>

<style>
	.page {
		display: flex;
		flex-direction: column;
		padding: 0 40upx;
	}

	.tc-mg20 {
		margin: 20upx 0;
	}

	.logoutBtn {}
</style>
