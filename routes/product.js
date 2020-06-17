var express = require('express');
var query = require('../util/dbHelper.js');
var httpResult = require('../config').httpResult;
var router = express.Router();

router.post('/list', function(req, res, next) {
	// ES6解构赋值
	var { cid, name, orderCol, orderDir, begin, pageSize } = JSON.parse(req.body.jsonStr);
	var sql = "select * from `dt_product` where `cid` = ? and `name` like '%" + name +
			  "%' order by `" + orderCol + "` " + (orderDir ? "asc" : "desc") + " limit ?,?;";
	res.flag = query(sql, [ cid, begin, pageSize ]).then(results => httpResult.success(results));
	next(); // 放行
});

router.get('/model/:id', function(req, res, next) {
	var id = parseInt(req.params.id);
	var sql = 'select * from `dt_product` where `id` = ?;';
	res.flag = query(sql, [ id ])
		.then(results => httpResult.success(results[0]));
	next();
});

module.exports = router;