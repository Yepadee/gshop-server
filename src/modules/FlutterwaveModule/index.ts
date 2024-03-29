import "graphql-import-node";
import { GraphQLModule } from "@graphql-modules/core";
import * as typeDefs from "./schema.gql";
import resolvers from "./resolvers";

import { FlutterwaveProvider } from "./provider";
import { AuthModule } from "@modules/AuthModule";
import { AddressModule } from "@modules/AddressModule";
import { OrderItemModule } from "@modules/OrderItemModule";
import { CurrencyModule } from "@modules/CurrencyModule";

export const FlutterwaveModule = new GraphQLModule({
  imports: [AuthModule, OrderItemModule, AddressModule, CurrencyModule],
  typeDefs,
  resolvers,
  providers: [FlutterwaveProvider],
});