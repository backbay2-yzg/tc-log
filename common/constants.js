//=================说明================================
/**
 * 命名规范:首字母小写,驼峰命名,值为全大写下划线
 */
//====================详情==============================
/**
 * 网络状态码
 */
export const httpCode = {
	/** 成功 */
	SUCCESS: 200,
	/** 警告 */
	WARN: 301,
	/**
	 * jwt验证失败
	 */
	JWTFAIL: 403,
	/**
	 * jwt过期重新请求用户的身份认证
	 */
	JWTEXPIRE: 401,
	/** 错误 */
	ERROR: 500,
};

/**
 * request请求参数
 */
export const httpContentType = {
	URL_ENCODED: "application/x-www-form-urlencoded; charset=utf-8",
	JSON: "application/json;charset=utf-8",
}

export const USER_INFO = 'userinfo'
export const ACCESS_TOKEN = 'admin-token'
export const PROJECT_NAME_LIST = 'project-name-list'
export const DAILY_TASK_TYPE_LIST = 'daily-task-type-list'
export const DAILY_RECEIVE_LIST = 'daily-receive-list'
export const LOG_FORM_DATA = 'log-form-data'
