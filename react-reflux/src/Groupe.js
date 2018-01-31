/*
******************************************************
Import 
******************************************************
 */
import React from 'react';
import {render} from 'react-dom';
import Reflux from 'reflux';
import Actions from './Actions';
import Store from './Store';

/*
******************************************************
Display the group's list
******************************************************
 */
export default class Groupe extends Reflux.Component{
	constructor(props) {
	    super(props);
	    this.store = Store;
	    //access to the function in the store 
	    this.handleSubmit = this.handleSubmit.bind(this);
	    this.handleInputChange = this.handleInputChange.bind(this);
  		this.handleClick = this.handleClick.bind(this);
	}


	handleClick(channel, e){
		e.preventDefault();
		Actions.join(channel);
	}

  	handleSubmit(e){
  		e.preventDefault();
  		Actions.submitGroup();
   	}

  	handleInputChange(e){
  		e.preventDefault();
  		Actions.inputGroupChange(e.target.value);
  	}
 	 	
	render(){
		return(
			<ul id="channel">
		        <li id="titlechannel">List of channels</li>
		        <li>
		          	<form 
		          		id="ch" 
		          		onSubmit={this.handleSubmit}
		        	>
		            	<input 
		            		id="add" 
		            		value={this.state.inputGroup} 
			        		autoComplete="off" 
			        		onChange={this.handleInputChange}
			        	/>
		            	<br />
		            	<button
		            		type="submit" 
			        		form="ch" 
			        		value="Submit"
		            	>
		            		Add a channel
		            	</button>
		          	</form>
		        </li>
		        <button id="bchannel" onClick={(evt) => this.handleClick("quit", evt)}>Root</button>
		        {this.state.channel.map(function(channel, id){
					return (
						<button id="bchannel" key={id} onClick={(evt) => this.handleClick(channel, evt)}>
							{channel}
						</button>
					);
				}, this)
		    	}
		    </ul>
		);
	}
}