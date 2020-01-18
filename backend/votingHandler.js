'use strict'

const AWS = require('aws-sdk');
const sessionDao = require('./lib/sessionDao')
const crypto = require('crypto')
const gateway = require('./lib/gateway')

const queueUrl = process.env.FINALIZER_QUEUE_URL;

module.exports.startVotingRound = async (event, context) => {
  console.log('Start voting round')
  console.log(JSON.stringify(event));

  const dto = JSON.parse(event.body);
  const sessionId = dto.sessionId;

  const votingId = crypto.randomBytes(8)
                    .toString('base64')
                    .toLowerCase()
                    .replace(/[=+/?&]/g, '')
                    .substring(0, 4);


  const possibleOptions = ['1', '2', '3', '5', '8', '13', '?'];
  await sessionDao.setVotingId(sessionId, 'chairman', votingId, true);
  
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

  let users = await sessionDao.querySessionUsers(sessionId);

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

  for(const user of users) {
    if(user.connectionId) {
      await gateway.sendMessageToClient(user.connectionId, {
        action: 'VoteFinished',
        votingId: votingId
      });
    }
  }
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