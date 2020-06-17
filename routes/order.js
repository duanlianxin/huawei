var express = require('express');
var query = require('../util/dbHelper.js');
var Token = require('../util/token.js');
var httpResult = require('../config').httpResult;

var router = express.Router();
// 订单确认
router.post('/confirm', function(req, res, next) {
	var name = req.token.name;
	var { ids, account, addressId } = JSON.parse(req.body.jsonStr);
	var sql = 'CALL p_orderConfirm(?,?,?,?,?);';
	res.flag = query(sql, [ ids.join(','), account, new Date(), name, addressId ])
		.then(results => httpResult.success(results[0][0].orderId));
	next();
});
// 获取订单总金额
router.get('/account/:orderId', function(req, res, next) {
	// var name = req.token.name;
	var orderId = req.params.orderId;
	var sql = 'select `account` from `dt_order` where `orderId` = ?;';
	res.flag = query(sql, [ orderId ]).then(results => httpResult.success(results[0].account));
	next();
});
// 付款
router.get('/pay/:orderId', function(req, res, next) {
	// var name = req.token.name;
	var orderId = req.params.orderId;
	var sql = 'update `dt_order` set `isPay` = 1 where `orderId` = ?;';
	res.flag = query(sql, [ orderId ]).then(() => httpResult.success());
	next();
});
// 获取当前用户所有订单信息
router.get('/list/all', function(req, res, next) {
	var name = req.token.name;
	var sql = 'select * from `order_product_address` where `uName` = ?;';
	res.flag = query(sql, [ name ]).then(results => httpResult.success(aaa(results)));
	next();
});
// 获取当前用户所有已付款订单信息
router.get('/list/pay', function(req, res, next) {
	var name = req.token.name;
	var sql = 'select * from `order_product_address` where `uName` = ? and `isPay` = 1;';
	res.flag = query(sql, [ name ]).then(results => httpResult.success(aaa(results)));
	next();
});
// 获取当前用户所有待付款订单信息
router.get('/list/unpay', function(req, res, next) {
	var name = req.token.name;
	var sql = 'select * from `order_product_address` where `uName` = ? and `isPay` = 0;';
	res.flag = query(sql, [ name ]).then(results => httpResult.success(aaa(results)));
	next();
});

function aaa(data) {
	var result = [];
	data.forEach(function(item) {
		var i = result.findIndex(function(item2) { return item2.orderId === item.orderId });
		if(i === -1) {
			result.push({
				orderId: item.orderId,
				uName: item.uName,
				account: item.account,
				orderTime: item.orderTime,
				isPay: item.isPay,
				addressId: item.addressId,
				receiveName: item.receiveName,
				receivePhone: item.receivePhone,
				receiveRegion: item.receiveRegion,
				receiveDetail: item.receiveDetail,
				details: []
			});
		} 
		result[i === -1 ? result.length - 1 : i].details.push({
			id: item.id,
			count: item.count,
			name: item.name,
			remark: item.remark,
			avatar: item.avatar,
			price: item.price
		});
	});
	return result;
}

module.exports = router;