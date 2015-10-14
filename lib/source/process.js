exports.getSource = function(req,params, fn){
       
    req.getConnection(function(err,connection){
        
        var if_search = '';
        if(params.qsearch !='' && params.filter_by !='')
            if_search +=" AND "+params.filter_by+" LIKE '%"+params.qsearch+"%' ";
        if(params.qsearch !='' && params.filter_by=='')
            if_search +=" AND libelle LIKE '%"+params.qsearch+"%' ";
       
        var query = connection.query('SELECT * FROM source WHERE 1=1 '+if_search+' LIMIT ?,?',[params.offset,params.limit],function(err,rows)
        {
            
            if(err)
                return fn(false,err);
     
            countAllSource(req,params,function(total){
                
                //console.log("Total data : %d",total);
                return fn(true,rows,total);
            });
                
           
         });
         
         console.log(query.sql);
    });
   
};


function countAllSource(req,params,fn){

    req.getConnection(function(err,connection){
        
        var if_search = '';
        if(params.qsearch !='' && params.filter_by !='')
            if_search +=" AND "+params.filter_by+" LIKE '%"+params.qsearch+"%' ";
        if(params.qsearch !='' && params.filter_by=='')
            if_search +=" AND libelle LIKE '%"+params.qsearch+"%' ";
        
        var query = connection.query('SELECT COUNT(id) as all_source FROM source WHERE 1=1 '+if_search+' ',function(err,rows)
        {
        
            if(err)
                return fn(err);
            
            return fn(rows[0].all_source);
        });
    
    });
}

/*------------------------------------------
Adding sources
Need to include hash
-------------------------------------------*/
exports.save = function(req,fn){
    
     var temp = JSON.parse(JSON.stringify(req.body));

    
    req.getConnection(function (err, connection) {

            if(temp.source_id==''){
        
        var data = {
            
            libelle:temp.libelle,
            adresse:temp.adresse,
            puissance:temp.puissance
        
        };
        
        var query = connection.query("INSERT INTO source set ? ",data, function(err, rows)
        {
  
          if (err)
               return fn(false,err); 
         
          //res.redirect('/source');
            return fn(true," Nouvelle source crée");
                  
          
        });
        }else{
                
                var update;
                if(temp.libelle !='' | temp.adresse !='' | temp.puissance !='' ){ //if data is filled
                    
                     update = {
                                libelle:temp.libelle,
                                adresse:temp.adresse,
                                puissance:temp.puissance
                             };
                    
                }else{
                    
                    update = {
                                libelle:temp.libelle,
                                adresse:temp.adresse,
                                puissance:temp.puissance
                             };
                }
                connection.query("UPDATE source set ? WHERE id = ? ",[update,temp.source_id], function(err, rows)
                {
          
                  if (err)
                    return fn(false,err); 
                
                  return fn(true," Source modifié");
                  
                });
              
            }
        
       // console.log(query.sql); get raw query
    
    });
};


exports.delete_source = function(req,fn){
     
     var temp = JSON.parse(JSON.stringify(req.body));
     
     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM source  WHERE id = ? ",[temp.source_id], function(err, rows)
        {
            
             if(err)
                 return fn(false,err); 
            
             return fn(true," Source supprimé");
             
        });
        
     });
};

