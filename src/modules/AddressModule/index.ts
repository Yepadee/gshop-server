import "graphql-import-node";
import { GraphQLModule } from "@graphql-modules/core";
import * as typeDefs from "./schema.gql";

export const AddressModule = new GraphQLModule({
  typeDefs
});