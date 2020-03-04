import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import Login from './Login';
import '../../styles/Main.css'

class MainScreen extends Component {

    constructor(props) {
      super(props);

      this.state = {
        authenticated: false,
        userName: null,
        password: null
      };

      this.updateLoginState = this.updateLoginState.bind(this);
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
        return (<div>Enjoy</div>)
      }
      else {
        return (<Login updateLoginState={this.updateLoginState} />)
      }
    }

    render() {
        return (<div className="navbar">
          <nav>
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