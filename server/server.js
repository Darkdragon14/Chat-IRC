var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var favicon = require('serve-favicon');
var mongo = require('mongodb');
var ObjectID = mongo.ObjectID;
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');


//part of MangoDB

//Connection URL
var url = 'mongodb://localhost:27017/irc';


//insert new user in the db
var insertDocuments = function(pseudo, psw, db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  var user  = 'user';
  var pass = 'pass';
  var add = { user : pseudo, pass : psw };
  collection.insert( 
    add, function(err, result) { 
    assert.equal(err, null);    
    callback(result);
  }); 
}

//insert new messages in the db
var insertmsg = function(channel, msg, db, callback) {
  // Get the documents collection
  var collection = db.collection('texte');
  // Insert some documents
  var canal  = 'channel';
  var sms = 'msg';
  var add = { canal : channel, sms : msg };
  collection.insert( 
    add, function(err, result) { 
    assert.equal(err, null);
    callback(result);
  }); 
}

//find an user
var findDocuments = function(socket, pseudo, psw, db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  var user  = 'user';
  var pass = 'pass';
  var add = { user : pseudo, pass : psw };
  // Find some documents
  collection.find(add).toArray(function(err, docs) {
    assert.equal(err, null);
    callback(docs);
    if(docs.length == 0){
      socket.emit('check', 'false');
    }
    else{
      socket.emit('check', 'true');
    }
  });  
}

//check if the user is not in the db
var findExist = function(socket, pseudo, psw, db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  var user  = 'user';
  var pass = 'pass';
  var add = { user : pseudo, pass : psw };
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    var str = JSON.stringify(docs);
    var newArr = JSON.parse(str);
    var test = 0;
    for(var i = 0; i < newArr.length; i++){
      if(newArr[i].user ==  pseudo){
        socket.emit('check', 'false');
        test = 1;
      }
    } 
    if(test != 1){
      insertDocuments(pseudo, psw, db, function(){
        db.close();
      });
      socket.emit('check', 'true');
    }
    callback(docs);
  });  
}

//find messags in the channel or the root of the server in the db
var findmsg = function(socket, idname, channel, db, callback) {
  // Get the documents collection
  var collection = db.collection('texte');
  var canal  = 'channel';
  var add = { canal : channel };
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    callback(docs);
    if(docs.length != 0){
      var str = JSON.stringify(docs);
      var newArr = JSON.parse(str);
      for(var i = 0; i < newArr.length; i++){
        if(newArr[i].canal ==  channel){
          if(idname == newArr[i].sms.substring(0, idname.length)){
            io.emit(idname, "Me "+newArr[i].sms.substring(idname.length));
          }
          else{
            io.emit(idname, newArr[i].sms);
          }
        }
      }
    }
  });  
}




//Part of server chat

//global variabal
//stock sockets 
var tableSocket = [];
//stock names
var tableName = [];
//different channels
var channel = new Array();
//stock socket in the channel
var channelName = new Array();


app.use(express.static(__dirname + '/public'));

app.use(favicon(__dirname + '/public/img/favicon.ico'));

//access to the log page
app.get('/v1', function(req, res){
  res.sendFile(__dirname + '/v1.html');
});

app.get('/v2', function(req, res){
  res.sendFile(__dirname + '/v2.html');
});

//access to the doc of the web site
app.get('/doc', function(req, res){
  res.sendFile(__dirname + '/doc.html');
});	

//access to the chat
app.get('/chat', function(re, res){
  res.sendFile(__dirname + '/index.html')
});

io.on('connection', function(socket){
  var idName;
  tableSocket.push(socket);
  var inChannel = -1;

  socket.on('chat message', function(msg){
    console.log(msg);
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      var sms = idName+" : "+msg;
      if (inChannel == -1 && msg.substring(0,2) != "s;"){
        insertmsg('root', sms, db, function(){
          db.close();
        });
      }
      else if (msg.substring(0, 5) != "join;" && msg.substring(0, 3) == "s;#"){
        insertmsg(channel[inChannel], sms, db, function(){
          db.close();
        });
      }
    });

    //broadcast
    if(msg.substring(0, 2) == "b;"){
    	socket.broadcast.emit('chat message', idName+ " : " +msg.substring(2));
    	io.emit(idName, "Me to all: "+ msg.substring(2));
    }

    //send for a group
    else if (msg.substring(0, 3) == "s;#"){
	    for(var j = 0; j < channel.length; j++){
  			if(channel[j] == msg.substring(3, msg.lastIndexOf(";"))){
  				for (var i = 0; i < channelName[j].length; i++) {
  					if(channelName[j][i] != idName){
  		          		io.emit(channelName[j][i], idName+" for the channel "+channel[j]+" : "+msg.substring(msg.lastIndexOf(";")+1));
  		        	}
  		      	}
  		      	io.emit(idName, "Me for the channel "+channel[j]+" : "+msg.substring(msg.lastIndexOf(";")+1));
  			}
  		}
    }

    //send for one person
    else if (msg.substring(0,2) == "s;"){
    	var nameDest = msg.substring(2, msg.lastIndexOf(";"));
    	for(var i = 0; i < tableName.length; i++){
    		if(nameDest == tableName[i]){
    			io.emit(nameDest, idName+" for you : "+msg.substring(msg.lastIndexOf(";")+1));
    			io.emit(idName, "Me for "+ nameDest + " : " +msg.substring(msg.lastIndexOf(";")+1));
    		}
    	}
    }

    //join a group
    else if (msg.substring(0, 5) == "join;"){
      var exist = 0;
      if(inChannel !=  -1){
        for(var i = 0; i < channelName[inChannel].length; i++){
          if(idName == channelName[inChannel][i]){
            var removed = channelName[inChannel].splice(i, 1); 
          }
        }
      }
      for(var i = 0; i < channel.length; i++){
        if(msg.substring(5) == channel[i]){
          channelName[i].push(idName);
          exist = 1;
          inChannel = i;
          MongoClient.connect(url, function(err, db) {
            assert.equal(null, err);
            findmsg(socket, idName, channel[inChannel], db, function(){
              db.close();
            });
          });
          socket.emit('chat message', "You joined "+channel[i]);
          io.emit('user-logout', idName);
          io.emit('user-login', idName+" ("+channel[i]+")");
        }
      }
    }

    //if a person want to quit a channel
    else if (msg.substring(0, 4) == "quit"){
      if( inChannel != -1){
        for(var i = 0; i < channelName[inChannel].length; i++){
          if(channelName[inChannel][i] == idName){
            var removed = channelName[inChannel].splice(i, 1);
          }
        }
        console.log(idName+" ("+channel[inChannel]+")");
        io.emit('user-logout', idName+" ("+channel[inChannel]+")");
        io.emit('user-login', idName);
        inChannel = -1;
        io.emit(idName, "You are to the racine of the server");
      }
    }

    //send msf for people in the root of the chat
    else if (inChannel == -1 || msg.substring(0,5) == "root;"){
      if(msg.substring(0, 5) == "root;"){
      	msg = msg.substring(5);
      }
      for(var k = 0; k < tableSocket.length; k++){
        var notInRacine =0;
        for(var i = 0; i < channel.length; i++){
          for(var j = 0; j < channelName[i].length; j++){
            if (tableName[k] == channelName[i][j]){
              notInRacine =1;
            }
          }
        }
        if(notInRacine == 0 && tableName[k] != idName){
          io.emit(tableName[k], idName+" : "+msg);
        }
      }	
      io.emit(idName, "You : "+msg);
    }

    //send for people in the channel
    else if(inChannel != -1){
      for(var j = 0; j < channelName[inChannel].length; j++){
        if(channelName[inChannel][j] != idName){
          io.emit(channelName[inChannel][j], idName+" : "+msg);
        }
      }
      io.emit(idName, "Me : "+msg);
    }

    //send msg if the user is in the root of the server
    else {
      for(var k = 0; k < tableSocket.length; k++){
        var notInRacine =0;
        for(var i = 0; i < channel.length; i++){
          for(var j = 0; j < channelName[i].length; j++){
            if (tableName[k] == channelName[i][j]){
              notInRacine =1;
            }
          }
        }
        if(notInRacine == 0 && tableName[k] != idName){
          io.emit(tableName[k], idName+" : "+msg);
        }
      }
      io.emit(idName, "You : "+msg);
    }
  });

  //id
  socket.on('pseudo', function(pseudo) { 
    var testCheck = 0;
    //check if the pseudo is avaible or not
    for(i = 0; i < tableName.length; i++){
    	if(pseudo == tableName[i]){
    		testCheck = 1;
    		socket.emit('check', false);
    	}
    }
    //if check is ok so we add the user
    if(testCheck == 0){
    	idName = pseudo;
	    tableName.push(pseudo);
	    console.log(idName +' connected');
      MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        findmsg(socket, idName, 'root', db, function(){
          db.close();
        });
      });
	    socket.broadcast.emit('chat message', "server : "+idName+" connected");
	    io.emit(idName, "server for you : Hello "+ idName);
	    socket.broadcast.emit('user-login', idName);
	    
	    for (i = 0; i < tableName.length; i++) {
	      var nameinchannel = 0;
	      for(var j = 0; j < channel.length; j++){
	        for(var k = 0; k < channelName[j].length; k++)
	          if(channelName[j][k] == tableName[i]){
	            socket.emit('user-login', tableName[i]+" ("+channel[j]+")");
	            nameinchannel = 1;
	          }
	      }
	      if(nameinchannel == 0){
	        socket.emit('user-login', tableName[i]);
	      }
	    }
	    if(channel.length != 0){
	      for(var i = 0; i < channel.length; i++){
	        socket.emit('newChannel', channel[i]);
	      }
	    }
	  }
  });

  //add a channel
  socket.on('channel', function(nameChannel) {
    var test = 0;
    for(var i = 0; i < channel.length; i++){
      if (channel[i] == nameChannel){
        test = 1;
      }
    }
    if (test != 1){
      if(inChannel !=  -1){
        for(var i = 0; i < channelName[inChannel].length; i++){
          if(idName == channelName[inChannel][i]){
            var removed = channelName[inChannel].splice(i, 1); 
          }
        }
      }
      channel.push(nameChannel);
      channelName[channel.length-1] = new Array();
      channelName[channel.length-1].push(idName);
      io.emit('newChannel', nameChannel);
      inChannel = channel.length-1;
      socket.emit('chat message', "You joined "+nameChannel);
      io.emit('user-logout', idName);
      io.emit('user-login', idName+" ("+nameChannel+")");
    }
  })

  //disconnect
  socket.on('disconnect', function(){
  	if(idName != null){
	    console.log(idName +' disconnected ');
	    io.emit('chat message', "server : "+idName+ " disconnected");
	    io.emit('user-logout', idName);
	}
    for(var i = 0; i < tableName.length; i++){
    	if(idName == tableName[i]){
			 var removed = tableSocket.splice(i, 1);
			 removed = tableName.splice(i, 1);
		  }
    }
    if(inChannel != -1){
      for(var i = 0; i < channelName[inChannel].length; i++){
        if(idName == channelName[inChannel][i]){
          var removed = channelName[inChannel].splice(i, 1); 
        }
      }
    }
  });

  
  //login
  socket.on('login', function(msg){
    var pseudo = msg.substring(0, msg.lastIndexOf(';'));
    var psw = msg.substring(msg.lastIndexOf(';')+1);
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      findDocuments(socket, pseudo, psw, db, function() {
        db.close();
      });
    });
  });

  //Register
  socket.on('Register', function(msg){
    var pseudo = msg.substring(0, msg.lastIndexOf(';'));
    var psw = msg.substring(msg.lastIndexOf(';')+1);
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      findExist(socket, pseudo, psw, db, function(){
        db.close();
      });
    });
  });

  // error
  socket.on('err', function(err){
  	console.log(idName +' disconnected ');
    io.emit('chat message', "server : "+idName+ " disconnected");
    io.emit('user-logout', idName);
    for(var i = 0; i < tableName.length; i++){
    	if(idname == tableNAme[i]){
			 var removed = tableSocket.splice(i, 1);
			 removed = tableName.splice(i, 1);
		  }
	  }
    if(inChannel != -1){
      for(var i = 0; i < channelName[inChannel].length; i++){
        if(idName == channelName[inChannel][i]){
          var removed = channelName[inChannel].splice(i, 1); 
        }
      }
    }
  });

});



http.listen(8000, function(){
  console.log('listening on : 8000');
});

