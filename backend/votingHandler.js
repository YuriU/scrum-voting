'use strict'

const AWS = require('aws-sdk');
const sessionDao = require('./lib/sessionDao')
const crypto = require('crypto')
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

  await sessionDao.setVotingId(sessionId, 'chairman', votingId, true);
  
  const sQs = new AWS.SQS();

  await sQs.sendMessage({
    QueueUrl : queueUrl,
    MessageBody: 'Hello world'
  }).promise();

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({})
  }
}

module.exports.handleVoteFinalization = async (event, context) => {
  console.log('Handle vote finalization event')
  console.log(JSON.stringify(event));
}