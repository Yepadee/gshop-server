import { startServer } from "../../../src/start";
import { GraphQLClient } from "graphql-request";

import * as jwt from "jsonwebtoken";
let graphQLClient;


beforeAll(async () => {
    const app = await startServer();
    //@ts-ignore
    const { port } = app.address();

    const token = jwt.sign({ username: "Admin" }, process.env.JWT_SECRET, { expiresIn: '1d' });

    graphQLClient = new GraphQLClient(`http://localhost:${port}/graphql`, {
        headers: {
          authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkFkbWluIiwiaWF0IjoxNTkxOTkxMjU0LCJleHAiOjE1OTIwNzc2NTR9.47uBtjUYFDUFF3a70h1Q93kwt09pBu1WculaTpoStkA",
        },
      });
})

const mutation = `
mutation
{
  addUser(username: "test", password: "test")
}
`;

test("Register User", async () => {
    const response = await graphQLClient.request(mutation);
    expect(response).toEqual({ addUser: true });
});