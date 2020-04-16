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

const Mutation = `
type Mutation {
    addProductType(name: String!): ProductType
    addTypePropertyName(parentId: ID!, name: String!): TypePropertyName
    addTypePropertyValue(parentId: ID!, value: String!): TypePropertyValue
    addProductPropertyName(parentId: ID!, name: String!): ProductPropertyName
    addProduct(parentId: ID!, name: String!, description: String, price: Float!, catagory: String): Product
    addProductPropertyValue(parentId: ID!, productId: ID!, value: String!): ProductPropertyValue
    addStock(parentId: ID!, productPropertyValueIds: [ID], typePropertyValueIds: [ID], quantity: Int): Stock

    removeProductType(id: ID): ProductType
    removeTypePropertyName(id: ID): TypePropertyName
    removeTypePropertyValue(id: ID): TypePropertyValue
    removeProductPropertyName(id: ID): ProductPropertyName
    removeProduct(id: ID): Product
    removeProductPropertyValue(id: ID): ProductPropertyValue
    removeStock(id: ID): Stock
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
    Mutation: {
        addProductType: (_, args) => {
            return db.models.productType.create({
                name: args.name
            })
        },

        addTypePropertyName: (_, args) => {
            return db.models.typePropertyName.create({
                productTypeId: args.parentId,
                name: args.name
            })
        },

        addTypePropertyValue: (_, args) => {
            return db.models.typePropertyValue.create({
                typePropertyNameId: args.parentId,
                value: args.value
            })
        },

        addProductPropertyName:  (_, args) => {
            return db.models.productPropertyName.create({
                productTypeId: args.parentId,
                name: args.name
            })
        },

        addProduct: (_, args) => {
            return db.models.product.create({
                name: args.name,
                description: args.description,
                price: args.price,
                discount: 0,
                catagory: args.catagory,
                productTypeId: args.parentId
            });
        },

        addProductPropertyValue:  (_, args) => {
            return db.models.productPropertyValue.create({
                productId: args.productId,
                productPropertyNameId: args.parentId,
                value: args.value
            });
        },
        //TODO: Validate
        addStock:  async (_, args) => {
            const stock = await db.models.stock.create({
                productId: args.parentId,
                quantity: args.quantity
            });

            await stock.setProductPropertyValues(args.productPropertyValueIds);
            await stock.setTypePropertyValues(args.typePropertyValueIds);

            return stock
        },

        //DELETE
        removeProductType: (_, args) => {
            return db.models.productType.destroy({ where: args });
        },

        removeTypePropertyName: (_, args) => {
            return db.models.typePropertyName.destroy({ where: args });
        },

        removeTypePropertyValue: (_, args) => {
            return db.models.typePropertyValue.destroy({ where: args });
        },

        removeProductPropertyName: (_, args) => {
            return db.models.productPropertyName.destroy({ where: args });
        },

        removeProduct: (_, args) => {
            return db.models.product.destroy({ where: args });
        },

        removeProductPropertyValue: (_, args) => {
            return db.models.productPropertyValue.destroy({ where: args });
        },

        removeStock: (_, args) => {
            return db.models.stock.destroy({ where: args });
        }
    }
};

const schema = makeExecutableSchema({
    typeDefs: [
        Query,
        Mutation,
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