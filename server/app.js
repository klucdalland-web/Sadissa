var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var apiRouter = require('./routes');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-api-key'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRouter);
<<<<<<< HEAD
=======

app.use(express.static(path.join(__dirname, '../front')));
>>>>>>> origin/develop

app.use(function(req, res, next) {
    next(createError(404));
});

app.use(function(err, req, res, next) {
<<<<<<< HEAD
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
=======
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

>>>>>>> origin/develop
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;