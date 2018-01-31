 var socket = io();

//log
var check = sessionStorage.getItem('check');
var pseudo = sessionStorage.getItem('username');
socket.emit('pseudo', pseudo);
if(pseudo == "" || pseudo == null || check != 'ok'){
  javascript:history.back();
}
socket.on('false', function(){
  alert("Your pseudo is not avaible ! ");
  javascript:history:back();
});



var inChannel = 0;

var idChannel = 0;

//send message to the server
$('#send').submit(function(){
 if($('#m').val() != 0){
   socket.emit('chat message', $('#m').val());
    $('#m').val('');       
  }
  return false;
});

//create a channel
$('#ch').submit(function(){
  inChannel = 1;
  if($('#add').val() != 0){
    socket.emit('channel', $('#add').val());
    $('#add').val('');
  }
  return false;
});

//receive a msg
socket.on('chat message', function(msg){
  $('#messages').append($('<li>').text(msg));
  scrollToBottom();
});

//receive a msg by user
socket.on(pseudo, function(msg){
  $('#messages').append($('<li>').text(msg));
  scrollToBottom();
});


//add at the list a new channel
socket.on('newChannel', function (channel) {  
  $('#channel').append($('<button id="bchannel" onclick="join(\''+channel+'\')"><li class="'+channel+'" new">').html(channel).append('</button>'));
  setTimeout(function () {
    $('#channel li.new').removeClass('new');
  }, 1000);
  idChannel++;
});

//add user when he will connect
socket.on('user-login', function (user) {  
  $('#users').append($('<button id="bchannel" class="'+user+'" onclick="sendOnePerson(\''+user+'\')"><li class="' + user + ' new">').html(user).append('</button>'));
  setTimeout(function () {
    $('#users li.new').removeClass('new');
  }, 1000);
});


//remove user when he will disconnect
socket.on('user-logout', function (user) {  
  var selector = '#bchannel.' + user;
  $(selector).remove();
});

//join a channel
function join(channel){
  if($('#m').val() != 0){
    socket.emit('chat message', 's;#'+channel+';'+$('#m').val());
    $('#m').val('');       
  }
  else if(inChannel != channel){
    socket.emit('chat message', 'join;'+channel);
    inChannel = channel;
  }
}

//join the root of the chat
function quit(){
  if($('#m').val() != 0){
    socket.emit('chat message', 'root;'+$('#m').val());
    $('#m').val('');       
  }
  else if(inChannel != 0){
    socket.emit('chat message', 'quit');
    inChannel = 0;
  }
}

//send for one person when you click on the name of a person
function sendOnePerson(user){
  if($('#m').val() != 0){
    if(user.indexOf(" ") == -1){
      socket.emit('chat message', 's;'+user+';'+$('#m').val());
      $('#m').val('');
    }
    else {
      socket.emit('chat message', 's;'+user.substring(0, user.indexOf(" "))+';'+$('#m').val());
    }

  }
  return false;
}

//auto scroll
function scrollToBottom() {  
  if ($(window).scrollTop() + $(window).height() + 2 * $('#messages li').last().outerHeight() >= $(document).height()) {
    $("html, body").animate({ scrollTop: $(document).height() }, 0);
  }
}


