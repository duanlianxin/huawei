// 这个文件将使用jQuery来开发,所以使用此文件前引入jQuery
var Notice = {};
Notice.message = (str, time = 2000) => {
	// 动态创建p并显示指定的提示信息
	var $p = $(`<p>${ str }</p>`)
		.css({
			position: 'fixed',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
			backgroundColor: '#000',
			color: '#fff',
			padding: '0 15px',
			borderRadius: '4px',
			height: '30px',
			lineHeight: '30px'
		})
		.appendTo('body');
	// 指定的时间后让p动画消失并从dom文档中移除
	setTimeout(() => $p.fadeOut('fast',() => $p.remove()), time);
};

Notice.loading = {
	show: () => {
		$('<div class="mi-loading"></div>')
			.css({
				position: 'fixed',
				left: 0,
				top: 0,
				width: '100%',
				height: '100%',
				backgroundColor: 'rgba(255,255,255,0.9)',
				backgroundImage: 'url(/static/images/loading.gif)',
				backgroundPosition: 'center center',
				backgroundRepeat: 'no-repeat'
			})
			.appendTo('body');
	},
	hide: () => $('.mi-loading').remove()
};

Notice.confirm = str => new Promise(resolve => {
	$(`
		<div class="notice-confirm">
			<div class="notice-confirm-content">
				<h3 class="notice-confirm-header">提示</h3>
				<p class="notice-confirm-body">${ str }</p>
				<div class="notice-confirm-footter">
					<button class='btn-confirm-ok'>确定</button>
					<button class='btn-confirm-cancel'>取消</button>
				</div>
			</div>
		</div>
	`).appendTo('body');
	$('.notice-confirm').css({
		position: 'fixed',
		left: 0,
		top: 0,
		width: '100%',
		height: '100%',
		backgroundColor: 'rgba(0,0,0,0.5)'
	});
	$('.notice-confirm-content').css({
		position: 'absolute',
		left: '50%',
		top: '50%',
		transform: 'translate(-50%, -50%)',
		backgroundColor: '#fff',
		maxWidth: '80%',
		minWidth: '60%',
		borderRadius: '5px'
	});
	// 内容 - 头
	$('h3.notice-confirm-header').css({
		textAlign: 'center',
		padding: '10px 0',
		color: 'rgb(132, 95, 63)'
	});
	// 内容 - 身体
	$('p.notice-confirm-body').css({
		margin: '20px 10px',
		textIndent: '2em'
	});
	// 内容 - 脚
	$('.notice-confirm-footter').css({
		display: 'flex',
		borderTop: '1px solid rgb(132, 95, 63)'
	});
	$('button.btn-confirm-ok,button.btn-confirm-cancel').css({
		width: '50%',
		textAlign: 'center',
		height: '50px',
		lineHeight: '50px',
		color: 'rgb(132, 95, 63)',
		boxSizing: 'border-box'
	});
	$('button.btn-confirm-ok')
		.css({ borderRight: '1px solid rgb(132, 95, 63)' })
		.on('click', function() {
			$('.notice-confirm').remove();
			resolve();
		});
	$('button.btn-confirm-cancel').on('click', function() {
		$('.notice-confirm').remove();
	});
});



