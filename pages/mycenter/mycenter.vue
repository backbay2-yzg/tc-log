<template>
	<view class="myContent">
		<view class="header">
			<image :src="avatar" mode="aspectFit" class="login-logo"></image>
			<text class="myInformation"><b>牛马编号：</b>{{userInfo.username}}</text>
			<text class="myInformation"><b>个性签名：</b>牛马多，任务多，多多益善</text>
		</view>
		<view class="liebiao">
			<u-album :urls="urls" keyName="src2" multiple-size='100'></u-album>
		</view>
		<view class="tc-foot">
			<u-button @click="logout" type="primary" color="#0ab99c" text="退出登录" class="tc-mg20">
			</u-button>
		</view>
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
			return {
				avatar: '../../static/logo.png',
				userInfo: {},
				urls: [
					'https://cdn.uviewui.com/uview/album/1.jpg',
					'https://cdn.uviewui.com/uview/album/2.jpg',
					'https://cdn.uviewui.com/uview/album/3.jpg',
					'https://cdn.uviewui.com/uview/album/4.jpg',
					'https://cdn.uviewui.com/uview/album/5.jpg',
					'https://cdn.uviewui.com/uview/album/6.jpg',
					'https://cdn.uviewui.com/uview/album/7.jpg',
					'https://cdn.uviewui.com/uview/album/8.jpg',
					'https://cdn.uviewui.com/uview/album/9.jpg',
					'https://cdn.uviewui.com/uview/album/10.jpg',
				],
			}
		},
		onLoad() {
			this.getMyInformation();
		},
		methods: {
			getMyInformation() {
				this.userInfo = uni.getStorageSync(USER_INFO)
			},
			clearDataCache() {
				uni.removeStorageSync(PROJECT_NAME_LIST);
				uni.removeStorageSync(DAILY_TASK_TYPE_LIST);
				uni.removeStorageSync(DAILY_RECEIVE_LIST);
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

	}
</script>

<style>
	page {
		background: #eaeaea;
	}

	.header {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20rpx;
	}

	.myInformation {
		padding: 5rpx;
	}

	.login-logo {
		width: 150rpx;
		height: 150rpx;
		padding: 20rpx;

	}

	.liebiao {
		display: flex;
		height: 650rpx;
		align-items: center;
		background: #fff;
		width: 90%;
		border-radius: 10px;
		flex-direction: column;
		justify-content: center;
		padding: 10rpx;
		margin: 0 20rpx 10rpx 20rpx;
	}

	.tc-foot {
		padding: 2%;
		margin: 10rpx 20rpx 20rpx 20rpx;
	}
</style>
