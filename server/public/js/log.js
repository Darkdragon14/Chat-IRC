var socket = io();



//query for login
$('#login').submit(function(){
	if($('#username').val() != 0){
		socket.emit('login', $('#username').val()+";"+$('#psw').val());
		socket.on('check', function(msg){
			if(msg == 'true'){
				sessionStorage.setItem('check', 'ok');
				sessionStorage.setItem('username', $('#username').val());
				RedirectionJavascript();
	    	}
	    	else{
	    		$('#error1').show();
	    	}
		});	
	}
	return false;
});

//query for submit
$('#Register').submit(function(){
	if($('#usernameR').val() != 0 &&  $('#pswR').val() != 0){
		socket.emit('Register', $('#usernameR').val()+";"+$('#pswR').val());
		socket.on('check', function(msg){
			if(msg == 'true'){
				sessionStorage.setItem('check', 'ok');
				sessionStorage.setItem('username', $('#usernameR').val());
				RedirectionJavascript();
			}
			else{
				$('#error2').show();
			}
		});
	}
	return false;
});

$('.message a').click(function(){
	$('#error1').hide();
	$('#error2').hide();
	$('form').animate({height: "toggle", opacity: "toggle"}, "slow");
});

$('.doc a').click(function(){
	RedirectionJavascript2();
});
