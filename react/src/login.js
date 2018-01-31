/*
******************************************************
Import
******************************************************
 */
import React from 'react';
import {render} from 'react-dom';

/*
******************************************************
Error when the user don't use the good ID
******************************************************
 */
function Error1(props) {
	if(props.error1){
		return(
		<div id="error1">
	    	<p className="message">Your username/password is incorrect, please retry :(</p>
	    </div>);
	}
	else{
		return(null);
	}
}

/*
******************************************************
Display the Login page
******************************************************
 */
export default class Login extends React.Component{
	constructor(props){
		super(props);
		this.state={
			inputPseudo:'',
			inputPwd: ''
		};
		//Active when a new letter is add
		this.handleChangePseudo = this.handleChangePseudo.bind(this);
		this.handleChangePwd = this.handleChangePwd.bind(this);
		//Fonction to the connect with the server
		this.handlelog = this.handlelog.bind(this);
		//Change between Login and register
		this.handleLogReg = this.handleLogReg.bind(this);
		//Go to the doc
		this.handledoc = this.handledoc.bind(this);
	}

	handleChangePseudo(e){
		e.preventDefault();
		this.setState({inputPseudo: e.target.value});
	}

	handleChangePwd(e){
		e.preventDefault();
		this.setState({inputPwd: e.target.value});
	}

	handlelog(e){
		e.preventDefault();
		if(!this.state.inputPseudo.trim() == '' && !this.state.inputPwd.trim() == ''){
			this.props.handleLogin(this.state.inputPseudo.trim(), this.state.inputPwd.trim());
		}
		this.setState({
			inputPwd: ''
		});
	}

	handleLogReg(){
		this.props.handleLogReg();
	}

	handledoc(e){
		e.preventDefault();
		RedirectionJavascript();
	}	

	render(){
		return (
			<form 
				className="login-form" 
				id="login"
				onSubmit={this.handlelog}
			>
			    <input 
			    	type="text"
			    	autoComplete="off" 
			    	placeholder="username"
			    	id="username" 
			    	value={this.state.inputPseudo}
			    	onChange={this.handleChangePseudo}
			    />
			    <input 
			    	type="password"
			    	autoComplete="off" 
			    	placeholder="password"
			    	id="psw" 
			    	value={this.state.inputPwd}
			    	onChange={this.handleChangePwd}
			    />
			    <button
			    	type="submit"
			    	form="login"
			    	value="Submit"
			    >
			    	login
			    </button>
			    <p className="message">Not registered? <a href="#" onClick={this.handleLogReg}>Create an account</a></p>
			    <p className="doc">You can find the doc <a href="#" onClick={this.handledoc}>here</a></p>
			    <Error1 error1={this.props.error1}/>
			</form>	
		);
	}
}
