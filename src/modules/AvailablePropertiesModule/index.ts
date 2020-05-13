import "graphql-import-node";
import { GraphQLModule } from "@graphql-modules/core";
import * as typeDefs from "./schema.gql";
import resolvers from "./resolvers";

import { AvailablePropertiesProvider } from "./provider";

export const AvailablePropertiesModule = new GraphQLModule({
  typeDefs,
  resolvers,
  providers: [AvailablePropertiesProvider]
});