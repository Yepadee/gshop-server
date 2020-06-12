import "reflect-metadata";
import * as express from "express";
import * as dotenv from "dotenv";
import { ApolloServer, SchemaDirectiveVisitor } from "apollo-server-express";
import { createConnection } from "typeorm";
import { GraphQLModules } from "@modules";

import { setup } from "./setup";

export const startServer = async () => {
  const result = dotenv.config();
  if (result.error) throw result.error;

  let ormconfig;

  if (process.env.NODE_ENV === "development") ormconfig = require("../ormconfig-dev.json");
  else if (process.env.NODE_ENV === "test") ormconfig = require("../ormconfig-test.json");
  else ormconfig = require("../ormconfig-prod.json");

  await createConnection(ormconfig).then(async connection => {
    connection.synchronize(true).then( async () => {
      if (process.env.NODE_ENV === "development") setup(connection);
    });
  }).catch(error => console.log(error));

  const server = new ApolloServer({
    schema: GraphQLModules.schema,
    resolvers: GraphQLModules.resolvers,
    context: GraphQLModules.context,
    schemaDirectives: GraphQLModules.schemaDirectives,
    uploads: {
      maxFileSize: 10000000, // 10 MB
      maxFiles: 20
    }
  });

  SchemaDirectiveVisitor.visitSchemaDirectives(GraphQLModules.schema, GraphQLModules.schemaDirectives);

  const app = express();
  app.use(express.static("public"));
  server.applyMiddleware({ app });

  const runningApp = app.listen({port: 3000}, () => {
    if (process.env.NODE_ENV != "test") {
      console.log(`🚀 Server ready at http://localhost:3000${server.graphqlPath}`);
    }
  });

  return runningApp;
}