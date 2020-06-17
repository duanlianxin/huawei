var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var httpResult = require('./config').httpResult;
var Token = require('./util/token.js');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var categoryRouter = require('./routes/category');
var productRouter = require('./routes/product');
var userRouter = require('./routes/user');
var cartRouter = require('./routes/cart');
var addressRouter = require('./routes/address');
var orderRouter = require('./routes/order');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/category', categoryRouter);
app.use('/product', productRouter);
app.use('/user', userRouter);
app.use('/cart', cartRouter);
app.use('/address', Token.verify, addressRouter);
app.use('/order', Token.verify, orderRouter);

// 收尾的中间件， 把前面处理的结果统一res.send回客户端
app.use(function(req, res, next) {
	if(res.flag) {
		res.flag
			.then(result => res.send(result))
			.catch(message => res.send(httpResult.error(null, message)));
	}
	else next(); // 继续放行，让后面的404进行处理
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
