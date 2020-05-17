import "graphql-import-node";
import { GraphQLModule } from "@graphql-modules/core";
import * as typeDefs from "./schema.gql";
import resolvers from "./resolvers";

import { UserProvider } from "./provider";

export interface IMyModuleContext {
  myField: string;
}

export const UserModule = new GraphQLModule({
  typeDefs,
  resolvers,
  providers: [UserProvider]
});