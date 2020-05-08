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

    updateProductType(id: ID!, name: String!): Boolean
    updateTypePropertyName(id: ID!, name: String): Boolean
    updateTypePropertyValue(id: ID!, value: String): Boolean
    updateProductPropertyName(id: ID!, name: String): Boolean
    updateProduct(id: ID!, name: String, description: String, price: Float, catagory: String): Boolean
    updateProductPropertyValue(id: ID!, value: String): Boolean
    updateStock(id: ID!, quantity: Int): Boolean

    removeProductType(id: ID): Boolean
    removeTypePropertyName(id: ID): Boolean
    removeTypePropertyValue(id: ID): Boolean
    removeProductPropertyName(id: ID): Boolean
    removeProduct(id: ID): Boolean
    removeProductPropertyValue(id: ID): Boolean
    removeStock(id: ID): Boolean
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
        //CREATE
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

        addProductPropertyName: (_, args) => {
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

        addProductPropertyValue: (_, args) => {
            return db.models.productPropertyValue.create({
                productId: args.productId,
                productPropertyNameId: args.parentId,
                value: args.value
            });
        },
        //TODO: Validate
        addStock: async (_, args) => {
            const stock = await db.models.stock.create({
                productId: args.parentId,
                quantity: args.quantity
            });

            await stock.setProductPropertyValues(args.productPropertyValueIds);
            await stock.setTypePropertyValues(args.typePropertyValueIds);

            return stock
        },

        //UPDATE
        updateProductType: async (_, args) => {
            await db.models.productType.update({
                name: args.name
            }, {where: {id: args.id}});
            return true;
        },

        updateTypePropertyName: async (_, args) => {
            await db.models.typePropertyName.update({
                name: args.name
            }, {where: {id: args.id}});
            return true;
        },

        updateTypePropertyValue: async (_, args) => {
            await db.models.typePropertyValue.update({
                value: args.value
            }, {where: {id: args.id}});
            return true;
        },

        updateProductPropertyName: async (_, args) => {
            await db.models.productPropertyName.update({
                name: args.name
            }, {where: {id: args.id}});
            return true;
        },

        updateProduct: async (_, args) => {
            await db.models.product.update({
                name: args.name,
                description: args.description,
                price: args.price,
                discount: 0,
                catagory: args.catagory
            }, {where: {id: args.id}});
            return true;
        },

        updateProductPropertyValue: async (_, args) => {
            await db.models.productPropertyValue.update({
                value: args.value
            }, {where: {id: args.id}});
            return true;
        },
        //TODO: Validate
        updateStock: async (_, args) => {
            const stock = await db.models.stock.update({
                quantity: args.quantity
            }, {where: {id: args.id}});
            return true;
        },
        
        //DELETE
        removeProductType: async (_, args) => {
            await db.models.productType.destroy({ where: args });
            return true;
        },

        removeTypePropertyName: async (_, args) => {
            await db.models.typePropertyName.destroy({ where: args });
            return true;
        },

        removeTypePropertyValue: async (_, args) => {
            await db.models.typePropertyValue.destroy({ where: args });
            return true;
        },

        removeProductPropertyName: async (_, args) => {
            await db.models.productPropertyName.destroy({ where: args });
            return true;
        },

        removeProduct: async (_, args) => {
            await db.models.product.destroy({ where: args });
            return true;
        },

        removeProductPropertyValue: async (_, args) => {
            await db.models.productPropertyValue.destroy({ where: args });
            return true;
        },

        removeStock: async (_, args) => {
            await db.models.stock.destroy({ where: args });
            return true;
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