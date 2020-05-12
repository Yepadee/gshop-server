import "graphql-import-node";
import { GraphQLModule } from "@graphql-modules/core";
import * as typeDefs from "./schema.gql";
import resolvers from "./resolvers";

import { ProductPropertyNameProvider } from "./provider";

export const ProductPropertyNameModule = new GraphQLModule({
  typeDefs,
  resolvers,
  providers: [ProductPropertyNameProvider]
});