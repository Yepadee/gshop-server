import "graphql-import-node";
import { GraphQLModule } from "@graphql-modules/core";
import * as typeDefs from "./schema.gql";
import resolvers from "./resolvers";

import { PayPalProvider } from "./provider";

export const PayPalModule = new GraphQLModule({
  typeDefs,
  resolvers,
  providers: [PayPalProvider],
});