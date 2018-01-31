/*
******************************************************
Import
******************************************************
 */
import React from 'react';
import {render} from 'react-dom';

/*
******************************************************
Display the group's list
******************************************************
 */
export default class Groupe extends React.Component{
	constructor(props) {
	    super(props);
	    this.state={
	    	inputValue: ''
	    };
	    //send the group
	    this.handleSubmit = this.handleSubmit.bind(this);
	    //Active when a new letter is add
	    this.handleInputChange = this.handleInputChange.bind(this);
  		//Join a Group
  		this.handleClick = this.handleClick.bind(this);
	}


	handleClick(channel, e){
		e.preventDefault();
		this.props.handlejoin(channel);
	}

  	handleSubmit(e){
  		e.preventDefault();
  		if(!this.state.inputValue.trim() == ''){
  		 	this.props.emitGroupe(this.state.inputValue.trim());
  		}
  		this.setState({inputValue: ''});
  	}

  	handleInputChange(e){
  		e.preventDefault();
  		this.setState({inputValue: e.target.value});
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
		            		value={this.state.inputValue} 
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
		        {this.props.channel.map(function(channel, id){
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