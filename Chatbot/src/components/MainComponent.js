import React, { Component } from 'react';

import Sidebar from './Sidebar';
import ChatInput from './ChatInput.js';
import Messages from './Messages.js'; 
import '../styles/MainComponent.css';

import { BrowserRouter } from 'react-router-dom';


class MainComponent extends Component {
    constructor(props) {
      super(props)
      this.state = {
        flag: 0,
        response: [],
        msgArray: []
      }

      this.sendMessage = this.sendMessage.bind(this);
      this.scrollToBottom = this.scrollToBottom.bind(this)
      this.history = this.history.bind(this)
    }
    scrollToBottom(){
      this.el.scrollIntoView({block:'end',behavior:'smooth'});
    }

    componentDidMount(){
      this.scrollToBottom();
    }
    componentDidUpdate(){
      this.scrollToBottom();
    }

    history() {
      // console.log('zid please')
      // console.log(this.props.zid)
      if (this.state.flag == 0) {
        this.setState({flag:1})

        console.log('where is url')
        const url = window.location.href;
        console.log(url);
        const res = url.substring(31, 39);
        console.log(res);


        // this is a test for history
        var that = this
        const message = JSON.stringify({'zid':res, 'type':'history'});
        // console.log('this is message');
        // console.log(message);
        var test = fetch("http://127.0.0.1:5001/v33/ask", {
          method: "POST",
          body: JSON.stringify({message: message}),
          headers: {
            'Content-Type': 'application/json',
        }
        }).then(response => {
          if (response.ok) {
            return response;
          } else {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
          }
        },
        error => {
              throw error;
        }).then(function(response) {
          return response.json()
        }).then(function(detail) {
          console.log(detail);
          if (detail != 'id not exist' && detail['msgarray'].length != 0 && detail['rsparray'].length != 0){
            const new_res = that.state.response.concat(detail['rsparray'])
            const new_msg = that.state.msgArray.concat(detail['msgarray'])
            return (that.setState({response:new_res,msgArray: new_msg}))
          }

        })
        .catch(error => {alert('history cannot be displayed due to the server error')
        })
 
      }
    }
      
    sendMessage(message) {
      if(message === ''){
        // alert('Input message cannot be None')
        console.log('No input at all');
      }else{
            this.setState({
        msgArray: [...this.state.msgArray, message]
        
      })

      console.log('where is url')
      const url = window.location.href;
      console.log(url);
      const res = url.substring(31, 39);
      console.log(res);

      var that = this
      message = JSON.stringify({'message':message, 'zid':res})
      console.log(JSON.stringify({message: message}))
      var func = fetch("http://127.0.0.1:5001/v33/ask", {
        method: "POST",
        body: JSON.stringify({message: message}),
        headers: {
          'Content-Type': 'application/json',
      }
      }).then(response => {

        if (response.ok) {

          return response;
        } else {
          var error = new Error('Error ' + response.status + ': ' + response.statusText);
          error.response = response;
          throw error;
        }
      },
      error => {
            throw error;
      }).then(function(response) {

        return response.json()
      }).then(function(detail) {
        console.log(detail);

        return (that.setState({response: [...that.state.response, detail]}))

      })
      .catch(error =>  { message = {'description':['can not understand what you are saying'],'image':[],'related':[],'relevantChapter':[],'moreInformation':[]}; that.setState({
        response: [...that.state.response, message]
      })
      })
      }
    }
    render() {

      this.history()
      // var msg = this.state.msg
      var msgArray = this.state.msgArray
      var response = this.state.response
  
      return (

          <div className="app" style={{"background-image": "linear-gradient(to bottom , #66523a, #738275,#6a5540)"}}>
            <div className='first_div'>
              <div className="row" >
                    <Sidebar></Sidebar>
                    <Messages messageList={this.state.msgArray} response={this.state.response} onSend={this.sendMessage}/>
                    {/* <div ref={el => { this.el = el}}> </div> */}
              </div>
            </div>
            <div ref={el => { this.el = el}}> </div>
            <ChatInput onSend={this.sendMessage}/>
          </div>
          

      )

    }
}

export default MainComponent;
