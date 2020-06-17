$('.required').on('blur', function() {
	if($(this).val().trim().length === 0) {
		$(this).next().text($(this).attr('data-required-message'));
	}else {
		$(this).next().text('');
	}
});

$('input.btn-login').on('click', function() {
	//事件模拟触发相关表单元素的事件
	$('input.name, input.pwd').trigger('blur');
	//如果有错就return就返回，不发送ajax
	if($('span.error:not(:empty)').length > 0) return;
	$.ajax({
		url: '/user/login/pwd',
		type: 'post',
		data: {
			name: $('.name').val(),
			pwd: $('.pwd').val(),
		},
		success: function(result) {
			if(result.status === 200) {
				//将令牌保存起来（以备后续使用）
				sessionStorage.setItem('token', result.data);
				//还有什么信息登录后要用的，但是现在严赶紧藏的
				sessionStorage.setItem('user', $('.name').val());
				//跳到该跳到的页面
				window.location.replace(sessionStorage.getItem('target') || '/home/index.html');
			} else {
				alert(result.message);
			}
		}
	});
});