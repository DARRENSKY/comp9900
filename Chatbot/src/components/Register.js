import React from 'react';
import { Breadcrumb, BreadcrumbItem,
    Button, Form, FormGroup, Label, Input, Col, FormFeedback } from 'reactstrap';

require('../styles/LoginPage.css');


class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            Zid: '',
            Password: '',
            Confirm_Password: '',
            touched: {
                Zid: false,
                Password: false,
                Confirm_Password: false,
            }
        };
        this.registerEvent = this.registerEvent.bind(this);
        this.loginEvent = this.loginEvent.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.submitEvent = this.submitEvent.bind(this);

    }

    submitEvent = (Zid, Password, Confirm_Password, errors) => (evt) => {

        if (Zid == '' || Password == '' || Confirm_Password == ''){
            if (Zid == ''){
                alert("Zid can not be empty");
            }
            else if (Password == ''){
                alert("Password can not be empty");
            }
            else if (Confirm_Password == ''){
                alert("Confirm Password can not be empty");
            }

        }
        else if(errors.Zid != '' || errors.Password != '' || errors.Confirm_Password!= '')
            alert("Invalid Input")
        else{

            // backend function here !
            var that = this;
            const message = JSON.stringify({'zid': Zid, 'password':Password, 'confirm':Confirm_Password, 'type':'register'});

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
              if (detail == 'sucess'){
                alert(`Your account has been created, you Zid is ${Zid}.`)
                window.location = '/'
                return 
              }
              else {
                alert('You already have an account, you can simply login')
                window.location = '/'
                return
              }
              
            })
            .catch(error =>  { alert('something went wrong with the server')
            })
            }



            console.log('wait for the back end')
        
    }

    registerEvent() {
        window.location = '/register';
    }

    loginEvent() {
        window.location = '/';
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

    validate(Zid, Password, Confirm_Password) {
        const errors = {
            Zid: '',
            Password: '',
            Confirm_Password: '',
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
        if (this.state.touched.Confirm_Password && Confirm_Password != Password){
            errors.Confirm_Password = 'Comfirm Password and Password should be the Same!';
        }


        return errors;
    }
    render() {
        const errors = this.validate(this.state.Zid, this.state.Password, this.state.Confirm_Password);


        const  register = () =>{

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

                    <Form>             
                        <FormGroup className = "Form-Input" row>
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

                    <Form>             
                        <FormGroup className = "Form-Input" row>
                            <Col md={10}>
                                <Input type="text"
                                    placeholder="Confirm Password*"
                                    value={this.state.Confirm_Password}
                                    name = "Confirm_Password"
                                    valid={errors.Confirm_Password === ''}
                                    invalid={errors.Confirm_Password !== ''}
                                    onChange={this.handleInputChange}
                                    onBlur={this.handleBlur('Confirm_Password')}
                                    
                                    />
                                    <FormFeedback>{errors.Confirm_Password}</FormFeedback>
                            </Col>
                        </FormGroup>
                    </Form>

                    <FormGroup style = {{ "text-align":"center", "padding-right":"15%", "padding-top": "15px" }} row>
                            <Col >
                                <button onClick = {this.submitEvent(this.state.Zid, this.state.Password, this.state.Confirm_Password, errors)} class="btnRegister">
                                    Register
                                </button>
                            </Col>
                        </FormGroup>
                </div>
            )

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
                                <a className="nav-link"  onClick={this.loginEvent}>Login</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link active"  onClick={this.registerEvent} >Register</a>
                            </li>
                        </ul>

                        {register()}
                    </div>
                </div>

            </div>

          
        );
    }

}





export default Register;