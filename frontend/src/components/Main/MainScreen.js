import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
import Login from './Login';
import '../../styles/Main.css'
import CreateSession from '../EditSession/CreateSession'
import {
  Router as Router,
  Switch,
  Route,
  Link
} 
from "react-router-dom";

class MainScreen extends Component {

    constructor(props) {
      super(props);

      this.state = {
        authenticated: false,
        userName: null,
        password: null
      };

      this.updateLoginState = this.updateLoginState.bind(this);
      this.onCreateSession = this.onCreateSession.bind(this);
    }

    async componentDidMount() {
      await this.updateLoginState();
    }

    async logout() {
        await Auth.signOut();
        await this.updateLoginState();
    }

    async updateLoginState() {
      try {
        const currentSession = await Auth.currentSession();
        if(currentSession) {
          this.setState({
            authenticated: true
          })
        }
        else {
          this.setState({
            authenticated: false
          })
        }
      }
      catch(error) {
        this.setState({
          authenticated: false
        })
      }
    }

    renderContent() {
      if(this.state.authenticated) {
        return (<Router history={this.props.history}>
          <Switch>
            <Route path="/startSession">
              <CreateSession onCreateSession={this.onCreateSession}/>
            </Route>
          </Switch>
        </Router>)
      }
      else {
        return (<Login updateLoginState={this.updateLoginState} />)
      }
    }

    async onCreateSession(items) {
      const result = await this.props.httpClient.startSession(items);
      this.props.history.push('/session/' + result.SessionId)        
  }

    render() {
        return (<div>
          <nav className="navbar">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>  
              {
                this.state.authenticated && (<li>
                  <Link to="/startSession">Start Session</Link>
                </li>)
              }
              <li>
                <Link className="rightItem" to="/" onClick={(evt) => this.logout()}>Logout</Link>
              </li>
            </ul>
          </nav>
          {
            this.renderContent()
          }
        </div>)
    }
}

export default MainScreen;