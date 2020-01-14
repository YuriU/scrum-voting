'use strict'

const AWS = require('aws-sdk');
const DDB = require('./lib/dynamo')
const crypto = require('crypto')

const apiGatewayUrl = process.env.WS_ENDPOINT_URL;

async function querySessionUsers(sessionId) {
  var sessionAndUserIds = await DDB.SessionDB.query({
    KeyConditionExpression: 'sessionId = :sid',
    ExpressionAttributeValues: { ':sid': sessionId }
  }).promise();

  return sessionAndUserIds.Items;
}

async function setConnectionId(sessionId,  userId, connectionId) {

  var updateRequest = {
    Key: { sessionId : sessionId, userId: userId },
    ConditionExpression: 'attribute_exists(sessionId) AND attribute_exists(userId)',
    ExpressionAttributeNames: {'#cid' : 'connectionId'},
    ReturnValues: 'UPDATED_OLD'
  };

  if(connectionId){
    updateRequest.UpdateExpression = 'set #cid = :cid';
    updateRequest.ExpressionAttributeValues = {
      ':cid' : connectionId
    }
  } 
  else {
    updateRequest.UpdateExpression = 'remove #cid';
  }

  var result = await DDB.SessionDB.update(updateRequest).promise();

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

    var sessionUsers = await querySessionUsers(sessionKey.sessionId);
    console.log('Users: ' + JSON.stringify(sessionUsers));

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

    console.log('Start session action')
    console.log(JSON.stringify(event));

    let sessionId = crypto.randomBytes(8)
                      .toString('base64')
                      .toLowerCase()
                      .replace(/[=+/?&]/g, '')
                      .substring(0, 4);

    var usesToAdd = JSON.parse(event.body);

    usesToAdd.forEach(user => {
      user.sessionId = sessionId;
    });

    usesToAdd.push({sessionId: sessionId, userId: 'chairman'})

    console.log(usesToAdd);
        
    let requests = usesToAdd.map(i => ({ PutRequest: { Item: i } }));
    let tableName = process.env.DDB_TABLE_SESSION;

    var params = {
      RequestItems : {
      }
    }

    params.RequestItems[tableName] = requests;

    console.log(JSON.stringify(params));

    await DDB.SessionDB.batchWrite(params).promise();

    let result = {
      SessionId: sessionId
    }

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(result)
    }
  };

  module.exports.handleStreamEvent = async (event, context) => {
    console.log('Handle stream event')
    console.log(JSON.stringify(event));

    for(const record of event.Records) {

      let recordInfo = record.dynamodb;
      let sessionId = recordInfo.Keys.sessionId.S;
      let userId = recordInfo.Keys.userId.S;

      console.log(`Update for session: ${sessionId}, user: ${userId}`);

      let users = await querySessionUsers(sessionId);
      console.log('Users: ' + JSON.stringify(users));

      for(const user of users){
        if(user.connectionId){
          await sendMessageToClient(apiGatewayUrl, user.connectionId, JSON.stringify(users))
        }
      }
    }
  }

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