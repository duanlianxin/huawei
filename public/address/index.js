var id = 0; 			// 记录当前正处于编辑状态的地址的id
var isAdd = true;		// 记录当前是新增还是修改
var validForm = $('.aaa').Validform({
	tiptype:3
});
//动态拼接ul
function generateLi(item) {
	$(`
		<li data-id='${ item.id }'>
			<div class='address-list-item'>
				<div class='address-list-item-header'>
					<h3 class='receive-name'>${ item.receiveName }</h3>
					<span class='receive-phone'>${ item.receivePhone }</span>
				</div>
				<p class='receive-address'>${ item.receiveRegion } ${ item.receiveDetail }</p>
				<button class='btn-default ${ item.isDefault ? "default" : "" }'>
					${ item.isDefault ? '默认地址' : '设为默认地址' }
				</button>
			</div>
			<button class='btn-update'>修改</button>
		</li>
	`).appendTo('.address-list>ul');
}
//进入edit的分类、是新增还是修改
function beginEdit(item) {
	$('.page-wrapper').toggle();
	if(item) {
		isAdd = false;        //修改
		$('.btn-remove').show();
		$('.name').val(item.receiveName);
		$('.phone').val(item.receivePhone);
		$('.region').val(item.receiveRegion);
		$('.detail').val(item.receiveDetail);
	}else {
		isAdd = true;  			//新增
		$('form').get(0).reset();
	}
}

//新增
$('button.btn-add').on('click', function() { beginEdit(); });
//动态绑定点击事件
$('.address-list>ul').on('click', function(e) {
	if($(e.target).hasClass('btn-default')) {					// 设置默认地址
		id = parseInt($(e.target).closest('li').get(0).dataset.id);
		if($(e.target).hasClass('default')) return;				// 假如当前已经是默认地址了，什么也不做
		$.ajax({
			url: `/address/default/${ id }`,
			type: 'get',
			headers: { Authorization: sessionStorage.getItem('token')},
			success: function(result) {
				if(result.status === 200) {
					alert('默认地址设置成功了');
					$('button.btn-default').text('设为默认地址').removeClass('default');
					$(e.target).text('默认地址').addClass('default');
				}else {
					alert(result.message);
				}
			}
		});
	}
	if($(e.target).hasClass('btn-update')) {
		var $li = $(e.target).closest('li');
		id = parseInt($li.get(0).dataset.id);
		beginEdit({
			receiveName: $li.find('.receive-name').text(),
			receivePhone: $li.find('.receive-phone').text(),
			receiveRegion: $li.find('.receive-address').text().split(' ')[0],
			receiveDetail: $li.find('.receive-address').text().split(' ')[1]
		});
		return;
	}
});
if(document.referrer.indexOf('orderconfirm') !== -1){
	$('.address-list>ul').on('click', 'li',function() {
		var id = $(this).attr('data-id');
		window.location.replace('/orderconfirm/index.html?addressId=' + id);
	});
}
//点击确认事件
$('.btn-save').on('click',function() {
	var add = {
		id: isAdd ? 0 : id,
		receiveName: $('.name').val(),
		receivePhone: $('.phone').val(),
		receiveRegion: $('.region').val(),
		receiveDetail: $('.detail').val(),
	};
	if(validForm.check()){
		if(isAdd){ 			//新增
			$.ajax({
				url: '/address/add',
				type: 'post',
				data: { jsonStr: JSON.stringify(add) },
				headers: { Authorization: sessionStorage.getItem('token')},
				success: function(result){
					if(result.status === 200){
						generateLi(add);
						alert('新增成功。。。');
						$('.edit').hide();
						$('.list').show();
					} else {
						alert(result.message);
					}
				}
			});
		} else {			//修改
			$.ajax({
				url: '/address/update',
				type: 'post',
				data: { jsonStr: JSON.stringify(add) },
				headers: { Authorization: sessionStorage.getItem('token') },
				success: function(result) {
					if(result.status === 200) {
						var $li = $(`.address-list li[data-id=${ add.id }]`);
						$li.find('.receive-name').text(add.receiveName);
						$li.find('.receive-phone').text(add.receivePhone);
						$li.find('.receive-address').text(`${ add.receiveRegion } ${ add.receiveDetail }`);
						alert('修改地址成功..');
						$('.edit').hide();
						$('.list').show();
						$('button.btn-remove').hide();		
					} else {
						alert(result.message);
					}
					
				}
			});
		}
	}
	
});
//取消按钮
$('.btn-cancel').on('click', function() {
	$('.page-wrapper').toggle();
	$('button.btn-remove').hide();		
	if($('.address-list li').length === 0) {
		$('.address-list').hide(); 
		$('.address-empty').show();
	} else {
		$('.address-list').show(); 
		$('.address-empty').hide();
	}
	
});
$('.btn-remove').on('click',function() {
	if(confirm('真的要删除吗？')) 
	$.ajax({
		url: `/address/remove/${ id }`,
		type: 'get',
		headers: { Authorization: sessionStorage.getItem('token') },
		success: function(result) {
			if(result.status === 200) {
				alert('删除成功');
				$(`li[data-id=${ id }]`).remove();
				$('.edit').hide();
				$('.list').show();
				$('button.btn-remove').hide();		
			}else {
				alert(result.message)
			}
		}
	});
});

// 发送ajax请求数据动态拼接
if(sessionStorage.getItem('user')) {
	$.ajax({
		url: '/address/list',
		type: 'post',
		headers: {
			'Authorization': sessionStorage.getItem('token')
		},
		success: function(result) {
			if(result.status === 200) { 
				if(result.data.length === 0) {
					$('address-empty').show();
				} else {
					result.data.forEach(function(item){
						generateLi(item);
					});
				}
			} else {
				alert(result.message);
			}
		}
	});
}else {
	var url = window.location.href;
	sessionStorage.setItem('target',url);
	window.location.href = ('/login/index.html');
}
$('.region').CityPicker(); //省市区联动
