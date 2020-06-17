//获取跳转的数据
var search = window.location.search;
var id = parseInt(search.slice(search.indexOf('=') + 1));
var count = 1;
//发送ajax请求数据获取数据
$.ajax({
	url: '/product/model/' + id,
	type: 'get',
	success: function(result) {
		if(result.status === 200) {
		var banner = result.data.banner.split(',');
		banner.forEach(function(item){
			$(`
				<div class="swiper-slide">
					<img src= '${item}' class= 'banner'/>
				</div>
			`).appendTo('.swiper-wrapper');
		});
		var mySwiper = new Swiper('.swiper-container', {
			loop: true,
		});
		$(`
			<div class='price-wrapper'>
				<span class='price'>
					¥ ${result.data.price}
				<span>
			</div>
			<div class='name-wrapper'>
				<span class='name'>
					${result.data.name}
				<span>
			</div>
			<div class='remark-wrapper'>
				<span class='remark'>
					${result.data.remark}
				<span>
			</div>
		`).appendTo('.product');
		} else {
			alert(result.message);
		}
	}
});
var heights = [];
$('.content>*').each(function(i,item) {
	heights.push($(item).offset().top - $('.header').height());
});
//监听header滚动 
$('.content').on('scroll',function() {
	$('.header').css({
		display: $(this).scrollTop() > 0 ? 'block' : 'none'
	});
	//根据当前滚动的实时位置结合heights数组动态维护header
	for(var i = 0; i < heights.length; i++){
		if($(this).scrollTop() < heights[i]) break;
	}
	$('.header li').eq(i - 1).addClass('active').siblings().removeClass('active');
});
//监听header点击事件
$('.header li').on('click', function() {
	$('.content').animate({scrollTop: heights[$(this).index()]},200);
});
// 如果登录了，发送ajax获取当前登录用户购物车中的总商品数并进行显示
if(sessionStorage.getItem('user')) {
	$.ajax({
	url: '/cart/total',
	type: 'get',
	headers: {
		'Authorization': sessionStorage.getItem('token')
	},
	success: function(result){
		if(result.status === 200) {
			$('span.cart-total').text(result.data).show();
		} else {
			alert(result.message);
		}
	}
})
}
// 点击购物车弹出界面
$('.btn-toggle').on('click',function() {
	$('.dialog-wrapper').show();
});
//取消界面
$('.dialog-wrapper').on('click', function(e) {
	if(e.target === e.currentTarget) $(this).toggle();
});
//数量加减
$('span.increase').on('click',function() {
	if(count === 5) return;
	count++;
	$('.count').text(count);
	$('span.decrease').removeClass('disabled');
	if(count === 5) $(this).addClass('disabled');
});
$('span.decrease').on('click',function() {
	if(count === 1) return;
	count--;
	$('.count').text(count);
	$('span.increase').removeClass('disabled');
	if(count === 1) $(this).addClass('disabled');
});
////加入购物车并确定
$('.btn-ok').on('click',function() {
	if(sessionStorage.getItem('token')) {
		$.ajax({
			url: '/cart/add',
			type: 'post',
			data: { jsonStr: JSON.stringify({ pid: id, count: count }) },
			headers: {
				'Authorization': sessionStorage.getItem('token')
			},
			success: function(result){
				if(result.status === 200) {
					alert('添加成功');
					$('span.cart-total').text(parseInt($('span.cart-total').text()) + count).show();
					$('.dialog-wrapper').toggle();
				} else {
					alert(result.message);
				}
			}
		});
	} else {
		var url = window.location.href;
		sessionStorage.setItem('target',url);
		window.location.href = ('/login/index.html');
	}
});