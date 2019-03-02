r(function(){
    $('#register').click(function(e){
        e.preventDefault();
        $.post('/login', $('#registerForm').serialize(), function(data){
            $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
            $("#successDisplay").show();
        }).fail(function(msg){
            showError(msg);
        });
    });
});

var tokenHeader = document.cookie;
var cookies = tokenHeader.split(';');
cookies.forEach(function(elem, index){
	var token = elem.split('=');
	if(token[0].trim() === "token"){
		if(token[1].trim() !== undefined && token[1].trim() !== "null") window.location.pathname = "/index.html";
	}
});