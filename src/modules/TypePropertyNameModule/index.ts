import "graphql-import-node";
import { GraphQLModule } from "@graphql-modules/core";
import * as typeDefs from "./schema.gql";
import resolvers from "./resolvers";

import { TypePropertyNameProvider } from "./provider";

export const TypePropertyNameModule = new GraphQLModule({
  typeDefs,
  resolvers,
  providers: [TypePropertyNameProvider]
});