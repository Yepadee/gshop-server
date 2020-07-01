import "graphql-import-node";
import { GraphQLModule } from "@graphql-modules/core";
import * as typeDefs from "./schema.gql";
import resolvers from "./resolvers";

import { ProductProvider } from "./provider";
import { AuthModule } from "@modules/AuthModule";
import { CurrencyModule } from "@modules/CurrencyModule";

export const ProductModule = new GraphQLModule({
  imports: [AuthModule, CurrencyModule],
  typeDefs,
  resolvers,
  providers: [ProductProvider]
});