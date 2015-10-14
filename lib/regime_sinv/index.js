

var express = require('express');
var app = module.exports = express();
var process = require('./process');




app.set('views',__dirname);
app.set('view engine','ejs');

var LIMIT = 1000;




/*-------------------------------------------------
Just a simple Pagination here, You can wrote your 
own advanced Pagination
---------------------------------------------------*/

function paging(total,curr_page,url){
    
    var page = '';
    var total_page = Math.ceil(total/LIMIT);
       
    if(total > LIMIT) {
    
       page = '<ul class="pagination">';
        
       if(parseInt(curr_page) >1)
             page +='<li><a href="'+url+(parseInt(curr_page)-1)+'">Prev</a></li>';
       
       for(x = 1;x <= total_page;x++){
            
            var active = '';
            
            if(x == curr_page)
                active = 'class="active"';
              
            page +='<li '+active+'><a href="'+url+x+'">'+x+'</a></li>';
            
        }
        if(parseInt(curr_page) < total_page)
             page +='<li><a href="'+url+(parseInt(curr_page)+1)+'">Next</a></li>';
        
        page +='</ul>';
        
        var x_showed = LIMIT;
        if(total <  LIMIT)
            x_showed = total
       
        page += '<div class="pull-right" style="margin-top:2px">'
                        +'<h5>'
                        +' <small>Displaying '+x_showed+' of Total '+total+' Item(s)</small>' 
                        +'</h5>'
                     +'</div>';
        }
        
    return page;
}
                
app.get('/regime_sinv',function(req,res){
    
	if(!req.session.username)
	    res.redirect('/login');
	
    var curr_page = (req.query.page != undefined) ? req.query.page : 1;
    var filter_by = (req.query.f != undefined) ? req.query.f : "";
    var qsearch = (req.query.q != undefined) ? req.query.q : "";
    var page  = (req.query.page != undefined) ? req.query.page : 0;
    var offset= (page==0) ? 0 : (page - 1) * LIMIT;
      
    /*Params for DB*/
    var xparams = {
    
         curr_page: curr_page,
         filter_by: filter_by,
         qsearch  : qsearch,
         offset   : offset,
         limit    : LIMIT
    }
    
    process.getCalcule(req,xparams,function(status,data,data1,total_data){
       
       var url = '/regime_sinv?sort_by='+filter_by+'&q='+qsearch+'&page=';
           
       var params = {
        
            title : 'regime_s list',
            data  : data,
            data1: data1,
            
            total_data : total_data,
            pagination : paging(total_data,curr_page,url),
            curr_page  : curr_page,
            curr_filt  : filter_by,
            curr_search: qsearch,
            sess_user  :(req.session.username) ? req.session.username : ''
       };
       //console.log(params);
       res.render('regime_sinv.ejs',params);
    });


// SOURCE********************************






    
});