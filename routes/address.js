var express = require('express');
var query = require('../util/dbHelper.js');
var httpResult = require('../config').httpResult;

var router = express.Router();

router.post('/list', function(req, res, next) {
	var name = req.token.name;
	var sql = 'select * from `dt_address` where `name` = ?;';
	res.flag = query(sql, [ name ]).then(results => httpResult.success(results));
	next();
});

router.get('/default/:id', function(req, res, next) {
	var name = req.token.name;
	var id = parseInt(req.params.id);
	var sql = 'call p_setDefaultAddress(?, ?);';
	res.flag = query(sql, [ id, name ]).then(() => httpResult.success());
	next();
});

router.get('/remove/:id', function(req, res, next) {
	var id = parseInt(req.params.id);
	var sql = 'delete from `dt_address` where `id` = ?;';
	res.flag = query(sql, [ id ]).then(() => httpResult.success());
	next();
});

router.post('/add', function(req, res, next) {
	var name = req.token.name;
	var { receiveName, receivePhone, receiveRegion, receiveDetail } = JSON.parse(req.body.jsonStr);
	var sql = 'insert `dt_address`(`name`,`receiveName`,`receivePhone`,`receiveRegion`,`receiveDetail`) values(?,?,?,?,?);';
	res.flag = query(sql, [ name, receiveName, receivePhone, receiveRegion, receiveDetail ])
		.then(results => httpResult.success(results.insertId));
	next();
});

router.post('/update', function(req, res, next) {
	var { id, receiveName, receivePhone, receiveRegion, receiveDetail } = JSON.parse(req.body.jsonStr);
	var sql = 'update `dt_address` set `receiveName`=?,`receivePhone`=?,`receiveRegion`=?,`receiveDetail`=? where `id`=?;';
	res.flag = query(sql, [ receiveName, receivePhone, receiveRegion, receiveDetail, id ])
		.then(results => httpResult.success());
	next();
});

// 获取默认地址
router.get('/getdefault', function(req, res, next) {
	var name = req.token.name;
	var sql ='select * from `dt_address` where `name` = ? and `isDefault` = 1;';
	res.flag = query(sql, [ name ]).then(results => httpResult.success(results[0]));
	next();
});
// 获取指定的id的地址
router.get('/getmodel/:id', function(req, res, next) {
	var id = parseInt(req.params.id);
	var sql ='select * from `dt_address` where `id` = ?;';
	res.flag = query(sql, [ id ]).then(results => httpResult.success(results[0]));
	next();
});

module.exports = router;