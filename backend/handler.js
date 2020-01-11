'use strict'

const AWS = require('aws-sdk');
const DDB = require('./lib/dynamo')

const tableName = process.env.DDB_TABLE_SESSION;

async function setConnectionId(sessionId,  userId, connectionId) {

  var result = await DDB.SessionDB.update({
    Key: { sessionId : sessionId, userId: userId },
    UpdateExpression: 'set #cid = :cid',
    ConditionExpression: 'attribute_exists(sessionId) AND attribute_exists(userId)',
    ExpressionAttributeNames: {'#cid' : 'connectionId'},
    ExpressionAttributeValues: {
      ':cid' : connectionId
    },
    ReturnValues: 'UPDATED_OLD'
  }).promise();

  if(result.Attributes && result.Attributes.connectionId){
    return result.Attributes.connectionId;
  } else {
    return null;
  }
}

module.exports.connectHandler = async (event, context) => {
 
    console.log('Websocket connect')
    console.log(JSON.stringify(event));

    console.log('Endpoint :' + event.requestContext.domainName + "/" + event.requestContext.stage);
    console.log('ConnectionId :' + event.requestContext.connectionId);

    let sessionKey = {
      sessionId: 'hello',
      userId: '123'
    };

    var parameters = event.queryStringParameters;
    if(parameters) {
      sessionKey.sessionId = parameters.sessionid;
      sessionKey.userId = parameters.userid;
    }

    console.log('Key: ' + JSON.stringify(sessionKey));

    let oldConnectionId = await setConnectionId(sessionKey.sessionId, sessionKey.userId, event.requestContext.connectionId);

    if(oldConnectionId) {

      try{
        const apigatewaymanagementapi = new AWS.ApiGatewayManagementApi({
          apiVersion: '2018-11-29',
          endpoint: event.requestContext.domainName + "/" + event.requestContext.stage,
        });
  
        await apigatewaymanagementapi.deleteConnection({
          ConnectionId : oldConnectionId
        }).promise();
      }
      catch(err){
        console.error(`Error during old connection closing: Id ${oldConnectionId}`, err);
      }
    }

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
        await setConnectionId(item.sessionId, item.userId, null);
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


  module.exports.startSessionHandler = async (event, context) => {

    let sessionId = 'helloworld';
    let users = 5;

    let requests = [];

    let i = 0;
    for(i = 0; i< users; i++){
      requests.push({
        PutRequest: {
          Item: {
            sessionId: sessionId,
            userId: `${i}`,
            Name: `User: ${i}`
          }
        }
      })
    }

    let tableName = process.env.DDB_TABLE_SESSION;

    var params = {
      RequestItems : {
      }
    }

    params.RequestItems[tableName] = requests;

    console.log(JSON.stringify(params));

    let result = await DDB.SessionDB.batchWrite(params).promise();
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