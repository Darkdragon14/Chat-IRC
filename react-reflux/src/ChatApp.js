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


	render(){
		return(<div>
					<History/>
					<section id="list">
						<User/>
						<Groupe/>
					</section>
					<Input/>
				</div>
		);
	}

}