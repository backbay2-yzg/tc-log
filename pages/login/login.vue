<template>
	<view class="page">
		<view class="tips-box">
			<u-notice-bar :text="tcNotice" speed="80"></u-notice-bar>
		</view>
		<view class="login-box">
			<view class="tc-flex tc-column tc-align-item-center">
				<image :src="avatar" mode="aspectFit" class="login-logo"></image>
				<view class="login-title tc-text-shadow">牛马日志系统</view>
			</view>
			<!-- 页面注册板块 -->
			<u--form :model="form" ref="uForm" class="login-form">
				<u-form-item prop="username" class="loign-form-item">
					<u--input v-model="form.username" placeholder="请输入用户名" clearable adjustPosition></u--input>
				</u-form-item>
				<u-form-item prop="password" class="loign-form-item">
					<u--input v-model="form.password" type="password" placeholder="请输入密码" adjustPosition></u--input>
				</u-form-item>
			</u--form>
			<u-button class="login-btn" :loading="isLogining" type="primary" shape="square" @click="loginTc">
				{{ isLogining ? '' : '登录' }}
				<span></span>
				<span></span>
				<span></span>
				<span></span>
			</u-button>
		</view>
	</view>
</template>

<script>
	import {
		login
	} from '@/api/login.js';
	import {
		getProjectNames,
		getDailyTaskTypes,
		getDailyReceives
	} from '@/api/writelog.js';

	import {
		PROJECT_NAME_LIST,
		DAILY_TASK_TYPE_LIST,
		DAILY_RECEIVE_LIST,
		USER_INFO,
		ACCESS_TOKEN
	} from '@/common/constants.js';
	export default {
		data() {
			return {
				tcNotice: '登录之后会保存提交的常用不变的数据，只需要提交一次，后续写日志页面会展示数据默认值，方便快速提交日志',
				avatar: '../../static/logo.png',
				isLogining: false,
				loginText: '登 录',
				form: {
					username: '',
					password: '',
					rememberMe: false
				},
				rules: {
					username: [{
						type: 'string',
						required: true,
						message: '请填写用户名',
						trigger: ['change', 'blur']
					}],
					// 字段名称
					password: [{
						type: 'string',
						required: true,
						message: '密码要6个数字',
						trigger: 'change'
					}]
				}
			};
		},
		onLoad() {
			let userInfo = uni.getStorageSync(USER_INFO);
			if (userInfo) {
				this.form.username = userInfo.username;
				this.form.password = userInfo.password;
			}
		},
		onReady() {
			// 如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			loginTc() {
				this.$refs.uForm.validate().then(valid => {
					// console.log(valid)
					if (valid) {
						console.log('验证通过');
						this.isLogining = true;
						login(this.form).then(res => {
							// console.log('res' + JSON.stringify(res));
							this.isLogining = false;
							if (res.data.code === 200) {
								let userInfo = {};
								userInfo.username = this.form.username;
								userInfo.password = this.form.password;
								uni.setStorageSync(USER_INFO, userInfo);
								let token = res.data.token;
								uni.setStorageSync(ACCESS_TOKEN, token);
								this.getDataInfo().then(() => {
									uni.switchTab({
										url: '/pages/writelog/writelog'
									});
								});
							}
						}).catch(err => {
							this.isLogining = false;
						});
					} else {
						console.log('验证失败');
					}
				});
			},
			getDataInfo() {
				return new Promise((resolve, reject) => {
					this.getFormDataInfo(resolve);
				}).catch(err => {
					console.log(err);
					reject();
				});
			},
			async getFormDataInfo(resolve) {
				await getProjectNames().then(res => {
					let projectNames = [];
					let projectsList = res.data.data;
					for (let i in projectsList) {
						//项目组id
						let projectId = projectsList[i].dailyProjectId;
						//工程英文名
						let projectName = projectsList[i].projectName;
						let obj = {
							id: projectId,
							name: projectName
						};
						projectNames.push(obj);
					}
					uni.setStorageSync(PROJECT_NAME_LIST, projectNames);
				});
				await getDailyTaskTypes().then(res => {
					let dailyTaskTypes = [];
					let dailyTaskTypeList = res.data.data;
					for (let i in dailyTaskTypeList) {
						//项目组id
						let typeId = dailyTaskTypeList[i].dictValue;
						//工程英文名
						let typeName = dailyTaskTypeList[i].dictLabel;
						let obj = {
							id: typeId,
							name: typeName
						};
						dailyTaskTypes.push(obj);
					}
					uni.setStorageSync(DAILY_TASK_TYPE_LIST, dailyTaskTypes);
				});
				await getDailyReceives().then(res => {
					let dailyReceiveNames = [];
					let dailyReceiveList = res.data.data;
					for (let i = 3; i < dailyReceiveList.length; i++) {
						//用户d
						let userId = dailyReceiveList[i].userId;
						//用户名
						let fullName = dailyReceiveList[i].nickName + '(' + dailyReceiveList[i].userName + ')';
						let obj = {
							id: userId,
							name: fullName,
							checked: false
						};
						dailyReceiveNames.push(obj);
					}
					uni.setStorageSync(DAILY_RECEIVE_LIST, dailyReceiveNames);
				});
				resolve();
			}
		}
	};
</script>

<style lang="scss" scoped>
	.tc-flex {
		display: flex;
	}

	.tc-column {
		flex-direction: column;
	}

	.tc-center {
		// align-items: center;
		text-align: center;
	}

	.tc-mg8 {
		margin: 8px;
	}

	.tc-mgl8 {
		margin-left: 8px;
	}

	.tc-mgr8 {
		margin-right: 8px;
	}

	.tc-align-item-center {
		align-items: center;
	}

	// .tips-item{
	// 	display: flex;
	// 	flex
	// }
	.page {
		/*弹性布局 让页面元素垂直+水平居中*/
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		// margin-bottom: 10%;
		align-items: center;
		/*让页面始终占浏览器可视区域总高度*/
		height: 100vh;
		// background: linear-gradient(#141e30, #243b55);
		background-image: linear-gradient(to top, #55aaff, #ffaaff);
	}

	.tips-box {
		width: 90%;
		position: fixed;
		left: 5%;
		top: 5%;
		padding-top: 40rpx;

	}

	.login-box {
		margin: 0 auto;
		padding: 50rpx;
		width: 80%;
		background-color: rgba(0, 0, 0, 0.2);
		box-shadow: 0 15px 25px rgba(0, 0, 0, 0.4);
	}

	.login-logo {
		width: 200rpx;
		height: 200rpx;
		padding: 20rpx;
	}

	.login-title {
		font-size: 65rpx;
		color: #fff;
		padding: 10rpx;
	}

	.loign-form-item {}

	.login-btn {
		color: #fff;
		// background-image: linear-gradient(to top, #243b55, #243b55);
		background-color: #243b55;
		margin-bottom: 20rpx;
	}

	.login-btn span {
		position: absolute;
	}

	.login-btn span:first-child {
		top: 0;
		left: -100%;
		width: 100%;
		height: 2px;
		/*to right 就是往右边 下面的同理*/
		background: linear-gradient(to right, transparent, #03e9f4);
		/*动画 名称  时长 linear是匀速运动 infinite是无限次运动*/
		animation: move1 1s linear infinite;
	}

	.login-btn span:nth-child(2) {
		right: 0;
		top: -100%;
		width: 2px;
		height: 100%;
		background: linear-gradient(transparent, #03e6f4);
		/*这里多了个0.25s其实是延迟时间*/
		animation: move2 1s linear 0.25s infinite;
	}

	.login-btn span:nth-child(3) {
		right: -100%;
		bottom: 0;
		width: 100%;
		height: 2px;
		background: linear-gradient(to left, transparent, #03e9f4);

		animation: move3 1s linear 0.5s infinite;
	}

	.login-btn span:last-child {
		left: 0;
		bottom: -100%;
		width: 2px;
		height: 100%;
		background: linear-gradient(#03e9f4, transparent);
		animation: move4 1s linear 0.75s infinite;
	}

	/*写一下动画 */
	@keyframes move1 {
		0% {
			left: -100%;
		}

		50%,
		100% {
			left: 100%;
		}
	}

	@keyframes move2 {
		0% {
			top: -100%;
		}

		50%,
		100% {
			top: 100%;
		}
	}

	@keyframes move3 {
		0% {
			right: -100%;
		}

		50%,
		100% {
			right: 100%;
		}
	}

	@keyframes move4 {
		0% {
			bottom: -100%;
		}

		50%,
		100% {
			bottom: 100%;
		}
	}
</style>
