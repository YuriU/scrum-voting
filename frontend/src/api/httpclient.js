import Config from '../config'
import { Auth } from 'aws-amplify';


class HttpClient {

    constructor() {
        this.endpoint = Config.BackendHttpEndpoint;
    }

    async startSession(items) {
        let accessToken = await (await Auth.currentSession()).getIdToken().getJwtToken();
        return await this.post('/startSession', items, accessToken)
    }

    async getSession(sessionId) {
        return await this.post('/getSession', { sessionId: sessionId })
    }

    async startVoting(sessionId, completeWhenAllVoted) {
        let accessToken = await (await Auth.currentSession()).getIdToken().getJwtToken();
        return await this.post('/startVoting', { sessionId: sessionId, completeWhenAllVoted : completeWhenAllVoted }, accessToken)
    }

    async post(method, data, accessToken) {

        const url = this.endpoint + method;
        const headers = {
                'Content-Type': 'application/json;charset=utf-8'
        };

        if(accessToken) {
            headers['Authorization'] = accessToken;
        }

        let response = await fetch(url, {
            method: 'POST',
            headers: headers,    
            body: JSON.stringify(data)
        })

        const result = await response.json();
        return result;
    }
}

export default HttpClient;