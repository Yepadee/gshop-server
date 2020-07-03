import "graphql-import-node";
import { GraphQLModule } from "@graphql-modules/core";
import * as typeDefs from "./schema.gql";
import resolvers from "./resolvers";

import { PayPalProvider } from "./provider";
import { AuthModule } from "@modules/AuthModule";
import { OrderItemModule } from "@modules/OrderItemModule";
import { AddressModule } from "@modules/AddressModule";
import { CurrencyModule } from "@modules/CurrencyModule";

export const PayPalModule = new GraphQLModule({
  imports: [AuthModule, OrderItemModule, AddressModule, CurrencyModule],
  typeDefs,
  resolvers,
  providers: [PayPalProvider],
});