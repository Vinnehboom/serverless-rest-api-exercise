const AWS = require('aws-sdk')
const middy = require('@middy/core')
const httpJsonBodyParser = require('@middy/http-json-body-parser')

const updateTodo = async (event) => {
    const dynamodb = new AWS.DynamoDB.DocumentClient()

    const { completed } = event.body
    const { id } = event.pathParameters

    await dynamodb.update({
        TableName: "TodoTable",
        Key: { id },
        UpdateExpression: 'set completed = :completed',
        ExpressionAttributeValues: { ':completed': completed },
        ReturnValues: "ALL_NEW"
    }
        ).promise()

    const todo = await dynamodb.get({
        TableName: "TodoTable",
        Key: { id }
    }).promise().Item

    return {
        statusCode: 200,
        body: JSON.stringify({
            msg: 'Todo Updated',
            todo: { todo }
        })
    };
};

module.exports = {
    handler: middy(updateTodo).use(httpJsonBodyParser())
}
