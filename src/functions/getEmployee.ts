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

  if (employee) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        name: employee.name,
        age: employee.age,
        role: employee.role,
      }),
      headers: {
        "Content-type": "application/json",
      }
    }
  }

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