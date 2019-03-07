function login(){
    $.post('/login', "user_id=14338&roles=Instructor", function(data){
        window.location.replace("/dashboard.html");
    }).fail(function(msg){
        showError(msg);
    });
}