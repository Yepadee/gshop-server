import "graphql-import-node";
import { GraphQLModule } from "@graphql-modules/core";
import * as typeDefs from "./schema.gql";
import resolvers from "./resolvers";


export const AddressModule = new GraphQLModule({
  typeDefs,
  resolvers,
});