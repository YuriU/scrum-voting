import Config from '../config'

class HttpClient {

    constructor() {
        this.endpoint = Config.BackendHttpEndpoint;
    }

    async startSession(items) {
        return await this.post('/startSession', items)
    }

    async getSession(sessionId) {
        return await this.post('/getSession', { sessionId: sessionId })
    }

    async startVoting(sessionId, completeWhenAllVoted) {
        return await this.post('/startVoting', { sessionId: sessionId, completeWhenAllVoted : completeWhenAllVoted })
    }

    async post(method, data) {
        const url = this.endpoint + method;

        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
              },
            body: JSON.stringify(data)
        })

        const result = await response.json();
        return result;
    }
}

export default HttpClient;