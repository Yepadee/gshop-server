import { startServer } from "../../../src/start";
import { graphQLClientAuth } from "../../client";

let app;

beforeAll(async () => {
  app = await startServer();
})

afterAll(() => {
  app.close();
});

const addUser = `
mutation
{
  addUser(username: "test", password: "test")
}
`;

const getUser = `
query
{
  user(id:1)
  {
    username
  }
}
`;

test("Register User", async () => {
  let response = await graphQLClientAuth.request(addUser);
  expect(response).toEqual({ addUser: true });
  response = await graphQLClientAuth.request(getUser);
  expect(response).toEqual({
    user: {
      username: "test"
    }
  });
});