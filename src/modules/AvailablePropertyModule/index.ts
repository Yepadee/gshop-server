import "graphql-import-node";
import { GraphQLModule } from "@graphql-modules/core";
import * as typeDefs from "./schema.gql";
import resolvers from "./resolvers";

import { AvailablePropertyProvider } from "./provider";

export const AvailablePropertyModule = new GraphQLModule({
  typeDefs,
  resolvers,
  providers: [AvailablePropertyProvider]
});