import "graphql-import-node";
import { GraphQLModule } from "@graphql-modules/core";
import * as typeDefs from "./schema.gql";
import resolvers from "./resolvers";

import { PropertyValueProvider } from "./provider";

export const PropertyValueModule = new GraphQLModule({
  typeDefs,
  resolvers,
  providers: [PropertyValueProvider]
});