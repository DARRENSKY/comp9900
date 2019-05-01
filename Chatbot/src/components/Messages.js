import React from 'react';

import icon1 from '../images/test_bot.gif';
import icon2 from '../images/icon-user-16px.png';
require('../styles/MainComponent.css');
require('../styles/ChatInput.css');


class Messages extends React.Component {
    constructor(props) {
        super(props)
        this.handleClickEvent = this.handleClickEvent.bind(this);
      }

      handleClickEvent(list_item, send){
        return function (e) {
            console.log(list_item)
            console.log('ha')
            send(list_item);
        }
      }

  render() {

    // console.log(this.props.response)
    // console.log(this.props.messageList)

    const response_array = function(para, handleClickEvent, onSend) {        
        console.log(para);
        console.log("this is para")

      if (para){

        if (para['related'].length == 0 && para['moreInformation'].length == 0 && para['relevantChapter'].length == 0 && para['image'].length == 0 && para['description'][0].length == 0){
            console.log('try to edit it')
            para = {'description': ["can't understand what you are saying"], 'image': [], 'related': [], 'relevantChapter': [], 'moreInformation': []}

        }

        console.log(para);

        const related_items = () => {

            return para['related'].map((list_item, number) => {
            return (
                <button className = "input-link" key = {number} onClick={handleClickEvent(list_item, onSend)} style = {{display: "block"}}>{list_item}</button>
            );
            
        })};
        
        const related = () => {
            console.log(para['related'])
            if (para['related'].length > 0){
                return (
                    <div style = {{"whiteSpace": "pre-wrap", "flex": 1}}>
                        <div className="pt-3" style={{textAlign: 'left'}}>
                            <div><img stype={{opacity:'0.5'}}src={icon1} alt="Logo"/>:</div>
                            <div className="chatbot-message" > There are some related topics you may wanna check: {related_items()}</div>                           
                        </div>
                    </div>
                );
                }
        };

        const moreInformation_items = () => {

            return para['moreInformation'].map((list_item, number) => {
            return (
                <button className = "input-link" key = {number} onClick={handleClickEvent(list_item, onSend)} style = {{display: "block"}}>{list_item}</button>
            );
            
        })};
        
        const moreInformation = () => {
            console.log(para['moreInformation'])
            if (para['moreInformation'].length > 0){
                return (
                    <div style = {{"whiteSpace": "pre-wrap", "flex": 1}}>
                        <div className="pt-3" style={{textAlign: 'left'}}>
                            <div><img stype={{opacity:'0.5'}}src={icon1} alt="Logo"/>:</div>
                            <div className="chatbot-message" > If you wanna know more: {moreInformation_items()}</div>                           
                        </div>
                    </div>
                );
                }
        };

        const relevantChapter_items = () => {

            return para['relevantChapter'].map((list_item, number) => {
            return (
                <button className = "input-link" key = {number} onClick={handleClickEvent(list_item, onSend)} style = {{display: "block"}}>{list_item}</button>
            );
            
        })};
        
        const relevantChapter = () => {
            console.log(para['relevantChapter'])
            if (para['relevantChapter'].length > 0){
                return (
                    <div style = {{"whiteSpace": "pre-wrap", "flex": 1}}>
                        <div className="pt-3" style={{textAlign: 'left'}}>
                            <div><img stype={{opacity:'0.5'}}src={icon1} alt="Logo"/>:</div>
                            <div className="chatbot-message" > There are some related chapter you may wanna check: {relevantChapter_items()}</div>                           
                        </div>
                    </div>
                );
                }
        };

        const description = () => {
            console.log(para['description'][0].length)
            if (para['description'][0].length > 1){
                console.log('what the hell')
                const result = para['description'].map((list_item, number) => {
                return (
                    <div style = {{"whiteSpace": "pre-wrap", "flex": 1}} key={number}>
                        <div className="pt-3" style={{textAlign: 'left'}}>
                            <div><img src={icon1} alt="Logo"/>:</div>
                            <div className="chatbot-message">{list_item}</div>                           
                        </div>
                    </div>
                );
                
                })
                return result;
            }
        };

        const image = () => {
                return para['image'].map((list_item, number) => {
                return (
                    <div className="" key = {number}><img src={`data:image/png;base64,${list_item}`} alt="Logo"/></div>
                )})};
            

        const images = () => {
            console.log(para['image'])
            if (para['image'].length > 0){
                return (
                    <div style = {{"whiteSpace": "pre-wrap", "flex": 1}}>
                        <div className="pt-3" style={{textAlign: 'left'}}>
                            <div><img src={icon1} alt="Logo"/>:</div>
                            <div className="" >{image()} </div>                           
                        </div>
                    </div>
                );
                };
        };

        const answer_function = () => {
            return (
                <div>
                {description()}
                {images()}
                {related()}
                {relevantChapter()}
                {moreInformation()}
                </div>
            )
        }
        return answer_function();

        
    }};
 
      
      const messages =this.props.messageList.map((message, index) => {
        return (
            <div style = {{"whiteSpace": "pre-wrap", "flex": 1}} key={index}>
                <div className="pt-3" style={{textAlign: 'right'}}>
                    <div ><img src={icon2} alt="Logo"/>:</div>
                    <div className ="user-message"> {message}</div>
                </div>

                {response_array(this.props.response[index], this.handleClickEvent, this.props.onSend)}
                
            </div>
        );
      });
    return (

        <div className="divborderleft col-md-8 p-0 ">
            <div className="container mr-0 ml-0 mb-3 mt-3">
                <div className="col-12 mt-3" >
                    { messages}
                    <div style={{ height: "64px"}}></div>
                </div>
            </div>
        </div>
    );
  }
}

export default Messages;
