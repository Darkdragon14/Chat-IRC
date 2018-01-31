/*
******************************************************
Import and init socket
******************************************************
 */
import React from 'react';
import ChatApp from './ChatApp';
import Log from './log';
import {render} from 'react-dom';
import './style.css';
import './log.css';
import io from 'socket.io-client';

var socket = io.connect('http://localhost:8000');


/*
******************************************************
Choose between the log page or the chat page
******************************************************
 */
function Greeting(props) {
  const check = props.check;
  if (check) {
    return <ChatApp 
    	emit={props.emit}
    	msg={props.msg}
    	user={props.user}
    	emitGroupe={props.emitGroupe}
    	channel={props.channel}
    	handlejoin={props.handlejoin}
    	handleSendOnePerson={props.handleSendOnePerson}
    />;
  }
  return <Log 
  	Log={props.log}
  	register={props.register}
  	error1={props.error1}
  	error2={props.error2}
  />;
}


/*
******************************************************
The Main class of this project
******************************************************
 */
class App extends React.Component { 
	constructor(props) {
	    super(props);
		this.state={
			socket: socket,
			check: false,
			error1: false,
			error2: false,
			pseudo: '',
			msg: [],
			user: [],
			nbmsg: 0,
			channel: []
		};
		//save the pseudo
		this.handlecheck = this.handlecheck.bind(this);
		//emit a message
		this.handleSend = this.handleSend.bind(this);
		//Login
		this.handleLog = this.handleLog.bind(this);
		//Register
		this.handleRegister = this.handleRegister.bind(this);
		//Check id
		this.handleCheck = this.handleCheck.bind(this);
		this.handleCheckR = this.handleCheckR.bind(this);
		//receiver msg
		this.handleMsg = this.handleMsg.bind(this);
		//receiver pseudo
		this.handleUser = this.handleUser.bind(this);
		//receiver when an user disconnect
		this.handleOut = this.handleOut.bind(this);
		//receive when a new groupe is create
		this.emitGroupe = this.emitGroupe.bind(this);
		//create a groupe
		this.handleNewChannel = this.handleNewChannel.bind(this);
		//join a channel
		this.handlejoin = this.handlejoin.bind(this);
		//send a msg for one person
		this.handleSendOnePerson = this.handleSendOnePerson.bind(this);
	}

	handleMsg(msg){
		this.state.msg.push(msg),
		this.setState({
			nbmsg: this.state.nbmsg + 1
		});
	}

	handleUser(user){
		this.state.user.push(user);
	}

	handlecheck(pseudo){
		this.setState({
			pseudo: pseudo,			
		});
		
	}

	handleOut(user){
		for(var i = 0; i <= this.state.user.length; i++){
			if(this.state.user[i] == user){
				delete this.state.user[i];
			}
		}
	}

	handleSend(msg){
		if(msg.substring(0, 5) == 'join;'){
			if(this.state.channel != ""){
				this.state.socket.emit('chat message', 'quit');
			}
		}
		this.state.socket.emit('chat message', msg);
	}

	handleNewChannel(channel){
		this.state.channel.push(channel);
	}

	handleCheck(msg){
		if(msg == "true"){
			this.setState({check: true});
			this.state.socket.emit('pseudo', this.state.pseudo);
			this.state.socket.on('user-login', this.handleUser);
			this.state.socket.on('chat message', this.handleMsg);
			this.state.socket.on('user-logout', this.handleOut);
			this.state.socket.on('newChannel', this.handleNewChannel);
		} 
		else{
			this.setState({
				check: false,
				error1: true
			});
		}

	}


	handleCheckR(msg){
		if(msg == "true"){
			this.setState({check: true});
			this.state.socket.emit('pseudo', this.state.pseudo);
			this.state.socket.on('user-login', this.handleUser);
			this.state.socket.on('chat message', this.handleMsg);
			this.state.socket.on('user-logout', this.handleOut);
			this.state.socket.on('newChannel', this.handleNewChannel);
		} 
		else{
			this.setState({
				check: false,
				error2: true
			});
		}
	}

	handleLog(pseudo, pwd){
		this.state.socket.emit('login', pseudo+";"+pwd);
		this.handlecheck(pseudo);
		this.state.socket.on('check', this.handleCheck);
		this.state.socket.on(pseudo, this.handleMsg);
	}

	handleRegister(pseudo, pwd){
		this.state.socket.emit('Register', pseudo+";"+pwd);
		this.handlecheck(pseudo);
		this.state.socket.on('check', this.handleCheckR);
		this.state.socket.on(pseudo, this.handleMsg);
	}

	emitGroupe(nameChannel){
		this.state.socket.emit('channel', nameChannel);
	}
	
	handlejoin(channel){
		console.log(channel);
		if(channel=="quit"){
			this.handleSend("quit");
		}
		else{
			this.handleSend("join;"+channel);
		}
	}

	handleSendOnePerson(user, msg){
		this.handleSend('s;'+user+";"+msg);
	}
	
	render(){

		return(
			<Greeting 
				msg={this.state.msg}
				check={this.state.check} 
				error1={this.state.error1}
				error2={this.state.error2}
				log={this.handleLog} 
				emit={this.handleSend}
				register={this.handleRegister}
				user={this.state.user}
				emitGroupe={this.emitGroupe}
				channel={this.state.channel}
				handlejoin={this.handlejoin}
				handleSendOnePerson={this.handleSendOnePerson}
			/>
		);
	}
}



render(<App/>, document.getElementById('app'));

