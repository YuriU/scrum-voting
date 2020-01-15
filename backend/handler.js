'use strict'

const AWS = require('aws-sdk');
const crypto = require('crypto')
const sessionDao = require('./lib/sessionDao')

const apiGatewayUrl = process.env.WS_ENDPOINT_URL;

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

    let oldConnectionId = await sessionDao.setConnectionId(sessionKey.sessionId, sessionKey.userId, event.requestContext.connectionId);

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

    var sessionUsers = await sessionDao.querySessionUsers(sessionKey.sessionId);
    console.log('Users: ' + JSON.stringify(sessionUsers));

    return {
      body: 'hello!',
      statusCode: 200,
    };
  };

module.exports.disconnectHandler = async (event, context) => {
 
  console.log('Websocket disconnect')
  console.log(JSON.stringify(event));

  let user = await sessionDao.queryUserByConnectionId(event.requestContext.connectionId);
  if(user){
      console.log(JSON.stringify(user));
      await sessionDao.setConnectionId(user.sessionId, user.userId, null);
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

  
module.exports.handleStreamEvent = async (event, context) => {
  console.log('Handle stream event')
  console.log(JSON.stringify(event));

  for(const record of event.Records) {

    if(record.eventName == "MODIFY") {

      let recordInfo = record.dynamodb;
      let sessionId = recordInfo.Keys.sessionId.S;
      let userId = recordInfo.Keys.userId.S;

      console.log(`Update for session: ${sessionId}, user: ${userId}`);

      let users = await sessionDao.querySessionUsers(sessionId);
      console.log('Users: ' + JSON.stringify(users));

      const userDtos = users
        .filter(u => u.userId != "chairman")
        .map((u) =>     
             ({
                userId : u.userId,
                alias : u.alias,
                name : u.name,
                online : u.connectionId ? true : false
            })
        )

      for(const user of users){
        if(user.connectionId){
          await sendMessageToClient(apiGatewayUrl, user.connectionId, {
            action: 'OnlineStatusUpdate',
            users: userDtos
          })
        }
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