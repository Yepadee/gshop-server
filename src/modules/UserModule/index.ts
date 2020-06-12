import "graphql-import-node";
import { GraphQLModule } from "@graphql-modules/core";
import * as typeDefs from "./schema.gql";
import resolvers from "./resolvers";

import { UserProvider } from "./provider";
import { AuthModule } from "@modules/AuthModule";

export interface IMyModuleContext {
  myField: string;
}

export const UserModule = new GraphQLModule({
  imports: [AuthModule],
  typeDefs,
  resolvers,
  providers: [UserProvider]
});