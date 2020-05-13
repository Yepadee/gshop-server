import "graphql-import-node";
import { GraphQLModule } from "@graphql-modules/core";
import * as typeDefs from "./schema.gql";
import resolvers from "./resolvers";

import { PropertyNameProvider } from "./provider";

export const PropertyNameModule = new GraphQLModule({
  typeDefs,
  resolvers,
  providers: [PropertyNameProvider]
});