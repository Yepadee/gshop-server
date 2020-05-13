import "reflect-metadata";
import * as _ from "lodash";
import * as faker from "faker";
import { ApolloServer } from 'apollo-server';

import {createConnection} from "typeorm";
import {ProductType} from "@entity/ProductType";
import {Product} from "@entity/Product";

import {PropertyName} from "@entity/Property/PropertyName";
import {PropertyValue} from "@entity/Property/PropertyValue";

import {Stock} from "@entity/Stock";

import { GraphQLModules } from "@modules";


createConnection().then(async connection => {
  connection.synchronize(true).then( async () => {
    const productType = new ProductType();
    productType.name = "Clothing";
    await connection.manager.save(productType);

    const propertyName = new PropertyName();
    propertyName.name = "Size";
    propertyName.productType = <any>{id:1};
    await connection.manager.save(propertyName);

    const v1 = new PropertyValue();
    v1.value = "Small";
    v1.propertyName = <any>{id:1};
    await connection.manager.save(v1);

    const v2 = new PropertyValue();
    v2.value = "Medium";
    v2.propertyName = <any>{id:1};
    await connection.manager.save(v2);

    const v3 = new PropertyValue();
    v3.value = "Large";
    v3.propertyName = <any>{id:1};
    await connection.manager.save(v3);

    const propertyName2 = new PropertyName();
    propertyName2.name = "Colour";
    propertyName2.productType = <any>{id:1};
    await connection.manager.save(propertyName2);

    const v4 = new PropertyValue();
    v4.value = "Red";
    v4.propertyName = <any>{id:2};
    await connection.manager.save(v4);

    const v5 = new PropertyValue();
    v5.value = "Green";
    v5.propertyName = <any>{id:2};
    await connection.manager.save(v5);

    const v6 = new PropertyValue();
    v6.value = "Blue";
    v6.propertyName = <any>{id:2};
    await connection.manager.save(v6);



    _.times(2, async () => {
      const product = new Product();
      product.name = faker.commerce.product();
      product.description = faker.commerce.productAdjective();
      product.price = faker.random.number({ max: 1, min: 30 });
      product.catagory = "hoodie";
      product.type = <any>{id:1};
      await connection.manager.save(product);

      const s1 = new Stock();
      s1.quantity = faker.random.number({ max: 1, min: 30 });
      s1.product = <any>product;
      s1.properties = <any>[{id:1}, {id:4}];
      await connection.manager.save(s1);

      const s2 = new Stock();
      s2.quantity = faker.random.number({ max: 1, min: 30 });
      s2.product = <any>product;
      s2.properties = <any>[{id:2}, {id:5}];
      await connection.manager.save(s2);
    });
  });
}).catch(error => console.log(error));


// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  schema: GraphQLModules.schema,
  resolvers: GraphQLModules.resolvers,
  context: session => session
});

// The `listen` method launches a web server.
server.listen({port: 3000}).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});