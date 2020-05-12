import "graphql-import-node";
import { GraphQLModule } from "@graphql-modules/core";
import * as typeDefs from "./schema.gql";
import resolvers from "./resolvers";

import { ProductPropertyProvider } from "./provider";

export const ProductPropertyModule = new GraphQLModule({
  typeDefs,
  resolvers,
  providers: [ProductPropertyProvider]
});