'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const params = {
  TableName: process.env.DYNAMODB_TABLE_COMMENT,
};

module.exports.get = (event, context, callback) => {
  // fetch all comments from the database
  dynamoDb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the comments.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin' : '*' },
      body: JSON.stringify(result.Items.filter(item => item.issueId === event.pathParameters.id)),
    };
    callback(null, response);
  });
};