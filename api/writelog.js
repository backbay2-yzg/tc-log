import {tokenRequest} from '@/network/http.js'

 /* 获取项目组名称 */
export function getProjectNames (config) { 
	return tokenRequest({
		url:'/prod-api/daily/project/list_status?status=2',
		method:'get',
		data:config
	})
}
/* 获取职务类型（开发-测试-设计-产品等） */
export function getDailyTaskTypes (config) { 
	return tokenRequest({
		url:'/prod-api/system/dict/data/type/daily_task_type',
		method:'get',
		data:config
	})
}

export function getDailyReceives (config) { 
	return tokenRequest({
		url:'/prod-api/system/user/listAll?status=0',
		method:'get',
		data:config
	})
}

//提交日志
export function submitDailyLog(config) { 
	return tokenRequest({
		url:'/prod-api/daily/detail',
		method:'post',
		data:config
	})
}
