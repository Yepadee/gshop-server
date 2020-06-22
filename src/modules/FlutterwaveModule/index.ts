import "graphql-import-node";
import { GraphQLModule } from "@graphql-modules/core";
import * as typeDefs from "./schema.gql";
import resolvers from "./resolvers";

import { FlutterwaveProvider } from "./provider";
import { AuthModule } from "@modules/AuthModule";
import { PayPalModule } from "@modules/PayPalModule";

export const FlutterwaveModule = new GraphQLModule({
  imports: [AuthModule, PayPalModule],
  typeDefs,
  resolvers,
  providers: [FlutterwaveProvider],
});