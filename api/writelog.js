import {myRequest} from '@/network/http.js'

 /* 获取项目组名称 */
export function getProjectNames (config) { 
	return myRequest({
		url:'/api/daily/project/list_status?status=2',
		method:'get',
		data:config
	})
}
/* 获取职务类型（开发-测试-设计-产品等） */
export function getDailyTaskTypes (config) { 
	return myRequest({
		url:'/api/system/dict/data/type/daily_task_type',
		method:'get',
		data:config
	})
}