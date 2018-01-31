/*
******************************************************
Import 
******************************************************
 */
import Reflux from 'reflux';
import Actions from './Actions';
import io from 'socket.io-client';


var socket = io.connect('http://localhost:8000');

/*
******************************************************
Store of the app
******************************************************
 */
export default class Store extends Reflux.Store{
    constructor(){
        super();
        this.state = {
        	socket: socket,
			check: false,
			error1: false,
			error2: false,
			pseudo: '',
			msg: [],
			user: [],
			nbmsg: 0,
			channel: [],
			inputMsg: '',
			inputGroup: '',
			inputPseudoR: "",
			inputPwdR: "",
			checkLog: false,
			inputPseudo:'',
			inputPwd: ''
        };
        this.listenables = Actions;
        //emit a message
        this.handleSend = this.handleSend.bind(this);
        //Check id
        this.handleCheckR = this.handleCheckR.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        //receiver pseudo
        this.handleUser = this.handleUser.bind(this);
        //An Array of msg
        this.handleMsg = this.handleMsg.bind(this);
        //when an user is disconnect
        this.handleOut = this.handleOut.bind(this);
        //add a channel
        this.handleNewChannel = this.handleNewChannel.bind(this);
        //boolean to choose between log or app
        this.handlecheck = this.handlecheck.bind(this);
    }

    handleSend(msg){
		if(msg == 'quit'){
			this.setState({channel: ''});
		}
		if(msg.substring(0, 5) == 'join;'){
			if(this.state.channel != ""){
				this.state.socket.emit('chat message', 'quit');
			}
		}
		this.state.socket.emit('chat message', msg);
	}
    
   	onSubmit(){
  		if(!this.state.inputMsg.trim() == ''){
  		 	if(this.state.inputMsg.substring(0, 5) == 'join;'){
				if(this.state.channel != ""){
					this.state.socket.emit('chat message', 'quit');
				}
			}
			this.state.socket.emit('chat message', this.state.inputMsg);
  		}
  		this.setState({inputMsg: ''});
	}

	onInputMsgChange(msg){
		this.setState({inputMsg: msg});
	}

	onJoin(channel){
		if(channel=="quit"){
			this.handleSend("quit");
		}
		else{
			this.handleSend("join;"+channel);
		}
	}

	onSubmitGroup(){
		if(!this.state.inputGroup.trim() == ''){
  		 	this.state.socket.emit('channel', this.state.inputGroup);
  		}
  		this.setState({inputGroup: ''});
	}

	onInputGroupChange(group){
		this.setState({inputGroup: group});
	}

	onSendOnePerson(user){
		if(!this.state.inputMsg.trim() == ''){
			this.handleSend('s;'+user+";"+this.state.inputMsg);
		}
		this.setState({inputMsg: ''});
	}

	onInputPseudoRChange(PseudoR){
		this.setState({inputPseudoR: PseudoR});
	}

	onInputPwdRChange(PwdR){
		this.setState({inputPwdR: PwdR});
	}

	onReg(){
		if(!this.state.inputPseudoR.trim() == '' && !this.state.inputPwdR.trim() == ''){
			this.state.socket.emit('Register', this.state.inputPseudoR.trim()+";"+this.state.inputPwdR.trim());
			this.handlecheck(this.state.inputPseudoR);
			this.state.socket.on('check', this.handleCheckR);
			this.state.socket.on(this.state.pseudo, this.handleMsg);
		}
		this.setState({
			inputPwdR: ''
		});
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

	onLogReg(){
		if(this.state.checkLog){
			this.setState({
				checkLog: false
			});
		}
		else{
			this.setState({
				checkLog: true,
			});
		}
	}

	onLog(){
		if(!this.state.inputPseudo.trim() == '' && !this.state.inputPwd.trim() == ''){
			this.state.socket.emit('login', this.state.inputPseudo.trim()+";"+this.state.inputPwd.trim());
			this.handlecheck(this.state.inputPseudo);
			this.state.socket.on('check', this.handleCheck);
			this.state.socket.on(this.state.pseudo, this.handleMsg);
		}
		this.setState({
			inputPwd: ''
		});
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

	onInputPseudoChange(Pseudo){
		this.setState({inputPseudo: Pseudo});
	}

	onInputPwdChange(Pwd){
		this.setState({inputPwd: Pwd});
	}

	handleUser(user){
        this.state.user.push(user);
    }

    handleMsg(msg){
        this.state.msg.push(msg),
        this.setState({
            nbmsg: this.state.nbmsg + 1
        });
    }

	handleOut(user){
        for(var i = 0; i <= this.state.user.length; i++){
            if(this.state.user[i] == user){
                delete this.state.user[i];
            }
        }
    }

    handleNewChannel(channel){
        this.state.channel.push(channel);
    }

    handlecheck(pseudo){
		this.setState({
			pseudo: pseudo,			
		});
		
	}
}

