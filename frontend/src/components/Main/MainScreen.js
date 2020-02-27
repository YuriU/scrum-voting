import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Auth } from 'aws-amplify';

class MainScreen extends Component {

    constructor(props) {
      super(props);

      this.state = {
        authenticated: false,
        userName: null,
        password: null
      };

      this.handleChangeName = this.handleChangeName.bind(this);
      this.handleChangePassword = this.handleChangePassword.bind(this);
    }


    async componentDidMount() {
      try{
        const currentSession = await Auth.currentSession();
        console.log(currentSession);
        if(currentSession) {
          this.setState({
            authenticated: true
          })
        }
      }
      catch(err){
        console.log(err)
      }
    }

    async login(){
      console.log(this.state.userName);
      console.log(this.state.password);

      const loginResult = await Auth.signIn(this.state.userName, this.state.password);
      
      const currentSession = await Auth.currentSession();
        console.log(currentSession);
        if(currentSession) {
          this.setState({
            authenticated: true
          })
        }

      console.log(loginResult)
    }

    handleChangeName(event){
      this.setState({
        userName: event.target.value
      });
    }

    handleChangePassword(event){
      this.setState({
        password: event.target.value
      });
    }

    render() {
      if(this.state.authenticated) {
        return (<div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/startSession">Start Session</Link>
              </li>
              <li>
                <Link to="/session">Session</Link>
              </li>
            </ul>
          </nav>
        </div>)
      }
      else {
        return (<div>
            <div>
              <label>UserName: <input type="text" onChange={this.handleChangeName}></input></label>
            </div>
            <div>
              <label>Password: <input type="password" onChange={this.handleChangePassword}></input></label>
            </div>
            <button onClick={(evt) => this.login()}>Login</button>
          </div>)
      }
    }
}

export default MainScreen;