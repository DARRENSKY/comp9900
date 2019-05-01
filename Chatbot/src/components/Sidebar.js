import React from 'react';

class Sidebar extends React.Component {
  render() {
    return (
        <div className="col-md-4 d-none d-md-block p-0" style={{color:"white","fontWeight": "bold"}}>
            <div className="col-12 text-center pt-4 pr-3 pl-3 pb-3">
            COMP9444 ChatBot 🤗
            </div>
            <div className="col-12 pl-4 pr-4 pt-3 pb-3">
                <p>
                Hi, there. I am your friend, a chat bot. You can ask me questions about information of CSE course COMP9444, including course outline, lecture notes, quizes, etc. I will be pleasure answering your questions, so do not be shy. Just talk to me.
                </p>
                <p>
                Below are some question types you can ask.
                </p>
                <div style={{color:"black"}}>
                <p>
                Sample1:
                </p>
                <p>
                What are the assessment components of the course?
                </p>

                <p>
                Sample answer: Assignments (40%), Written Exam (60%).
                </p>
                <p>
                Sample2:
                </p>
                <p>
                Is decision tree belongs to supervised learning?
                </p>
                <p>
                Sample answer: Yes.
                </p>
                <p>
                Sample3:
                </p>
                <p>
                What is supervised learning?
                </p>
                <p>
                Sample answer: The agent is presented with examples of inputs and the target
        outputs.

                </p>
                </div>
                <p style={{"textAlign": "center"}}>
                <span>🎉</span>
                <span>😎</span>
                </p>
            </div>
         
        </div>
    );
  }
}

export default Sidebar;