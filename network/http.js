import {
	baseURL
} from './base.js'; //导入接口的前缀地址
import {
	ACCESS_TOKEN,
	httpContentType,
	USER_INFO
} from '@/common/constants.js';
import {
	login
} from '@/api/login.js'

export const tokenRequest = (options) => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: baseURL + options.url, //接口地址：前缀+方法中传入的地址
			method: options.method || 'GET', //请求方法：传入的方法或者默认是“GET”
			data: options.data || {}, //传递参数：传入的参数或者默认传递空集合
			header: options.header || {
				'Authorization': "Bearer " + uni.getStorageSync(ACCESS_TOKEN),
				'Content-Type': httpContentType.JSON
			},
			success: (res) => {
				//返回的数据（不固定，看后端接口，这里是做了一个判断，如果不为true，用uni.showToast方法提示获取数据失败)
				if (res.data.code === 401) {
					let userInfo = uni.getStorageSync(USER_INFO);
					if (userInfo) {
						console.log("401 true userInfo: " + userInfo)
						login(userInfo).then(res => {
							let token = res.data.token;
							uni.setStorageSync("admin-token", token)
							uni.showToast({
								title: '重新登录成功',
							})
						})
					} else {
						console.log("401 false userInfo: " + userInfo)
						uni.showToast({
							title: '您还未登录，请先登录',
							icon: 'error'
						})
						uni.navigateTo({
							url: '/pages/login/login'
						})
					}
				} else if (res.data.code === 200) {
					resolve(res)
				} else {
					uni.showToast({
						title: '获取数据失败',
						icon: 'none'
					})
				}
			},
			// 这里的接口请求，如果出现问题就输出接口请求失败
			fail: (err) => {
				console.log(err)
				reject(err)
			}
		})
	})
}


export const myRequest = (options) => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: baseURL + options.url, //接口地址：前缀+方法中传入的地址
			method: options.method || 'GET', //请求方法：传入的方法或者默认是“GET”
			data: options.data || {}, //传递参数：传入的参数或者默认传递空集合
			header: {
				'Content-Type': httpContentType.JSON
			},
			success: (res) => {
				if (res.data.code === 200) {
					resolve(res)
				} else {
					uni.showToast({
						title: '获取数据失败',
						icon: 'none'
					})
				}
			},
			// 这里的接口请求，如果出现问题就输出接口请求失败
			fail: (err) => {
				console.log(err)
				reject(err)
			}
		})
	})
}
