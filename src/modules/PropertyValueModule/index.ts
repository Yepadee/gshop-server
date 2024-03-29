import "graphql-import-node";
import { GraphQLModule } from "@graphql-modules/core";
import * as typeDefs from "./schema.gql";
import resolvers from "./resolvers";

import { PropertyValueProvider } from "./provider";
import { AuthModule } from "@modules/AuthModule";

export const PropertyValueModule = new GraphQLModule({
  imports: [AuthModule],
  typeDefs,
  resolvers,
  providers: [PropertyValueProvider]
});