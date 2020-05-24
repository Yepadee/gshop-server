import "graphql-import-node";
import { GraphQLModule } from "@graphql-modules/core";
import * as typeDefs from "./schema.gql";
import resolvers from "./resolvers";

import { AuthProvider } from "./provider";
import { IsAuthenticatedDirective } from "@directives/isAuthenticated";

export const AuthModule = new GraphQLModule({
  typeDefs,
  resolvers,
  providers: [AuthProvider],
  context: ({ req }, _, { injector }) => {
    const authToken = req.headers.authorization;
    const currentUser = injector.get(AuthProvider).authorizeUser(authToken);
    return { currentUser }
  },
  schemaDirectives: {
      auth: IsAuthenticatedDirective
  }
});