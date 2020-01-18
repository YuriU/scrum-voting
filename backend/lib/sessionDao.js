'use strict'

const DDB = require('./dynamo')

async function querySessionUsers(sessionId) {
  var sessionAndUserIds = await DDB.SessionDB.query({
    KeyConditionExpression: 'sessionId = :sid',
    ExpressionAttributeValues: { ':sid': sessionId }
  }).promise();

  return sessionAndUserIds.Items;
}

async function queryUserByConnectionId(connectionId) {
  var sessionAndUserIds = await DDB.SessionDB.query({
    IndexName: 'gsiConnectionToKeys',
    KeyConditionExpression: 'connectionId = :con_id',
    ExpressionAttributeValues: { ':con_id': connectionId }
  }).promise();

  if(sessionAndUserIds.Items.length > 0){
    return sessionAndUserIds.Items[0];
  } 
  else{
    return null;
  }
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

  if(result.Attributes && result.Attributes.connectionId) {
    return result.Attributes.connectionId;
  } else {
    return null;
  }
}

async function setVotingId(sessionId,  userId, votingId, open) {
  var updateRequest = {
    Key: { sessionId : sessionId, userId: userId },
    ConditionExpression: 'attribute_exists(sessionId) AND attribute_exists(userId)',
    UpdateExpression: 'set #votingId = :votingId, #open = :open',
    ExpressionAttributeNames: {'#votingId' : 'votingId', '#open' : 'open' },
    ExpressionAttributeValues: { ':votingId' : votingId, ':open' : open }
  };

  var result = await DDB.SessionDB.update(updateRequest).promise();
}

async function setVotingResult(sessionId,  userId, votingId, result) {
  var updateRequest = {
    Key: { sessionId : sessionId, userId: userId },
    ConditionExpression: 'attribute_exists(sessionId) AND attribute_exists(userId)',
    UpdateExpression: 'set #votingId = :votingId, #result = :result',
    ExpressionAttributeNames: {'#votingId' : 'votingId', '#result' : 'result' },
    ExpressionAttributeValues: { ':votingId' : votingId, ':result' : result }
  };

  var result = await DDB.SessionDB.update(updateRequest).promise();
}

async function batchWriteUsers(users) {

  let requests = users.map(i => ({ PutRequest: { Item: i } }));
    let tableName = process.env.DDB_TABLE_SESSION;

    var params = {
      RequestItems : {
      }
    }

    params.RequestItems[tableName] = requests;

    await DDB.SessionDB.batchWrite(params).promise();
}

module.exports = {
  querySessionUsers: querySessionUsers,
  queryUserByConnectionId: queryUserByConnectionId,
  setConnectionId: setConnectionId,
  batchWriteUsers: batchWriteUsers,
  setVotingId: setVotingId,
  setVotingResult: setVotingResult
}