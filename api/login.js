import {myRequest} from '@/network/http.js'
 
export function login (config) {  //登录
	return myRequest({
		url:'/prod-api/login',
		method:'post',
		data:config
	})
}