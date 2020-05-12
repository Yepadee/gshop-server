import "graphql-import-node";
import { GraphQLModule } from "@graphql-modules/core";
import * as typeDefs from "./schema.gql";
import resolvers from "./resolvers";

import { ProductTypeProvider } from "./productType.provider";

export const ProductTypeModule = new GraphQLModule({
  typeDefs,
  resolvers,
  providers: [ProductTypeProvider]
});