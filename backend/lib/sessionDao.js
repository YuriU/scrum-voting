'use strict'
const AWS = require('aws-sdk');
const DDB = require('./dynamo')

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

module.exports = {
  querySessionUsers: querySessionUsers,
  setConnectionId: setConnectionId
}