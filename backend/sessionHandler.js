'use strict'

const sessionDao = require('./lib/sessionDao')
const randomUtil = require('./lib/randomUtil')

module.exports.startSession = async (event, context) => {

  console.log('Start session action')
  console.log(JSON.stringify(event));

  const sessionId = randomUtil.generateId();
  const usesToAdd = JSON.parse(event.body);
  const secondsSinceEpoch = Math.round(Date.now() / 1000);
  const ttl = secondsSinceEpoch + 60 * 60 * 24;
  usesToAdd.forEach(user => { 
      user.sessionId = sessionId; 
      user.userId = randomUtil.generateId();
      user.TTL = ttl;
    });
  usesToAdd.push({sessionId: sessionId, userId: 'chairman', TTL: ttl})
        
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