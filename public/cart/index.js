//还有两个毛病：
	// 1、反选问题，有时候反选不能触动全选；
	// 2、删除事件  刷新后编辑再次出现并且友情提示去购物没有触发
//返回前一个页面
$('.back').on('click',function() {
	window.history.go(-1);
});
// 更新页脚
function updataFooter() {
	//金额更新
	var account = 0;
	$('.content i.checkbox.ok.checked').each(function(i, item) {
		var price = $(this).parent().find('span.price').text();
		var count = $(this).parent().find('span.count').text();
		account += parseFloat(price) * parseFloat(count);
	});
	$('span.account').text(account);
	//数量更新
	var total = 0;
	$('.content i.checkbox.ok.checked').each(function(i, item) {
		var count = $(this).parent().find('span.count').text();
		total += parseInt(count);
	});
	$('span.total').text(total);
}
if(sessionStorage.getItem('token')) {
	$.ajax({
  	url: '/cart/list',
	type: 'post',
	headers: { Authorization: sessionStorage.getItem('token') },
	success: function(result) {
		if(result.status === 200) { 
			if(result.data.length > 0) {
				$('ul.list').show();
				showDate(result.data);
				bindEvent();
			} else {
				$('.empty-cart').show();
				$('.footer').hide();
			}
			
		} else {
			alert(result.message);
		}
	}
})
} else {
	$('.unlogin').show();
	var url = window.location.href;
	sessionStorage.setItem('target',url);
	$('.footer').hide();
}
function showDate(data) {
	data.forEach( function(item) {
		$(`
			<li data-id = '${ item.id}'>
				<i class = 'checkbox  ok checked '></i>
				<i class = 'checkbox  edit'></i>
				<a href = '/detail/index.html?id=${ item.pid }'>
					<img src='${item.avatar}' />
					<div class= 'product-info'>
						<h3 class='ellipsis'>${ item.name}</h3>
						<p class='ellipsis'>${item.remark}</p>
						<div class='price-wrapper'>
							¥ <span class='price'>${ item.price }</span>
						</div>
					</div>
				</a>
				<div class='count-wrapper'>
					<span class='decrease ${item.count !== 1 ? '' : 'disabled'}'>-</span>
					<span class='count'>${item.count}</span>
					<span class='increase ${item.count !== 5 ? '' : 'disabled'}'>+</span>
				</div>
			</li>
		`).appendTo('ul.list');
	});
	updataFooter();
}
//给动态拼接的绑定点击事件
function bindEvent() {
	//反选
	$('ul.list>li i.checkbox').on('click', function() {
		$(this).toggleClass('checked');
		var sort = $(this).hasClass('ok') ? 'ok' : 'edit';
		$(`.content i.checkbox.${ sort }:not(".checked")`).length === 0
			? $(`i.checkbox.all.${ sort }`).addClass('checked')
			: $(`i.checkbox.all.${ sort }`).removeClass('checked');
		updataFooter();
	});
	//数量加减
	// 减
	$('span.decrease').on('click',function(e) {
		var $count = $(this).next(); //获取下一个兄弟
		var count = parseInt($count.text());
		if(count === 1) {
			alert('已达到购买数量下限..');
			$(this).addClass('disabled');
			return;
		}
		var id = $(this).closest('li').attr('data-id');
		$.ajax({
			url: '/cart/decrease/' + id,
			type:'post',
			headers: { Authorization: sessionStorage.getItem('token') },
			success: function(result) { 
				if(result.status === 200) {
					count--;
					$count.text(count).next().removeClass('disabled');
					updataFooter();
				} else {
					alert(result.message);
				}
			}
		});
	});
	// 加
	$('span.increase').on('click',function(e) {
		var $count = $(this).prev(); //获取上一个兄弟
		var count = parseInt($count.text());
		if(count === 5) {
			alert('已达到购买数量上限..');
			$(this).addClass('disabled');
			return;
		}
		var id = $(this).closest('li').attr('data-id');
		$.ajax({
			url: '/cart/increase/' + id,
			type:'post',
			headers: { Authorization: sessionStorage.getItem('token') },
			success: function(result) { 
				if(result.status === 200) {
					count++;
					$count.text(count).prev().removeClass('disabled');
					updataFooter();
				} else {
					alert(result.message);
				}
			}
		});
	});
}

//编辑点击事件
$('.s-edit').on('click', function() {
	//自身的变化
	$(this).text($(this).text() === '编辑' ? '完成' : '编辑');
	//footer页面的转变
	$('.footer,.content i.checkbox').toggle();
});
//全选
$('i.checkbox.all').on('click', function() {
	$(this).toggleClass('checked');
	var sort = $(this).hasClass('ok') ? 'ok' : 'edit';
	$(this).hasClass('checked') 
		? $(`.content i.checkbox.${ sort }`).addClass('checked')
		: $(`.content i.checkbox.${ sort }`).removeClass('checked');
	updataFooter();
});
//删除事件
$('.btn-remove').on('click', function() {
	var ids = [];
	var $lis = $('ul.list>li:has(i.checkbox.edit.checked)');
	$lis.each(function(i, item) {
		ids.push(parseInt(item.dataset.id));
	});
	$.ajax({
		url: '/cart/remove',
		type:'post',
		data: { ids: JSON.stringify(ids) },
		headers: { Authorization: sessionStorage.getItem('token') },
		success: function(result){
			if(result.status === 200 ) {
				$lis.remove(); 
				if($('ul.list>li').length === 0) {		// 如果清空了购物车
					$('.footer,span.s-edit,ul.list').hide();
					$('.empty-cart').show();
				} else {								// 如果没有清空购物车
					updateFooter();
					if($(`.content i.checkbox.ok:not(".checked")`).length === 0) 
						$('i.checkbox.all.ok').addClass('checked');
				}
			}else {
				alert(result.message);
			}
		}
	})
})
//结算
$('.btn-settlement').on('click', function() {
	var ids = [];
	$('ul.list>li:has(i.checkbox.ok.checked)').each(function(i, item) {
		ids.push(parseInt(item.dataset.id));
	});
	sessionStorage.setItem('buy', JSON.stringify(ids));
	window.location.href = '/orderconfirm/index.html';
});
