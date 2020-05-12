import "reflect-metadata";
import * as _ from "lodash";
import * as faker from "faker";
import { ApolloServer } from 'apollo-server';

import {createConnection} from "typeorm";
import {ProductType} from "@entity/ProductType";
import {Product} from "@entity/Product";
import {TypePropertyName} from "@entity/TypeProperty/TypePropertyName";
import {TypePropertyValue} from "@entity/TypeProperty/TypePropertyValue";
import {Stock} from "@entity/Stock";
import {ProductPropertyName} from "@entity/ProductProperty/ProductPropertyName";

import { GraphQLModules } from "@modules";


createConnection().then(async connection => {
  connection.synchronize(true).then( async () => {
    const productType = new ProductType();
    productType.name = "Clothing";
    await connection.manager.save(productType);

    const typePropertyName = new TypePropertyName();
    typePropertyName.name = "Size";
    await connection.manager.save(typePropertyName);

    const tv1 = new TypePropertyValue();
    tv1.value = "Small";
    tv1.propertyName = <any>{id:1};
    await connection.manager.save(tv1);

    const tv2 = new TypePropertyValue();
    tv2.value = "Medium";
    tv2.propertyName = <any>{id:1};
    await connection.manager.save(tv2);

    const tv3 = new TypePropertyValue();
    tv3.value = "Large";
    tv3.propertyName = <any>{id:1};
    await connection.manager.save(tv3);


    const productPropertyName = new ProductPropertyName();
    productPropertyName.name = "Colour";
    await connection.manager.save(productPropertyName);


    _.times(2, async () => {
      const product = new Product();
      product.name = faker.commerce.product();
      product.description = faker.commerce.productAdjective();
      product.price = faker.random.number({ max: 1, min: 30 });
      product.catagory = "hoodie";
      product.type = <any>{id:1};
      product.productPropertyValues = <any>[{value:"red", propertyName: {id:1}}, {value:"green", propertyName: {id:1}}];
      await connection.manager.save(product);

      const s1 = new Stock();
      s1.quantity = faker.random.number({ max: 1, min: 30 });
      s1.product = product;
      s1.productPropertyValues = <any>[{id:1}];
      s1.typePropertyValues = <any>[{id:1}];
      await connection.manager.save(s1);

      const s2 = new Stock();
      s2.quantity = faker.random.number({ max: 2, min: 30 });
      s2.product = product;
      s2.productPropertyValues = <any>[{id:2}];
      s2.typePropertyValues = <any>[{id:2}];
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