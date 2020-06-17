//动态判断当前页面，决定那个激活
//怎么获得父亲的页面路径（window.parent.location.href）
var url = window.parent.location.href;
if(url.indexOf('home') !== -1) //如果是分类页面
	$('ul.nav>li').eq(0).addClass('active');
 else if(url.indexOf('category') !== -1)  //如果是购物车页面
	$('ul.nav>li').eq(1).addClass('active');
 else if(url.indexOf('cart') !== -1)  //如果是主页页面
	$('ul.nav>li').eq(2).addClass('active');
 else 						//如果是订单页面
	$('ul.nav>li').eq(3).addClass('active');
