/*
******************************************************
Import
******************************************************
 */
import React from 'react';
import {render} from 'react-dom';

/*
******************************************************
the write section
******************************************************
 */
export default class Input extends React.Component{
	constructor(props) {
	    super(props);
	    this.state={
	    	inputValue: ''
	    };
	    //send the msg
	    this.handleSubmit = this.handleSubmit.bind(this);
	    //Active when a new letter is add
	    this.handleInputChange = this.handleInputChange.bind(this);
  	}

  	handleSubmit(e){
  		e.preventDefault();
  		if(!this.state.inputValue.trim() == ''){
  		 	this.props.emitMessage(this.state.inputValue.trim());
  		}
  		this.setState({inputValue: ''});
  	}

  	handleInputChange(e){
  		e.preventDefault();
  		this.setState({inputValue: e.target.value});
  		this.props.handleInputChange(e.target.value);
  	}

	render(){
		return(
			<div id="write">
		      	<form 
		      		id="send" 
		      		onSubmit={this.handleSubmit}
		    	>
			        <input 
			        	id="m" 
			        	value={this.state.inputValue} 
			        	autoComplete="off" 
			        	onChange={this.handleInputChange}
			        />
			        <button 
			        	type="submit" 
			        	form="send" 
			        	value="Submit"
			        >
			        	Send
			        </button>
		      	</form>
		    </div>
		);
	}
}