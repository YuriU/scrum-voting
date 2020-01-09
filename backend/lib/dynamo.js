 
'use strict'

const AWS = require('aws-sdk')
AWS.config.setPromisesDependency(Promise)

const sessions = new AWS.DynamoDB.DocumentClient({
  params: {TableName: process.env.DDB_TABLE_SESSION}
})

module.exports = {
  SessionDB: sessions
}