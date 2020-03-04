import React, { Component } from 'react';
import { Auth } from 'aws-amplify';

class Login extends Component {

    constructor(props) {
        super(props);
  
        this.state = {
          userName: null,
          password: null
        };
  
        this.login = this.login.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
    }

    async login() {
        const loginResult = await Auth.signIn(this.state.userName, this.state.password);
        await this.props.updateLoginState();
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

export default Login;