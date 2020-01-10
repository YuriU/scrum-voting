'use strict'

const AWS = require('aws-sdk');
const DDB = require('./lib/dynamo')

const tableName = process.env.DDB_TABLE_SESSION;

module.exports.connectHandler = async (event, context) => {
 
    console.log('Websocket connect')
    console.log(JSON.stringify(event));

    console.log('Endpoint :' + event.requestContext.domainName + "/" + event.requestContext.stage);
    console.log('ConnectionId :' + event.requestContext.connectionId);

    let sessionKey = {
      sessionId: 'hello',
      userId: '123'
    };

    var headers = event.multiValueHeaders['Sec-WebSocket-Protocol'];
    if(headers && headers.length > 0){
      let parts = headers[0].split(',');
      sessionKey.sessionId = parts[0].trim();
      sessionKey.userId = parts[1].trim();
    }

    console.log('Endpoing: ' + JSON.stringify(sessionKey));

    var result = await DDB.SessionDB.put({
        Item: {
          sessionId: sessionKey.sessionId, userId: sessionKey.userId, connectionId: event.requestContext.connectionId
        },
        ConditionExpression: 'attribute_exists(sessionId) AND attribute_exists(userId)'
      }).promise();


    console.log('PutResult: ' + JSON.stringify(result));

    return {
      body: 'hello!',
      statusCode: 200,
    };
  };

module.exports.disconnectHandler = async (event, context) => {
 
    console.log('Websocket disconnect')
    console.log(JSON.stringify(event));

    var sessionAndUserIds = await DDB.SessionDB.query({
      IndexName: 'gsiConnectionToKeys',
      KeyConditionExpression: 'connectionId = :con_id',
      ExpressionAttributeValues: { ':con_id': event.requestContext.connectionId }
    }).promise();

    if(sessionAndUserIds.Items.length > 0){

        var item = sessionAndUserIds.Items[0];
        console.log(JSON.stringify(item));

        var result = await DDB.SessionDB.put({
          Item: {
            sessionId: item.sessionId, userId: item.userId //, connectionId: null
          },
          ConditionExpression: 'attribute_exists(sessionId) AND attribute_exists(userId)'
        }).promise();
    }

    return {
      statusCode: 200,
    };
  };


module.exports.defaultHandler = async (event, context) => {
 
    console.log('Websocket default action')
    console.log(JSON.stringify(event));

    const apigatewaymanagementapi = new AWS.ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: event.requestContext.domainName + "/" + event.requestContext.stage,
    });

    await apigatewaymanagementapi.postToConnection({
      ConnectionId: event.requestContext.connectionId, // connectionId of the receiving ws-client,
      Data: 'Hello world'
    }).promise();

    return {
      statusCode: 200,
    };
  };

  const sendMessageToClient = (url, connectionId, payload) =>
  new Promise((resolve, reject) => {
    const apigatewaymanagementapi = new AWS.ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: url,
    });
    apigatewaymanagementapi.postToConnection(
      {
        ConnectionId: connectionId, // connectionId of the receiving ws-client
        Data: JSON.stringify(payload),
      },
      (err, data) => {
        if (err) {
          console.log('err is', err);
          reject(err);
        }
        resolve(data);
      }
    );
  });