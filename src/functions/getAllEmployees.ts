import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";

export const handle: APIGatewayProxyHandler = async () => {
  const response = await document.scan({
    TableName: "employees",
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(response.Items),
    headers: {
      "Content-type": "application/json",
    }
  }
}