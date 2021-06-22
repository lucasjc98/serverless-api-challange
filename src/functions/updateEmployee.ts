import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";
import { ICreateEmployee } from "../dto/CreateEmployeeDTO";

export const handle: APIGatewayProxyHandler = async (event) => {
  const { name, age, role } = JSON.parse(event.body) as ICreateEmployee;

  const { id } = event.pathParameters;

  const timestamp = new Date(Date.now());

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

  if (name) {
    employee.name = name;
  }

  if (age) {
    employee.age = age;
  }

  if (role) {
    employee.role = role;
  }

  const employeeParams = {
    TableName: "employees",
    Key: {
      "id": id,
    },
    ExpressionAttributeNames: {
      "#role": "role",
      "#age": "age",
      "#name": "name",
    },
    ExpressionAttributeValues: {
      ":n": employee.name,
      ":a": employee.age,
      ":r": employee.role,
      ":upAt": timestamp,
    },
    UpdateExpression: "SET #age = :a, #name = :n, #role = :r, updatedAt = :upAt",
    ReturnValues: "ALL_NEW",
  };

  const result = await document.update(employeeParams).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(result.Attributes),
    headers: {
      "Content-type": "application/json",
    }
  }
}