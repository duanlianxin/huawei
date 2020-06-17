$.extend({
	$notice: function(message) {
		var $notice = 
			$('<p></p>')
				.text(message)
				.css({
					position: 'fixed',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					padding: '5px 10px',
					backgroundColor: '#000',
					color: '#fff',
					fontSize: '12px',
					whiteSpace: 'nowrap',
				})
				.appendTo('body');
		setTimeout(function() {
			$notice.hide(400, function() {
				$(this).remove();
			});
		}, 2000);
	}
});

$.extend({
	// 自定义的promise版的ajax
	$myAjax: function(options) {
		return new Promise(function(resolve, reject) {
			// 发送ajax前显示一个loading遮罩，一方面提高用户体验，另一方面有效防止用户快速恶意触发ajax
			var $loading = $('<div><p>loading..</p></div>')
				.css({
					position: 'fixed',
					left: '0',
					top: '0',
					width: '100%',
					height: '100%',
					zIndex: 10000,
					backgroundColor: 'rgba(255, 255, 255, 0.9)',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center'
				}).appendTo('body');
			// 改版的代码
			$.ajax({
				...options,
				// ajax最后收尾的回调函数（不管是成功还是失败）
				complete: function() {	
					// 去除loading效果
					setTimeout(function() { $loading.remove(); }, 1000);
				},
				// success表示的是物理上的成功。连上了服务器而且成功响应了,响应的结果可能是逻辑上的成功,也可能是逻辑上的失败
				success: function(result) {
					setTimeout(function() {
						if(result.status === 200) resolve(result.data);
						else reject(result.message);
					}, 1000);
				},
				// 物理上的失败(连不上网、服务器关了、请求的url错了等等)
				error: function(error) {
					setTimeout(function() { reject('服务器连接失败，请稍后再试..'); }, 1000);
				}
			});
		}).catch(function(message) {
			// 这个catch的回调函数的作用非常重要,集中处理错误, 如果有错统一提示错误, 
			// 并故意返回一个"永远pending的promise对象",截断后续绑定函数的执行
			$.$notice(message);
			return new Promise(function() {});
		});
	}
});