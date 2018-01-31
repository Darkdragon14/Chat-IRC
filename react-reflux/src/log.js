/*
******************************************************
Import 
******************************************************
 */
import React from 'react';
import {render} from 'react-dom';
import Login from './login';
import Sigin from './sigin';
import Reflux from 'reflux';
import Store from './Store';

/*
******************************************************
Choose between create an account and Login
******************************************************
 */
function RegLog(props) {
  const check = props.check;
  if (check) {
    return <Sigin/>;
  }
  else{
  	return <Login/>;
  }
}

/*
******************************************************
The main class of the Login page
******************************************************
 */
export default class User extends Reflux.Component{
	constructor(props){
		super(props);
		this.store = Store;
	}

	render(){
		return (
			<div className="login-page">
	 			<div className="form">
	 				<RegLog
	 					check={this.state.checkLog}
					/> 			
				</div>
	 		</div>	
		);
	}
}
