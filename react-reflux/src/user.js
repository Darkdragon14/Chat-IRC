/*
******************************************************
Import
******************************************************
 */
import React from 'react';
import {render} from 'react-dom';
import Reflux from 'reflux';
import Action from './Actions';
import Store from './Store';


/*
******************************************************
Display the user's list
******************************************************
 */
export default class User extends Reflux.Component{
	constructor(props) {
	    super(props);
	    this.store = Store;
	    //send to one person
	    this.handleClick = this.handleClick.bind(this);
	}

	handleClick(user, e){
		e.preventDefault();
		Action.sendOnePerson(user);
	}

	render(){
		return (
			<ul id="users">
        		<li>List of users</li>
        		{this.state.user.map(function(user, id){
					return (
						<button id="bchannel" key={id} onClick={(evt) => this.handleClick(user, evt)}>
							{user}
						</button>
					);
				}, this)
		    	}
      		</ul>
		);
	}
}
