import { GraphQLModule } from '@graphql-modules/core';
import gql from 'graphql-tag';

export const ProductTypeModule = new GraphQLModule({
  typeDefs: gql`
    type Query {
      myData: Data
    }

    type Data {
      field: String
    }
  `
});