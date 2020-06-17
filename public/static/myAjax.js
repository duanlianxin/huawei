function myAjax(options) {
	return new Promise(function(resolve, reject) {
		$.ajax({
			...options,
			success: function(result) {
				if(result.status === 200) resolve(result.data);
				else reject(result.message);
			},
			error: function(error) {
				reject('服务器连接失败');
			}
		});
	}).catch(error) {
		
	}
}