import "graphql-import-node";
import { GraphQLModule } from "@graphql-modules/core";
import * as typeDefs from "./schema.gql";
import resolvers from "./resolvers";

import { ProductPropertyValueProvider } from "./provider";

export const ProductPropertyValueModule = new GraphQLModule({
  typeDefs,
  resolvers,
  providers: [ProductPropertyValueProvider]
});