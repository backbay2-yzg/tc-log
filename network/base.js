let baseURL = '';
// 是否在控制台显示接口请求日志,本地环境启用,打包环境禁用
let showHttpLog = true;
// 测试环境
// baseURL = 'http://139.9.123.100:9529/prod-api';
// baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8080/api' : 'http://139.9.123.100:9529/prod-api'
baseUrl = process.env.NODE_ENV === 'development' ? '/api' : 'http://139.9.123.100:9529'

// 正式环境
// baseURL = 'XXXXX.XXXXX.com';
module.exports = {
	baseURL: baseURL,
	showHttpLog: showHttpLog
}
