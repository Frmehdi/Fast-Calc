/*------------------------------------------------------
You might seeing this module First,

In every module you create, express and any other
dipendencies, you can register below 
( it depends on you requirements for each module)

For example in this Login I need a hash for Password encript
then i load the hass
---------------------------------------------------------*/


var express = require('express');
var app = module.exports = express();
var process = require('./process');


app.set('views',__dirname);
app.set('view engine','ejs');

var hash = require('../../pass').hash;

app.get('/',function(req,res){
    
    if(req.session.username)
        res.redirect('/dashboard');
        
    res.render('login.ejs',{error_login:''});
   
});

app.get('/login',function(req,res){
    
    if(req.session.username)
        res.redirect('/dashboard');
        
    res.render('login.ejs',{error_login:(req.session.login_error) ? req.session.login_error : ''});
   
});



app.post('/login',function(req,res){
   
   process.check(req,hash,function(status,msg){
        
        console.log("Status : %s , message : %s ",status ,msg);
        if(status){
            
            if(req.session.login_error)
                delete req.session.login_error;
            res.redirect('/users');
        }
        else{
            
            res.redirect('/login');
            req.session.login_error = 'Invalid username and password'; // i use redirect, store it in session
        }
   });
   
});

/*Logout proses*/

app.get('/logout', function(req,res){
    
    req.session.destroy(function(){
    
        res.redirect('/login');
    });
});

/*---------------------------------------------------------
Seeding the DB user, comment it after you're done seeding
----------------------------------------------------------*/

app.get('/seeding',function(req,res){
    
    
    process.seeding(req,hash,function(status,msg){
    
        if(status){
            
            console.log("Status %s : %s",status,msg);
            res.redirect('/login');
        }
    });
    
});
