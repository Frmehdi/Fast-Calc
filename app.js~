var express = require('express');
var app = module.exports = express();
var http = require('http');
var mysql = require('mysql');

var connection  = require('express-myconnection');

/*----------------------------------
    Setup main environments
------------------------------------*/
app.set('port',process.env.PORT || 3720);
app.use(express.logger('dev'));
app.set('views',__dirname);
app.use(express.static(__dirname + '/public')); // set this for static load assests

app.set('view engine','ejs');
/*------------------------------------------
    connection peer, register as middleware
    type koneksi : single,pool and request 
-------------------------------------------*/

app.use(
    
    connection(mysql,{
        
        host: 'localhost',
        user: 'root',
        password : '',
        port : 3306, //port mysql
        database:'nodejs'

    },'request')

);

/*-----------------------------------
    Set routes and middleware
-----------------------------------*/

//this is how to get the current url, it would be useful in future
app.use(setCurrentUrl);

function setCurrentUrl(req, res, next) {
    app.set('CURR_URL', req.protocol + '://' + req.get('host') + req.originalUrl);
    next();
}

//need to be Above app.router
app.use(express.cookieParser('codetrash.com, very secret ssssstttt'));
app.use(express.session());

/*----------------------------------------------------------
Every lib/module folder created, need to be registered here
------------------------------------------------------------*/
var login = require('./lib/login');
var users = require('./lib/users');
var dashboard = require('./lib/dashboard');


app.use(express.json());
app.use(express.urlencoded());
app.use(login);
app.use(users);
app.use(dashboard);



/*---------------------------------------------
Let's handle some Errors
----------------------------------------------*/
app.use(function(req,res,fn){

    res.render('error_page',{status:404,url:req.url,error:'Oooops ! Page not Found'});
});

app.use(function(err, req, res, next){

  res.render('error_page', {
      status: err.status || 500
    , error: err
  });
});


app.use(app.router);

/*Create server*/
http.createServer(app).listen(app.get('port'),function(){

    console.log('Listening port : %s ', app.get('port'));
});
