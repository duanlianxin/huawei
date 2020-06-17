// 切换一级分类
function bindEvent(){
	$('ul.category-main>li').on('click', function() {
		//判断当前被点击的是不是已经激活了
		if($(this).hasClass('active')) return;
		//一级分类的active切换
		$(this).addClass('active').siblings().removeClass('active');
		//将right中上一个分类的数据清空
		$('.right').empty();
		//让右边显示图片
		$('<img class="avatar" src="" />').attr('src',$(this).attr('data-avatar')).appendTo('.right');
		$.ajax({
			url: '/category/list/' + $(this).attr('data-id'),
			type: 'get',
			success: function(result) {
				if(result.status === 200) {
					result.data.forEach(function(item) {
						var $categorySubWrapper = $(`
							<div class='category-sub-wrapper'>
								<img class='sub-img' src='${item.avatar}' />
								<h3>${item.name}</h3>
							</div>
						`);
						$categorySubWrapper.appendTo('.right');
						var $categorySub = $('<ul class="category-sub clearfix"></ul>');
						//发送ajax请求获取三级分类
						$.ajax({
							url: '/category/list/' + item.id,
							type: 'get',
							success: function(result) {
								if(result.status === 200) {
									result.data.forEach(function(item) {
										$(`
											<li>
												<a href='/detail/index.html?id=${item.id}'>
													<img src='${item.avatar}' />
													<span>${item.name}<span>
												</a>
											</li>
										`).appendTo($categorySub);
									});
								}else {
									alert(result.message);
								}
							}
						});
						$categorySub.appendTo($categorySubWrapper);
					});
				}else {
					alert(result.message);
				}
			}
		});
	});
}

//发送ajax请求,请求一级分类
$.ajax({
	url: '/category/list/0',
	type: 'get',
	success: function(result){
		if(result.status === 200) {
			result.data.forEach(function(item) {
				$(`
					<li data-avatar = '${item.avatar}' data-id = '${item.id}'>
						<a>${item.name}</a>
					</li>
				`).appendTo('ul.category-main');
			});
			bindEvent();
			//事件模拟一级分类的第一项被点击事件
			$('ul.category-main>li').eq(0).trigger('click');
		}else {
			alert(result.message);
		}
	}
});
