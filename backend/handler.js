'use strict'

const sessionDao = require('./lib/sessionDao')
const gateway = require('./lib/gateway')

module.exports.connectHandler = async (event, context) => { 
    console.log('Websocket connect')
    console.log(JSON.stringify(event));

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
      await gateway.deleteConnection(oldConnectionId);
    }

    var sessionUsers = await sessionDao.querySessionUsers(sessionKey.sessionId);
    console.log('Users: ' + JSON.stringify(sessionUsers));

    return {
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

  await gateway.sendMessageToClient(event.requestContext.connectionId, 'Hello world');
  
  return {
    statusCode: 200,
  };
};

function isConnectionChanged(record) {

  const oldImage = record.dynamodb.OldImage;
  const newImage = record.dynamodb.NewImage;
  

  const oldConnectionId = oldImage.connectionId ? oldImage.connectionId.S : null;
  const newConnectionId = newImage.connectionId ? newImage.connectionId.S : null;

  return oldConnectionId != newConnectionId;
}
  
module.exports.handleStreamEvent = async (event, context) => {
  console.log('Handle stream event')
  console.log(JSON.stringify(event));

  for(const record of event.Records) {

    if(record.eventName == "MODIFY") {

      let recordInfo = record.dynamodb;
      let sessionId = recordInfo.Keys.sessionId.S;
      let userId = recordInfo.Keys.userId.S;

      if(isConnectionChanged(record)) {
        console.log(`Update for session: ${sessionId}, user: ${userId}`);

        let users = await sessionDao.querySessionUsers(sessionId);
        console.log('Users: ' + JSON.stringify(users));

        const userDtos = users
          .filter(u => u.userId != "chairman")
          .map((u) =>     
              ({
                  userId : u.userId,
                  name : u.name,
                  alias: u.alias,
                  online : u.connectionId ? true : false
              })
          )

          for(const user of users) {
            if(user.connectionId) {
              await gateway.sendMessageToClient(user.connectionId, {
                action: 'OnlineStatusUpdate',
                users: userDtos
              });
            }
          }
      }
    }
  }
}