import { document } from "../utils/dynamodbClient";
import { v4 as uuid } from "uuid";
import { APIGatewayProxyHandler } from "aws-lambda";
import { ICreateEmployee } from "../dto/CreateEmployeeDTO";

export const handle: APIGatewayProxyHandler = async (event) => {
  const { age, name, role } = JSON.parse(event.body) as ICreateEmployee;

  const id = uuid();

  const timestamp = new Date(Date.now());

  const employee = {
    TableName: "employees",
    Item: {
      id,
      age,
      name,
      role,
      createdAt: timestamp,
      updatedAt: timestamp,
    }
  }

  await document.put(employee).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(employee.Item),
    headers: {
      "Content-type": "application/json",
    }
  }
}