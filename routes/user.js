var express = require('express');
var query = require('../util/dbHelper.js');
var Token = require('../util/token.js');
var httpResult = require('../config').httpResult;

var router = express.Router();


router.post('/login/pwd', function(req, res, next) {
	var { name, pwd } = req.body;
	var sql = 'select * from `dt_user` where `name` = ? and `pwd` = ?;';
	res.flag = query(sql, [ name, pwd ])
		.then(results => {
			if(results.length > 0) return httpResult.success(Token.sign(name));
			else return httpResult.failure(null, '用户名或密码错误');
		});
	next();
});

router.post('/register', function(req, res, next) {
	var { name, pwd, phone } = req.body;
	var sql = 'call p_register(?,?,?);';
	res.flag = query(sql, [ name, pwd, phone ])
		.then(results => {
			if(results[0][0].result === '') return httpResult.success(results[0][0].result);
			else return httpResult.failure(null, results[0][0].result);
		});
	next();
});

module.exports = router;