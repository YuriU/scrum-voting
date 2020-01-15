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

  module.exports = {
    querySessionUsers: querySessionUsers
  }