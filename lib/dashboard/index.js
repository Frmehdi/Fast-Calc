var express = require('express');
var app = module.exports = express();
var process = require('./process');
var fs = require('fs');

app.set('views',__dirname);
app.set('view engine','ejs');

app.get('/dashboard',function(req,res){

    if(!req.session.username)
	    res.redirect('/login');
    res.render('dashboard.ejs',{
        
        sess_user : (req.session.username) ? req.session.username : ''
    
    });

var writeStream = fs.createWriteStream("../file.xls");
var header="Sl No"+"\t"+" Age"+"\t"+"Name"+"\n";
var row1 = "0"+"\t"+" 21"+"\t"+"Rob"+"\n";
var row2 = "1"+"\t"+" 22"+"\t"+"bob"+"\n";


writeStream.write(header);
writeStream.write(row1);
writeStream.write(row2);



});
