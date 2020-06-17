var url = window.location.href;
var id = url.slice(url.indexOf('M'));

$.ajax({
	url: '/order/account/' + id,
	type: 'get',
	headers: {Authorization: sessionStorage.getItem('token')},
	success: function(result){
		if(result.status === 200){
			$('.account').text(result.data);
		}else{
			alert(result.message);
		}
	}
});
$('.btn-ok').on('click',function() {
	$.ajax({
		url: '/order/pay/' + id,
		type: 'get',
		headers: {Authorization: sessionStorage.getItem('token')},
		success: function(result){
			if(result.status === 200){
				alert('付款成功');
			}else{
				alert(result.message);
			}
		}
	});
	window.location.replace('/category/index.html');
});
