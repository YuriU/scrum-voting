'use strict'

const AWS = require('aws-sdk')

const apiGatewayUrl = process.env.WS_ENDPOINT_URL;

const apigatewaymanagementapi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: apiGatewayUrl,
});

async function sendMessageToClient(connectionId, payload) {

    try {
        let response = await apigatewaymanagementapi
        .postToConnection({
          ConnectionId: connectionId, // connectionId of the receiving ws-client
          Data: JSON.stringify(payload),
        })
        .promise();
        
        return response
    }
    catch(error) {
        console.error(`Error during sending message to connection: ${connectionId}`, error)
        throw error;
    }
}

async function deleteConnection(connectionId) {
    try {
        await apigatewaymanagementapi.deleteConnection({
            ConnectionId : connectionId
          }).promise();
    }
    catch(error) {
        console.error(`Error during old connection closing: Id ${connectionId}`, error);
    }
}

module.exports = {
    sendMessageToClient: sendMessageToClient,
    deleteConnection: deleteConnection
  }