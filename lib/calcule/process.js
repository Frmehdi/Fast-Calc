exports.getCalcule = function(req,params, fn){
       
    req.getConnection(function(err,connection){
        
        var if_search = '';
        if(params.qsearch !='' && params.filter_by !='')
            if_search +=" AND "+params.filter_by+" LIKE '%"+params.qsearch+"%' ";
        if(params.qsearch !='' && params.filter_by=='')
            if_search +=" AND libelle LIKE '%"+params.qsearch+"%' ";
       
        var query = connection.query(' SELECT * FROM calcule  WHERE 1=1 '+if_search+' LIMIT ?,?',[params.offset,params.limit],function(err,rows)  
        {

           var query = connection.query(' SELECT * FROM source  WHERE 1=1 ',function(err,rows1)  
        {
            var query = connection.query(' SELECT * FROM calcule  WHERE longueur=0 ',function(err,rows2)  
        {
            
            if(err)
                return fn(false,err);
            countAllCalcule(req,params,function(total){
                
                //console.log("Total data : %d",total);
                return fn(true,rows,rows1,rows2,total);
            });
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
            if_search +=" AND libelle LIKE '%"+params.qsearch+"%' ";
        
        var query = connection.query('SELECT COUNT(id_calcule) as all_calcule FROM calcule WHERE 1=1 '+if_search+' ',function(err,rows)
        {
        
            if(err)
                return fn(err);
            
            return fn(rows[0].all_calcule);
        });
    
    });
}

/*------------------------------------------
Adding sources
Need to include hash
-------------------------------------------*/
exports.update = function(req,fn){
    
     var temp = JSON.parse(JSON.stringify(req.body));

    
    req.getConnection(function (err, connection) {

var query = connection.query("CALL modifier_calcule('"+temp.calcule_id+"','"+temp.longueur+"')", function(err, rows){
          
            


                  if (err)
                    return fn(false,err); 
         
                  return fn(true," Calcule modifié");
              



});




       
            
        
      
    
    });
};

exports.save = function(req,fn){
    
     var temp = JSON.parse(JSON.stringify(req.body));

    
    req.getConnection(function (err, connection) {
//console.log(temp.calcule_id);
if(temp.calcule_id==""){
      
         var query = connection.query("CALL insert_calc('"+temp.id_source+"','"+temp.nom_boucle+"','"+temp.section_cable+"','"+temp.niveau_tension+"','"+temp.coefficient+"','"+temp.puissance_point+"','"+temp.nb+"')", function(err, rows)
        {
  
          if (err)
               return fn(false,err); 
         
          //res.redirect('/source');
            return fn(true," Nouvelle calcule crée");

                  
          
        });
       }

            
        
      
    
    });
};

 
exports.delete_calcule = function(req,fn){
     
     var temp = JSON.parse(JSON.stringify(req.body));
     
     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM calcule  WHERE id = ? ",[temp.calcule_id], function(err, rows)
        {
            
             if(err)
                 return fn(false,err); 
            
             return fn(true," Calcule supprimé");
             
        });
        
     });
};

