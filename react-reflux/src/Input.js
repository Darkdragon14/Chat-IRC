/*
******************************************************
Import 
******************************************************
 */
import React from 'react';
import {render} from 'react-dom';
import Reflux from 'reflux';
import Store from './Store';
import Actions from './Actions';


/*
******************************************************
Display the input text
******************************************************
 */
export default class Input extends Reflux.Component{
	constructor(props) {
	    super(props);
	    this.store = Store;
	   	//access to the function in the store 
	    this.handleInputChange = this.handleInputChange.bind(this);
	    this.handleSubmit = this.handleSubmit.bind(this);
  	}

  	handleSubmit(e){
  		e.preventDefault();
  		Actions.submit();
  	}

  	handleInputChange(e){
  		e.preventDefault();
  		Actions.inputMsgChange(e.target.value);
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
			        	value={this.state.inputMsg} 
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