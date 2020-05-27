import "graphql-import-node";
import { GraphQLModule } from "@graphql-modules/core";
import * as typeDefs from "./schema.gql";
import resolvers from "./resolvers";

import { PayPalProvider } from "./provider";
import { AuthModule } from "modules/AuthModule";

export const PayPalModule = new GraphQLModule({
  imports: [AuthModule],
  typeDefs,
  resolvers,
  providers: [PayPalProvider],
});