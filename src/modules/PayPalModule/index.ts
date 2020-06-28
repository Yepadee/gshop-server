import "graphql-import-node";
import { GraphQLModule } from "@graphql-modules/core";
import * as typeDefs from "./schema.gql";
import resolvers from "./resolvers";

import { PayPalProvider } from "./provider";
import { AuthModule } from "@modules/AuthModule";
import { OrderItemModule } from "@modules/OrderItemModule";
import { AddressModule } from "@modules/AddressModule";

export const PayPalModule = new GraphQLModule({
  imports: [AuthModule, OrderItemModule, AddressModule],
  typeDefs,
  resolvers,
  providers: [PayPalProvider],
});