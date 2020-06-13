import { GraphQLClient } from "graphql-request";
import * as jwt from "jsonwebtoken";

const token = jwt.sign({ username: "Admin" }, process.env.JWT_SECRET, { expiresIn: '1d' });
export const graphQLClientAuth = new GraphQLClient(`http://localhost:3000/graphql`, {
  headers: {
    authorization: token,
  },
});

export const graphQLClient = new GraphQLClient(`http://localhost:3000/graphql`);