/*
******************************************************
Import
******************************************************
 */
import React from 'react';
import {render} from 'react-dom';


/*
******************************************************
Display the user's list
******************************************************
 */
export default class User extends React.Component{
	constructor(props) {
	    super(props);
	    //send to one person
	    this.handleClick = this.handleClick.bind(this);
	}

	handleClick(user, e){
		e.preventDefault();
		this.props.sendOnePerson(user);
	}

	render(){
		return (
			<ul id="users">
        		<li>List of users</li>
        		{this.props.user.map(function(user, id){
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
