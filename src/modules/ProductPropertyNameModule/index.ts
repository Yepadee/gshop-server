import "graphql-import-node";
import { GraphQLModule } from "@graphql-modules/core";
import * as typeDefs from "./schema.gql";
import resolvers from "./resolvers";

import { ProductProvider } from "../../providers/productPropertyName.provider";

export const ProductModule = new GraphQLModule({
  typeDefs,
  resolvers,
  providers: [ProductProvider]
});