import {tokenRequest} from '@/network/http.js'

 /* 获取项目组名称 */
export function getDetailLog (config) { 
	return tokenRequest({
		url:'/prod-api/daily/detail/list',
		method:'get',
		data:config
	})
}