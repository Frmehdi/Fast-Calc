exports.getCalcule = function(req,params, fn){
       
    req.getConnection(function(err,connection){
        
        var if_search = '';
        if(params.qsearch !='' && params.filter_by !='')
            if_search +=" AND "+params.filter_by+" LIKE '%"+params.qsearch+"%' ";
        if(params.qsearch !='' && params.filter_by=='')
            if_search +=" AND nom_boucle LIKE '%"+params.qsearch+"%' ";
       
        var query = connection.query(' SELECT * FROM inverse  WHERE 1=1 '+if_search+' ',[params.offset,params.limit],function(err,rows)  
        {
            var query = connection.query(' SELECT nom_boucle FROM inverse  group by nom_boucle',function(err,rows1)  
        {
           
            
            if(err)
                return fn(false,err);
     
            countAllCalcule(req,params,function(total){
                
                //console.log("Total data : %d",total);
                return fn(true,rows,rows1,total);
            });
              
            });
              
         });







    });
   
};


function countAllCalcule(req,params,fn){

    req.getConnection(function(err,connection){
        
        var if_search = '';
        if(params.qsearch !='' && params.filter_by !='')
            if_search +=" AND "+params.filter_by+" LIKE '%"+params.qsearch+"%' ";
        if(params.qsearch !='' && params.filter_by=='')
            if_search +=" AND nom_boucle LIKE '%"+params.qsearch+"%' ";
        
        var query = connection.query('SELECT COUNT(id_calcule) as all_calcule FROM calcule WHERE 1=1 '+if_search+' ',function(err,rows)
        {
        
            if(err)
                return fn(err);
            
            return fn(rows[0].all_calcule);
        });
    
    });
}
