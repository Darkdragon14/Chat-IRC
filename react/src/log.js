/*
******************************************************
Import 
******************************************************
 */
import React from 'react';
import {render} from 'react-dom';
import Login from './login';
import Sigin from './sigin';

/*
******************************************************
Choose between create an account and Login
******************************************************
 */
function RegLog(props) {
  const check = props.check;
  if (check) {
    return <Sigin 
    	handleRegister={props.handleRegister}
    	handleLogReg={props.handleLogReg}
    	error2={props.error2}
    />;
  }
  else{
  	return <Login 
  		handleLogin={props.handleLogin}
  		handleLogReg={props.handleLogReg}
  		error1={props.error1}
  	/>;
  }
}

/*
******************************************************
The main class of the Login page
******************************************************
 */
export default class User extends React.Component{
	constructor(props){
		super(props);
		this.state={
			check: false
		};
		//Login
		this.handleLogin = this.handleLogin.bind(this);
		//Register
		this.handleRegister = this.handleRegister.bind(this);
		//Choose between create an account and Login
		this.handleLogReg = this.handleLogReg.bind(this);
	}

	handleLogin(pseudo, pwd){
		this.props.Log(pseudo, pwd);
	}

	handleRegister(pseudo, pwd){
		this.props.register(pseudo, pwd);
	}

	handleLogReg(){
		if(this.state.check){
			this.setState({
				check: false
			});
		}
		else{
			this.setState({
				check: true,
			});
		}
		
	}

	render(){
		return (
			<div className="login-page">
	 			<div className="form">
	 				<RegLog
	 					error1={this.props.error1}
	 					error2={this.props.error2}
	 					handleRegister={this.handleRegister}
						handleLogin={this.handleLogin}
						handleLogReg={this.handleLogReg}	
						check={this.state.check}
					/> 			
				</div>
	 		</div>	
		);
	}
}
