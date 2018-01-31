/*
******************************************************
Import 
******************************************************
 */
import React from 'react';
import User from './user';
import {render} from 'react-dom';
import History from './History';
import Input from './Input';
import Groupe from './Groupe';


/*
******************************************************
The main class of the chat page
******************************************************
 */
export default class ChatApp extends React.Component{
	constructor(props){
		super(props);
		this.state={
			inputValue: ''
		}
		//pass function between child and parent of this page
		this.handleSendMessage = this.handleSendMessage.bind(this);
		this.emitGroupe = this.emitGroupe.bind(this);
		this.handlejoin = this.handlejoin.bind(this);
		this.handleSendOnePerson = this.handleSendOnePerson.bind(this);
	    //Active when a new letter is add
		this.handleInputChange = this.handleInputChange.bind(this);
	}

    handleSendMessage(msg){
		this.props.emit(msg);
	}

	emitGroupe(nameChannel){
		this.props.emitGroupe(nameChannel);
	}

	
	handlejoin(channel){
		this.props.handlejoin(channel);
	}
	
	handleSendOnePerson(user){
		this.props.handleSendOnePerson(user, this.state.inputValue);
	}

	handleInputChange(input){
		this.setState({
			inputValue: input
		});
	}

	render(){
		return(<div>
					<History msg={this.props.msg} nbmsg={this.props.rnbmsg}/>
					<section id="list">
						<User user={this.props.user} sendOnePerson={this.handleSendOnePerson}/>
						<Groupe emitGroupe={this.emitGroupe} channel={this.props.channel} handlejoin={this.handlejoin}/>
					</section>
					<Input emitMessage={this.handleSendMessage} handleInputChange={this.handleInputChange}/>
				</div>
		);
	}

}