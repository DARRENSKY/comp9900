import React from 'react';
import icon1 from '../images/logout.png';
require('../styles/ChatInput.css');
require('../styles/LoginPage.css');



class ChatInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { message : '' ,};
    this.changedData = this.changedData.bind(this);
    this.handleSendEvent = this.handleSendEvent.bind(this)
    this.handleSendEventByKey = this.handleSendEventByKey.bind(this)
  }

  logoutEvent() {
    window.location = '/';
  }
  changedData(e) {
    this.setState({
      message: e.target.value
    })
  }

  handleSendEventByKey(event){
    if(event.key !== 'Enter') { return; }
    this.handleSendEvent();
  }

  handleSendEvent() {
    this.props.onSend(this.state.message);
    this.setState({message: ''});
  }

  render() {
    return (
        <div className='second_div'>
          <div className ="row">
              <div className="col fixed-bottom border-top border-dark p-0" style={{ height: "64px", backgroundColor:'#b6b8ab'}}>
                  <div className="row footer-color">
                      <div className="col-md-4 d-none d-md-block text-center p-3" style={{color:"white","fontWeight": "bold"}}>
                          <img onClick = {this.logoutEvent} src={icon1} alt="Logo"/>LogOut

                      </div>
                      <div className="col-md-8 borderleft " style={{display: 'flex'}}>
                          <input className="input-message p-2" value={this.state.message} onChange={this.changedData}   onKeyPress={this.handleSendEventByKey}   placeholder={"Type your message..."} />
                          <button className="input-button p-2" onClick={this.handleSendEvent}>Send</button>
  
                      </div>
                  </div>  
              </div>
          </div>
        </div>

    );
  }
}

export default ChatInput;
