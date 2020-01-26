'use strict'

const AWS = require('aws-sdk');
const sessionDao = require('./lib/sessionDao')
const gateway = require('./lib/gateway')
const randomUtil = require('./lib/randomUtil')

const queueUrl = process.env.FINALIZER_QUEUE_URL;

module.exports.startVotingRound = async (event, context) => {
  console.log('Start voting round')
  console.log(JSON.stringify(event));

  const dto = JSON.parse(event.body);
  const sessionId = dto.sessionId;
  
  // Do not wait for the timeout if all online users voted
  const completeWhenAllVoted = dto.completeWhenAllVoted && dto.completeWhenAllVoted == true ? true : false;
  const possibleOptions = dto.possibleOptions ? dto.possibleOptions : ['1', '2', '3', '5', '8', '13', '?'];

  let users = await sessionDao.querySessionUsers(sessionId);
  const chairman = users.filter(user => user.userId == 'chairman')[0];

  if(chairman.votingId && chairman.open) {
    return {
      statusCode: 422,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ Reason:'Another voting is still active' })
    }
  }
  
  const votingId = randomUtil.generateId();
  const onlineUsersIds = users.filter(user => user.connectionId && user.userId != 'chairman').map(u => u.userId);
  console.log('Online user ids: ' + JSON.stringify(onlineUsersIds))

  await sessionDao.setVoting(sessionId, 'chairman', votingId, true, completeWhenAllVoted, onlineUsersIds);
  
  const sqs = new AWS.SQS( {
    apiVersion: '2012-11-05'
  });

  await sqs.sendMessage({
    QueueUrl : queueUrl,
    MessageBody: JSON.stringify({
      sessionId: sessionId,
      votingId: votingId,
      possibleOptions: possibleOptions
    })
  }).promise();

  for(const user of users) {
    if(user.connectionId) {
      await gateway.sendMessageToClient(user.connectionId, {
        action: 'VoteStarted',
        votingId: votingId,
        possibleOptions: possibleOptions
      });
    }
  }

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({})
  }
}

module.exports.handleVoteFinalization = async (event, context) => {
  console.log('Handle vote finalization event')
  console.log(JSON.stringify(event));

  const message = JSON.parse(event.Records[0].body);

  const sessionId = message.sessionId;
  const votingId = message.votingId;

  let users = await sessionDao.querySessionUsers(sessionId);
  const chairman = users.filter(user => user.userId == 'chairman')[0];
  if(chairman.votingId == votingId && chairman.open) {

    let userResults = users
    .filter(u => u.userId != 'chairman')
    .map(u => {
      let result = u.votingId == votingId ? u.result : '<NA>';
      return {
        userId: u.userId,
        result: result
      }
    })

    for(const user of users) {
      if(user.connectionId) {
        await gateway.sendMessageToClient(user.connectionId, {
          action: 'VoteFinished',
          votingId: votingId,
          userResults: user.userId == 'chairman' ? userResults : null
        });
      }
    }
  }

  await sessionDao.setVoting(sessionId, 'chairman', votingId, false, false, []);
}

module.exports.voteHandler = async (event, context) => {
  console.log('Websocket voteHandler action')
  console.log(JSON.stringify(event));

  const message = JSON.parse(event.body)

  const details = message.details;

  const sessionId = details.sessionId;
  const userId = details.userId;
  const votingId = details.votingId;
  const votingResult = details.votingResult;
  

  const users = await sessionDao.querySessionUsers(sessionId);

  const chairman = users.filter(user => user.userId == 'chairman')[0];
  if(chairman.votingId == votingId && chairman.open) {

    await sessionDao.setVotingResult(sessionId, userId, votingId, votingResult)

    // TODO: Result of active voting
    await gateway.sendMessageToClient(chairman.connectionId, {
      action: 'userVoted',
      details: {
        userId: userId,
        votingId: votingId
      }
    });
  }

  return {
    statusCode: 200,
  };
};