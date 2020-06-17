// 此文件中保存和整个服务器相关重要配置
exports.dbConfig = {
	host: 'localhost',
	database: 'huawei',
	user: 'root',
	password: '123'
};

exports.httpResult = {
	// 成功
	success: (data = null, message = '') => ({ status: 200, data, message }),
	// 逻辑失败
	failure: (data = null, message = '') => ({ status: 199, data, message }),
	// 物理失败
	error: (data = null, message = '') => ({ status: 500, data, message }),
	// 权限验证失败
	untoken: (data = null, message = '') => ({ status: 401, data, message }),
	// 不存在
	notFound: (data = null, message = '') => ({ status: 404, data, message })
};