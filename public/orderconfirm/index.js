$('.address-wrapper').on('click', function() {
	window.location.href = '/address/index.html';
});
// 从sessionStorage中读取要下单的商品的id
var ids = JSON.parse(sessionStorage.getItem('buy'));
var account = 0;
// 发送ajax 获取要购买的ids的具本信息,并显示
$.ajax({
	url: '/cart/listbyids',
	type: 'post',
	data: { ids: JSON.stringify(ids) },
	headers: { Authorization: sessionStorage.getItem('token') },
	success: function(result) {
		if(result.status === 200) {
			result.data.forEach(function(item) {
				$(`
					<li data-id = '${ item.id}'>
						<a href = '#'>
							<img src='${item.avatar}' />
							<div class= 'product-info'>
								<h3 class='ellipsis'>${ item.name}</h3>
								<p class='ellipsis'>${item.remark}</p>
								<div class='price-wrapper'>
									 ¥ <span class='price'>${ item.price }</span>
									<span class='count'>${item.count}</span>
								</div>
							</div>
						</a>
					</li>
				`).appendTo('ul.list');
				account = 0;
				$('ul.list>li').each(function(i, item) {
					var price = $(this).find('span.price').text();
					var count = $(this).find('span.count').text();
					account += parseFloat(price) * parseFloat(count);
				});
				$('span.account').text(account);
			});
		}else {
			alert(result.message);
		}
	}
})
var addressId = 0;
var url = window.location.href;
var temp = url.slice(url.indexOf('='));
if(temp === 'l') {
	$.ajax({
		url: '/address/getdefault',
		type: 'get',
		headers: {Authorization: sessionStorage.getItem('token')},
		success: function(result) {
			if(result.status === 200) {
				addressId = result.data.id;
				$('span.address-name').text(result.data.receiveName);
				$('span.address-phone').text(result.data.receivePhone);
				$('p.address').text(`${ result.data.receiveRegion } ${ result.data.receiveDetail }`);
			}else {
				alert(result.message);
			}
		}
	});
}else {
	addressId = parseInt(temp);
	var temp = url.slice(url.indexOf('=') + 1);
		$.ajax({
		url: '/address/getmodel/' + temp,
		type: 'get',
		headers: {Authorization: sessionStorage.getItem('token')},
		success: function(result) {
			if(result.status === 200) {
				$('span.address-name').text(result.data.receiveName);
				$('span.address-phone').text(result.data.receivePhone);
				$('p.address').text(`${ result.data.receiveRegion } ${ result.data.receiveDetail }`);
			}else {
				alert(result.message);
			}
		}
	});
}


$('.btn-ok').on('click', function() {
	// 判断当前有没有一个合理的送货地址
	if(addressId === 0) { return; }
	// 发送ajax生成订单
	$.ajax({
		url: '/order/confirm',
		type: 'post',
		data: { jsonStr: JSON.stringify({ 
			ids:ids,
			account: account,
			addressId: addressId
		}) },
		headers: { Authorization: sessionStorage.getItem('token') },
		success: function(result) {
			// { status: ?, data: 新生成的订单的编号, message: ? }
			if(result.status === 200) {
				
			}else {
				alert(result.message);
			}
			sessionStorage.removeItem('buy'); 
			window.location.replace('/pay/index.html?orderId= ' + result.data );
		}
	});
})
