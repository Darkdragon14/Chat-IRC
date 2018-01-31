/*
******************************************************
Import
******************************************************
 */
import React from 'react';
import {findDOMNode, render} from 'react-dom';

/*
******************************************************
Display the message's history
******************************************************
 */
export default class History extends React.Component{
	constructor(props){
		super(props);
	}

	//autoscroll
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
			        {this.props.msg.map(function(messages, id){
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