import { makeExecutableSchema  } from 'apollo-server';

import { merge } from 'lodash';

import db from '../models';

import {
    typeDef as Product,
    resolvers as productResolvers,
} from './product';

import {
    typeDef as ProductPropertyName,
    resolvers as productPropertyNameResolvers,
} from './productPropertyName';

import {
    typeDef as ProductPropertyValue,
    resolvers as productPropertyValueResolvers,
} from './productPropertyValue';

import {
    typeDef as ProductType,
    resolvers as productTypeResolvers,
} from './productType';

import {
    typeDef as Stock,
    resolvers as stockResolvers,
} from './stock';

import {
    typeDef as TypePropertyName,
    resolvers as typePropertyNameResolvers,
} from './typePropertyName';

import {
    typeDef as TypePropertyValue,
    resolvers as typePropertyValueResolvers,
} from './typePropertyValue';

const Query = `
type Query {
    productTypes(id: ID): [ProductType]
    productPropertyNames(id: ID): [ProductPropertyName]
    productPropertyValues(id: ID): [ProductPropertyValue]
    typePropertyNames(id: ID): [TypePropertyName]
    typePropertyValues(id: ID): [TypePropertyValue]
    products(id: ID): [Product]
    stock(id: ID): [Stock]
}
`;

const resolvers = {
    Query: {
        productTypes: (_, args) => {
            return db.models.productType.findAll({ where: args })
        },
        productPropertyNames: (_, args) => {
            return db.models.productPropertyName.findAll({ where: args })
        },
        productPropertyValues: (_, args) => {
            return db.models.productPropertyValue.findAll({ where: args })
        },
        typePropertyNames: (_, args) => {
            return db.models.typePropertyName.findAll({ where: args })
        },
        typePropertyValues: (_, args) => {
            return db.models.typePropertyValue.findAll({ where: args })
        },
        products: (_, args) => {
            return db.models.product.findAll({ where: args })
        },
        stock: (_, args) => {
            return db.models.stock.findAll({ where: args })
        }
    },
};

const schema = makeExecutableSchema({
    typeDefs: [
        Query,
        Product,
        ProductPropertyName,
        ProductPropertyValue,
        ProductType,
        Stock,
        TypePropertyName,
        TypePropertyValue
    ],
    resolvers: merge(
        resolvers,
        productResolvers,
        productPropertyNameResolvers,
        productPropertyValueResolvers,
        productTypeResolvers,
        stockResolvers,
        typePropertyNameResolvers,
        typePropertyValueResolvers
    ),
});

export default schema;