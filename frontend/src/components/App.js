import React, { Component } from "react";
import SessionScreen from './Session/SessionScreen'
import VotingScreen from './Voting/VotingScreen'
import MainScreen from './Main/MainScreen'
import '../styles/App.css';
import { getAllUrlParams } from '../utils/urlutils'
import { createBrowserHistory } from "history";
import HttpClient from '../api/httpclient'
import {
    Router as Router,
    Switch,
    Route,
    Link
  } 
from "react-router-dom";
import Amplify, { Auth } from 'aws-amplify';
import Config from '../config'


class App extends Component {

    constructor(props) {
        super(props)
        this.urlParams = getAllUrlParams();

        this.httpClient = new HttpClient();
        this.getSessionUsers = this.getSessionUsers.bind(this);
        this.history = createBrowserHistory();

        Amplify.configure({
          Auth: {
            region : Config.Region,
            userPoolId: Config.UserPoolId,
            userPoolWebClientId: Config.UserPoolClientId
          }
        });
    }

    async getSessionUsers(sessionId) {
      const result = await this.httpClient.getSession(sessionId);
      return result;
    }

    render() {
        return (
            <Router history={this.history}>
              <Switch>
                <Route path="/session/:sessionId" render={
                  ({match}) => (
                    <SessionScreen getSessionUsers={this.getSessionUsers} httpClient={this.httpClient} sessionId={match.params.sessionId} />
                  )
                }>
                </Route>
                <Route path="/vote/:sessionId/:userId" render={
                  ({match}) => (
                    <VotingScreen sessionId={match.params.sessionId} userId={match.params.userId} />
                  )
                }>  
                </Route>
                <Route path="/">
                  <MainScreen history={this.history} httpClient={this.httpClient} />
                </Route>
              </Switch>
            </Router>
        );
    }   
}

export default App;