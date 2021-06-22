import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";

export const handle: APIGatewayProxyHandler = async (event) => {
  const { id } = event.pathParameters;

  const response = await document.query({
    TableName: "employees",
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":id": id
    }
  }).promise();

  const employee = response.Items[0];

  if (!employee) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Employee not exists!"
      }),
      headers: {
        "Content-type": "application/json",
      }
    }
  }

  const employeeParams = {
    TableName: "employees",
    Key: {
      "id": id,
    },
  }

  await document.delete(employeeParams).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Employee successfully deleted!"
    }),
    headers: {
      "Content-type": "application/json",
    }
  }
}