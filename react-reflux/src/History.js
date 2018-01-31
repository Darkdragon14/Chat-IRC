import React from 'react';
import {findDOMNode, render} from 'react-dom';
import Reflux from 'reflux';
import Store from './Store'

export default class History extends Reflux.Component{
	constructor(props){
		super(props);
		this.store = Store;
	}

	scrollToBottom(){
	    findDOMNode(this.messagesEnd).scrollIntoView({
            behavior: 'smooth'
        });
	}

	componentDidMount() {
	    this.scrollToBottom();
	}

	componentDidUpdate() {
	    this.scrollToBottom();
	}

	render(){
		return(
			<ul id="messages">
				<div>
			        {this.state.msg.map(function(messages, id){
						return (
							<li key={id}>
								{messages}
							</li>
						);
					})
			    	}
			    	<div style={ {float:"left", clear: "both"} }
		                ref={(el) => { this.messagesEnd = el; }}>
		            </div>
		        </div>
		    </ul>
		);
	}
}