import React, { Component } from 'react';
import Register from './components/Register'
import MainComponent from './components/MainComponent'
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './components/LoginPage'
import { Switch, Route, Redirect } from 'react-router-dom';

class App extends Component {



  
    render() {

      return (
            <BrowserRouter>
            <div>
                <Switch>
                <Route exact path='/' component={() => <LoginPage  />} />
                <Route exact path='/main' component={() => <MainComponent />} />
                <Route exact path='/register' component={Register} />
                </Switch>
            </div>
            </BrowserRouter>


      )
    }
}

export default App;
