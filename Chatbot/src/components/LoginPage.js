import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem,
    Button, Form, FormGroup, Label, Input, Col, FormFeedback } from 'reactstrap';

require('../styles/LoginPage.css');

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Zid: '',
            Password: '',
            touched: {
                Zid: false,

            }
        };

        this.registerEvent = this.registerEvent.bind(this);
        this.loginEvent = this.loginEvent.bind(this);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }
    registerEvent() {
        window.location = '/register';
    }

    loginEvent = (Zid, Password, errors) => (evt) => {

            if (Zid == '' || Password == ''){
                if (Zid == ''){
                    alert("Zid can not be empty");
                }
                else if (Password == ''){
                    alert("Password can not be empty");
                }
            }
            else if(errors.Zid != '' || errors.Password != '')
                alert("Invalid Input")
            else{
                // backend function here !
                var that = this;
                const message = JSON.stringify({'zid': Zid, 'password':Password, 'type':'login'});

                console.log(JSON.stringify({message: message}));

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
                    if (detail == 'login'){


                        

                        return  (window.location = '/main?zid=' + Zid)
                    }
                    else {
                        return alert('Invalid Zid or Password, please try again.')
                    }
                    
                })
                .catch(error =>  { alert('something went wrong with the server')
                })
                }
                console.log('wait for the back end')
            }


    handleInputChange(event) {
        const target = event.target;

        const name = target.name;
        const value =  target.value
        this.setState({
          [name]: value
        });
    }

    handleBlur = (field) => (evt) => {
        this.setState({
          touched: { ...this.state.touched, [field]: true },
        });
    }

    validate(Zid, Password) {
        const errors = {
            Zid: '',
            Password: '',
        };

        if (this.state.touched.Password && Password.length < 4)
            errors.Password = 'Password should be >= 4 characters';
        else if (this.state.touched.Password && Password.length > 10)
            errors.Password = 'Password Name should be <= 10 characters';



        if (this.state.touched.Zid){
            if (Zid[0] != 'z' && Zid[0] != 'Z'){ 
                errors.Zid = 'Invalid Zid';
        }
            if (Zid.length != 8){
                errors.Zid = 'Invalid Zid';
            }
        }

        return errors;
    }


    render() {
        const errors = this.validate(this.state.Zid, this.state.Password);
        const login = () => {
            return(

                    
                            <div  className = 'register-form'>
                                <Form>
                                    <FormGroup className = "Form-Input" row>
                                        <Col md={10}>
                                            <Input type="text"
                                                placeholder="ZID*"
                                                value={this.state.Zid}
                                                name = "Zid"
                                                valid={errors.Zid === ''}
                                                invalid={errors.Zid !== ''}
                                                onChange={this.handleInputChange}
                                                onBlur={this.handleBlur('Zid')}
                                                
                                                />
                                                <FormFeedback>{errors.Zid}</FormFeedback>

                                        </Col>
                                    </FormGroup>
                                </Form>
                                {/* <div style={{height:"50px"}}></div> */}
                                <Form>             
                                    <FormGroup  className = "Form-Input" row>
                                        <Col md={10}>
                                            <Input type="text"
                                                placeholder="Password*"
                                                value={this.state.Password}
                                                name = "Password"
                                                valid={errors.Password === ''}
                                                invalid={errors.Password !== ''}
                                                onChange={this.handleInputChange}
                                                onBlur={this.handleBlur('Password')}
                                                
                                                />
                                                <FormFeedback>{errors.Password}</FormFeedback>
                                        </Col>
                                    </FormGroup>
                                </Form>

                                <FormGroup style = {{ "text-align":"center", "padding-right":"15%", "padding-top": "15px" }} row>
                                        <Col >
                                            <button onClick = {this.loginEvent(this.state.Zid, this.state.Password, errors)} class="btnRegister">
                                                login
                                            </button>
                                        </Col>
                                    </FormGroup>
                            </div>



                );
        }
        
        return (

            <div className="container register">
                <div className="row">
                    <div className="col-md-3 register-left">
                        <img src="https://image.ibb.co/n7oTvU/logo_white.png" alt=""/>
                        <h3>Welcome</h3>
                        <p>COMP9444 ChatBot is waiting for you!</p>
                    </div>
                    <div className="col-md-9 register-right">
                        <ul className="nav nav-tabs nav-justified">
                            <li className="nav-item">
                                <a className="nav-link active">Login</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" onClick={this.registerEvent} >Register</a>
                            </li>
                        </ul>

                        {login()}
                    </div>
                </div>

            </div>

          


        );
    }

}





export default LoginPage;