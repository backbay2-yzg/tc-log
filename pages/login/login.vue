<template>
	<view>
		<view style="text-align:center;">
			<image :src="avatar" mode='aspectFit' class="login-logo"></image>
			<view class="login-title text-shadow">牛马日志系统 </view>
		</view>
		<!-- 页面注册板块 -->
		<u--form :model="form" ref="uForm" class="form">
			<u-form-item label="用户名:" prop="name" labelWidth='60'>
				<u--input v-model="form.username" placeholder="请输入你的名字" />
				</u--input>
			</u-form-item>
			<u-form-item label="密码:" prop="password" labelWidth='60'>
				<u--input v-model="form.password" type="password" placeholder="请输入密码"></u--input>
			</u-form-item>
		</u--form>
		<u-button class="form-btn" :loading="isLogining" type="primary" shape="square" @click="loginTc">
			{{isLogining ? '' : '登 录'}}
		</u-button>


	</view>
</template>

<script>
	import {
		login
	} from '@/api/login.js'
	export default {
		data() {
			return {
				avatar: 'http://139.9.123.100:9529/static/img/logo.21e635a2.png',
				isLogining: false,
				form: {
					username: 'Roy you',
					password: '123456',
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
					}],
				}
			}
		},
		onReady() {
					// 如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则
					this.$refs.uForm.setRules(this.rules)
		},
		methods: {
			loginTc() {
				this.$refs.uForm.validate().then(valid => {
					console.log(valid)
					if (valid) {
						console.log('验证通过');
						this.isLogining = true;
						login(this.form).then(res => {
							console.log('res' + JSON.stringify(res));
							if(res.data.code == 200){
								let token = res.data.token;
								uni.setStorageSync("admin-token",token)
						
								uni.switchTab({
									url:'/pages/writelog/writelog'
								})
							
							}
						
						})

					} else {
						console.log('验证失败');
					}
				});

			}
		}

	}
</script>

<style lang="scss" scoped>
	.login-box {
		text-align: center;
		padding-top: 10%;
	}

	.login-logo {
		width: 200upx;
		height: 150px;
	}

	.login-title {
		font-size: 60upx;
		color: #000000;
	}

	.form-item {}

	.form {
		width: 80%;
		margin: 40upx auto;
	}

	.form-btn {
		width: 80%;
	}
</style>
