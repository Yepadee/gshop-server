import "reflect-metadata";
import {createConnection} from "typeorm";
import {ProductType} from "./entity/ProductType";
import {Product} from "./entity/Product";
//import {Stock} from "./entity/Stock";

import { ApolloServer, gql } from 'apollo-server';

const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
`;

const books = [
    {
      title: 'Harry Potter and the Chamber of Secrets',
      author: 'J.K. Rowling',
    },
    {
      title: 'Jurassic Park',
      author: 'Michael Crichton',
    },
];

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
  },
};

createConnection().then(async connection => {

    await connection.synchronize();
    console.log("Inserting a new user into the database...");
    const productType = new ProductType();
    productType.name = "Clothing";
    await connection.manager.save(productType);
    console.log("Saved a new user with id: " + productType.id);

    
    const product = new Product();
    product.name = "T-Shirt";
    product.description = "amazing t-shirt";
    product.price = 15.00;
    product.type = <any>{id:1};
    await connection.manager.save(product);


}).catch(error => console.log(error));

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});