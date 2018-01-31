/*
******************************************************
Import
******************************************************
 */
import React from 'react';
import {render} from 'react-dom';

/*
******************************************************
Error when the user try with a pseudo already use
******************************************************
 */
function Error2(props) {
	if(props.error2){
		return(
		<div id="error2">
	    	<p className="message">This pseudo is already used :(</p>
	    </div>);
	}
	else{
		return(null);
	}
}

/*
******************************************************
Display the Register page
******************************************************
 */
export default class Sigin extends React.Component{
	constructor(props){
		super(props);
		this.state={
			inputPseudoR: "",
			inputPwdR: ""
		};
		//Active when a new letter is add
		this.handleChangePseudoR = this.handleChangePseudoR.bind(this);
		this.handleChangePwdR = this.handleChangePwdR.bind(this);
		//Fonction to the connect with the server
		this.handleReg = this.handleReg.bind(this);
		//Change between Login and register
		this.handleLogReg = this.handleLogReg.bind(this);
		//Go to the doc
		this.handledoc = this.handledoc.bind(this);
	}

	handleChangePseudoR(e){
		e.preventDefault();
		this.setState({inputPseudoR: e.target.value});
	}

	handleChangePwdR(e){
		e.preventDefault();
		this.setState({inputPwdR: e.target.value});
	}

	handleReg(e){
		e.preventDefault();
		if(!this.state.inputPseudoR.trim() == '' && !this.state.inputPwdR.trim() == ''){
			this.props.handleRegister(this.state.inputPseudoR.trim(), this.state.inputPwdR.trim());
		}
		this.setState({
			inputPwdR: ''
		})
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
				className="register-form" 
				id="Register"
				onSubmit={this.handleReg}
			>
			    <input 
			    	type="text"
			    	autoComplete="off" 
			    	placeholder="username"
			    	id="usernameR" 
			    	value={this.state.inputPseudoR}
			    	onChange={this.handleChangePseudoR}
			    />
			    <input 
			    	type="password"
			    	autoComplete="off"
			    	placeholder="password"
			    	id="pswR" 
			    	value={this.state.inputPwdR}
			    	onChange={this.handleChangePwdR}
			    />
			    <button
			    	type="submit"
			    	form="Register"
			    	value="Submit"
			    >
					create
				</button>
			    <p className="message">Already registered? <a href="#" onClick={this.handleLogReg}>Sign In</a></p>
			    <p className="doc">You can find the doc <a href="#" onClick={this.handledoc}>here</a></p>
			    <Error2 error2={this.props.error2}/>
			</form>
		);
	}
}
 