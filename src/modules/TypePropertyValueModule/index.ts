import "graphql-import-node";
import { GraphQLModule } from "@graphql-modules/core";
import * as typeDefs from "./schema.gql";
import resolvers from "./resolvers";

import { TypePropertyValueProvider } from "./provider";

export const TypePropertyValueModule = new GraphQLModule({
  typeDefs,
  resolvers,
  providers: [TypePropertyValueProvider]
});