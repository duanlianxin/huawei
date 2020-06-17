$('ul.nav>li').on('click',function() {
	if($(this).hasClass('active')) return;
	$(this).addClass('active').siblings('.active').removeClass('active');
	contentScroll.goToPage($(this).index(),0);
});

var contentScroll = null;
function initContentScroll(){
	$('.content').width ($('.content>div').length + '00%');
	contentScroll = new IScroll($('.content-wrapper').get(0), {
		scrollX: true,
		scrollY: false,
		snap:true,
		momentum:false,
	});
	contentScroll.on('scrollEnd',function() {
		var index = contentScroll.currentPage.pageX;
		$('ul.nav>li').eq(index).addClass('active').siblings('.active').removeClass('active');
		
	});
}
initContentScroll();
$.ajax({
	url: '/order/list/all',
	type: 'get',
	headers: { Authorization: sessionStorage.getItem('token') },
	success: function(result) {
		
		if(result.status === 200) {
			result.data.forEach(function(item){
				$(`
					<li>
						<div>订单编号 ${item.orderId}</div>
						<div>订单时间 ${item.orderTime}</div>
						<div>是否支付 ${item.isPay}</div>
						<div class='acc'>付款金额 ¥ ${item.account}</div>
					</li>
				`).appendTo('ul.fullOrders-list');
		
			});
		
		} else {
			alert(result.message);
		}
	}
});

$.ajax({
	url: '/order/list/pay',
	type: 'get',
	headers: { Authorization: sessionStorage.getItem('token') },
	success: function(result) {
		if(result.status === 200) {
			result.data.forEach(function(item){
				$(`
					<li>
						<div>订单编号 ${item.orderId}</div>
						<div>订单时间 ${item.orderTime}</div>
						<div>是否支付 ${item.isPay}</div>
						<div class='acc'>付款金额 ¥ ${item.account}</div>
					</li>
				`).appendTo('ul.paid-list');
			});
		
		} else {
			alert(result.message);
		}
	}
});
$.ajax({
	url: '/order/list/unpay',
	type: 'get',
	headers: { Authorization: sessionStorage.getItem('token') },
	success: function(result) {
		if(result.status === 200) {
			result.data.forEach(function(item){
				$(`
					<li>
						<div>订单编号 ${item.orderId}</div>
						<div>订单时间 ${item.orderTime}</div>
						<div>是否支付 ${item.isPay}</div>
						<div class='acc'>付款金额 ¥ ${item.account}</div>
					</li>
				`).appendTo('ul.obligation-list');
			});
		
		} else {
			alert(result.message);
		}
	}
});

