import "graphql-import-node";
import { GraphQLModule } from "@graphql-modules/core";
import * as typeDefs from "./schema.gql";
import resolvers from "./resolvers";

import { StockProvider } from "./stock.provider";

export const StockModule = new GraphQLModule({
  typeDefs,
  resolvers,
  providers: [StockProvider]
});