import "graphql-import-node";
import { GraphQLModule } from "@graphql-modules/core";
import * as typeDefs from "./schema.gql";
import resolvers from "./resolvers";

import { AuthModule } from "modules/AuthModule";

export const AddressModule = new GraphQLModule({
  imports: [AuthModule],
  typeDefs,
  resolvers
});