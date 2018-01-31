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
import ChatApp from './ChatApp';
import Log from './log';
import './style.css';
import './log.css';



/*
******************************************************
Choose between the log page or the chat page
******************************************************
 */
function Greeting(props) {
  const check = props.check;
  if (check) {
    return <ChatApp/>;
  }
  return <Log/>;
}


/*
******************************************************
The Main class of this project
******************************************************
 */
class App extends Reflux.Component { 
    constructor(props) {
        super(props);
        this.store = Store;
    }
    
    render(){

        return(
            <Greeting 
                check={this.state.check}
            />
        );
    }
}



render(<App/>, document.getElementById('app'));

