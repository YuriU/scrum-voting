import Config from '../config'

class WSClient {
    
    constructor(sessionId, userId, onMessage) {
        this.sessionId = sessionId;
        this.userId = userId;
        this.endpoint = Config.BackendWebSocketEndpoint;
        this.onMessage = onMessage;

        this.connect = this.connect.bind(this);
        this.disconnect = this.disconnect.bind(this);
    }

    connect() {

        this.webSocket = new WebSocket(this.endpoint + "?sessionid=" + this.sessionId +"&userid=" + this.userId);
        this.webSocket.onopen = function() {
            console.log('Connected');
          }

        this.webSocket.onclose = function(event) {
            if (event.wasClean) {
                console.log('Clean close');
            } else {
                console.log('connection issue')
            }
            console.log('Code: ' + event.code + ' Reason: ' + event.reason);
        };

        const self = this;
        this.webSocket.onmessage = function(event) {
            self.onMessage(event);
        }
    }

    disconnect() {
        this.webSocket.close();
    }
}

export default WSClient;