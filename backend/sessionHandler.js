'use strict'

const AWS = require('aws-sdk');
const DDB = require('./lib/dynamo')
const crypto = require('crypto')
const sessionDao = require('./lib/sessionDao')

module.exports.startSession = async (event, context) => {

    console.log('Start session action')
    console.log(JSON.stringify(event));

    const sessionId = crypto.randomBytes(8)
                      .toString('base64')
                      .toLowerCase()
                      .replace(/[=+/?&]/g, '')
                      .substring(0, 4);

    const usesToAdd = JSON.parse(event.body);
    usesToAdd.forEach(user => { user.sessionId = sessionId; });
    usesToAdd.push({sessionId: sessionId, userId: 'chairman'})
          
    await sessionDao.batchWriteUsers(usesToAdd);
    
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        SessionId: sessionId
      })
    }
  };


  module.exports.getSession = async (event, context) => {

    console.log('Get session action')
    console.log(JSON.stringify(event));

    const dto = JSON.parse(event.body);
    const sessionId = dto.sessionId;

    const users = await sessionDao.querySessionUsers(sessionId);
    console.log(JSON.stringify(users));
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

    return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(userDtos)
      }
  }