/*JUST EN EXAMPLE OF JS, you can either remove this file or Modify
======================================================================*/
var BASE_URL;
if (!window.location.origin)
     window.location.origin = window.location.protocol+"//"+window.location.host;
     
BASE_URL = window.location.origin;

function delete_user(id){

    $.ajax({
    
        url:"/users/delete-user",type:"post",dataType:"json",
        data: {user_id:id},
        beforeSend:function(){
        
        },
        success:function(result){
        
            if(result.status){
            
                $('#myModal').modal('hide')
                window.location.reload(true);
            }
        },
        error:function(xhr,status,err){
            
            console.log(err);
        }
    
    });        

}
function delete_source(id){

    $.ajax({
    
        url:"/source/delete-source",type:"post",dataType:"json",
        data: {source_id:id},
        beforeSend:function(){
        
        },
        success:function(result){
        
            if(result.status){
            
                $('#myModal').modal('hide')
                window.location.reload(true);
            }
        },
        error:function(xhr,status,err){
            
            console.log(err);
        }
    
    });        

}

/*Document ready*/
 $(document).ready(function () {
  $("#sort-by").change(function(){
    
        var t_val = $(this).val();
        window.location.href = BASE_URL+'/users?f='+t_val+'&q='+CURR_SEARCH+'&page='+CURR_PAGE;
    });
   $("#sort-by1").change(function(){
    
        var t_val = $(this).val();
        window.location.href = BASE_URL+'/source?f='+t_val+'&q='+CURR_SEARCH+'&page='+CURR_PAGE;
    });
    $("#sort-by3").change(function(){
    
        var t_val = $(this).val();
        window.location.href = BASE_URL+'/regime_s?f='+t_val+'&q='+CURR_SEARCH+'&page='+CURR_PAGE;
    });

    $("#go-search").on("click keyup",function(){
              
        var t_val = $("#search-field").val();
        window.location.href =BASE_URL+'/users?f='+CURR_FILT+'&q='+t_val+'&page='+CURR_PAGE;
       
    });
     $("#go-search1").on("click keyup",function(){
              
        var t_val = $("#search-field1").val();
        window.location.href =BASE_URL+'/source?f='+CURR_FILT+'&q='+t_val+'&page='+CURR_PAGE;
       
    });
        $("#go-search3").on("click keyup",function(){
              
        var t_val = $("#search-field3").val();
        window.location.href =BASE_URL+'/regime_s?f='+CURR_FILT+'&q='+t_val+'&page='+CURR_PAGE;
       
    });
   
    $("#search-field" ).on("keydown", function(event) {
       
        if(event.which == 13){ 
             var t_val = $("#search-field").val();
             event.preventDefault(); //it doesnt work without this line
             window.location.href =BASE_URL+'/users?f='+CURR_FILT+'&q='+t_val+'&page='+CURR_PAGE;
        }
    });

      $("#search-field1" ).on("keydown", function(event) {
       
        if(event.which == 13){ 
             var t_val = $("#search-field1").val();
             event.preventDefault(); //it doesnt work without this line
             window.location.href =BASE_URL+'/source?f='+CURR_FILT+'&q='+t_val+'&page='+CURR_PAGE;
        }
    });

    $("#search-field3" ).on("keydown", function(event) {
       
        if(event.which == 13){ 
             var t_val = $("#search-field3").val();
             event.preventDefault(); //it doesnt work without this line
             window.location.href =BASE_URL+'/regime_s?f='+CURR_FILT+'&q='+t_val+'&page='+CURR_PAGE;
        }
    });


   $("#save-source").click(function(){
            
        $.ajax({
        
            url:"/source/save-source",type:"post",dataType:"json",
            data: $("#source-form").serialize(),
            beforeSend:function(){
            
            },
            success:function(result){
            
                if(result.status){
                
                    $('#myModal').modal('hide')
                    window.location.reload(true);
                }
            },
            error:function(xhr,status,err){
                
                console.log(err);
            }
        
        });        
    });


      $("#save-calcule").click(function(){
            
        $.ajax({
        
            url:"/calcule/save-calcule",type:"post",dataType:"json",
            data: $("#calcule-form").serialize(),
            beforeSend:function(){
            
            },
            success:function(result){

                if(result.status){
                
                    $('#myModal').modal('hide')
                    window.location.reload(true);
                     $(this).html(result);
                    //document.location.href="/longueur";

                }
            },
            error:function(xhr,status,err){
                
                console.log(err);
            }
        
        });    


    });

$("#save-calcule1").click(function(){

        $.ajax({

            url:"/calcule/update-calcule",type:"post",dataType:"json",
            data: $("#calcule-form1").serialize(),
        
            beforeSend:function(){
      

            },
            success:function(result){
                 

 
                if(result.status){
                    $('#myModal').modal('hide')
                 window.location.reload(true);
            

                    
                    //document.location.href="/calcule";

                }
            },
            error:function(xhr,status,err){
                
                console.log(err);
            }
         
        });       
       
    });
     

      
   
    //edit user 
  
      $(".edit-source").click(function(){
     
        var data = $(this).attr('data-source').split(',');
    
       // $(".pass-info").text("(Leave blank if password is not changed)");
       
        $("#source_id").val(data[0]);
        $('#libelle').val(data[1]);
         $('#adresse').val(data[2]);
          $('#puissance').val(data[3]);
        $("#modal-source").modal('show');
        $('#modal-source').on('hide.bs.modal', function (e) {
           
        });
        
    });
        $(".edit-calcule").click(function(){
   var data = $(this).attr('data-calcule').split(',');
    $('.t1').hide();
$('.t2').show();
       // $(".pass-info").text("(Leave blank if password is not changed)");
        $("#calcule_id").val(data[0]);
        $('#nomboucle').val(data[1]);
         $('#PT01').val(data[2]);
          $('#PT02').val(data[3]);
        $("#modal-calcule").modal('show');

        $('#modal-calcule').on('hide.bs.modal', function (e) {
              
        });
        
    });
        

   $('#add').click(function(){
    $('.t2').hide();
$('.t1').show();
    

});
    $(".edit-user").click(function(){
     
        var data = $(this).attr('data-user').split(',');
    
        $(".pass-info").text("(Leave blank if password is not changed)");
       
        if(data[2]=='0'){
            
            $("#status-inactive").prop('checked', true);
        }else{
            $("#status-active").prop('checked', true);
        }
        $("#user_id").val(data[0]);
        $('#username').val(data[1]);
        $("#modal-user").modal('show');
        $('#modal-user').on('hide.bs.modal', function (e) {
            
             $(".pass-info").text("");
             $("#user_id,#username").val("");
        });
        
    });
     $("#save-user").click(function(){
            
        $.ajax({
        
            url:"/users/save-user",type:"post",dataType:"json",
            data: $("#user-form").serialize(),
            beforeSend:function(){
            
            },
            success:function(result){
            
                if(result.status){
                
                    $('#myModal').modal('hide')
                    window.location.reload(true);
                }
            },
            error:function(xhr,status,err){
                
                console.log(err);
            }
        
        });        
    });
});
 


    
    
    

    

  


    
 

   //save calcule
   







  //end of document raeady
    
