function http(options) {					// option表示用户调用ajax时的自定义配置	
	var defaultOptions = {					// defaultOption记录调用http时都可能会相同的默认配置
		method: 'post',
		dataType: 'json',
		// 请求携带token
		headers: {	
			'Authorization': Cookies.get('token')
		}
	};
	Object.assign(defaultOptions, options);	// 合并默认配置和用户自定义配置
	return new Promise(resolve => {
		Notice.loading.show();				// 示显loading
		setTimeout(() => {
			$.ajax({
				...defaultOptions,
				success: result => {		// 如果ajax成功让promise变为成功并携带返回的数据
					if(result.message !== '') alert(result.message);
					switch(result.status) {
						case 200: 
							resolve(result.data);
							break;
						case 401:
							Cookies.remove('token');
							Cookies.set('target', window.location.href);
							window.location.replace('/pages/login/index.html');
						case 199:
						case 500:
						
						case 404:
							break;
					}
				},
				// 什么也不做，让promise永远是pending
				error: (xhr, textStatus) => alert(textStatus),
				complete: () => Notice.loading.hide()
			});
		}, 1000);
	});
}


// 一个promise往往封装了一段异步的耗时的代码,这段代码执行时,有可能会成功,也有可能会因为
// 知各原因失败,出bug, 成功我们可以调用resolve让promise变成成功状态,失败我们可以调用
// reject让promise变成失败; 但是我们总是期望成功,调用then绑定的函数,不想去关心失败的情况
// 如果真的失败了,我们让promise变成了失败的状态而我们又不去catch处理这个失败的情况,代码就
// 会报异常.
