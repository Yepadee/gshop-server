 import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLFloat,
    GraphQLNonNull
} from 'graphql';

import db from './models';

const ProductTypeType = new GraphQLObjectType({
    name: 'ProductType',
    description: 'A type of product',
    fields: () => ({
        name: {
            type: GraphQLString,
            resolve: (productType) => {
                return productType.name;
            }
        },
        products: {
            type: new GraphQLList(ProductType),
            resolve: (productType) => {
                return productType.getProducts();
            }
        },
        properties: {
            type: new GraphQLList(PropertyNameType),
            resolve: (productType) => {
                return productType.getPropertyNames();
            } 
        }
    })
});

const PropertyNameType = new GraphQLObjectType({
    name: 'PropertyName',
    description: 'A property of a type of product',
    fields: () => ({
        id: {
            type: GraphQLInt,
            resolve: (propertyName) => {
                return propertyName.id;
            }
        },
        name: {
            type: GraphQLString,
            resolve: (propertyName) => {
                return propertyName.name;
            }
        },
        values: {
            type: new GraphQLList(PropertyValueType),
            resolve: (propertyName) => {
                return propertyName.getPropertyValues();
            }
        },
        productType: {
            type: ProductTypeType,
            resolve: (propertyName) => {
                return propertyName.getProductType();
            }
        }
    })
});

const PropertyValueType = new GraphQLObjectType({
    name: 'PropertyValue',
    description: 'A value a type-property may take',
    fields: () => ({
        id: {
            type: GraphQLInt,
            resolve: (propertyValue) => {
                return propertyValue.id;
            }
        },
        value: {
            type: GraphQLString,
            resolve: (propertyValue) => {
                return propertyValue.value;
            }
        },
        propertyName: {
            type: PropertyNameType,
            resolve: (propertyValue) => {
                return propertyValue.getPropertyName();
            }
        }
    })   
});

const ProductType = new GraphQLObjectType({
    name: 'Product',
    description: 'A product for sale in the shop',
    fields: () => ({
        id: {
            type: GraphQLInt,
            resolve: (product) => {
                return product.id;
            }
        },
        name: {
            type: GraphQLString,
            resolve: (product) => {
                return product.name;
            }
        },
        description: {
            type: GraphQLString,
            resolve: (product) => {
                return product.description;
            }
        },
        price: {
            type: GraphQLFloat,
            resolve: (product) => {
                return product.price;
            }
        },
        discount: {
            type: GraphQLFloat,
            resolve: (product) => {
                return product.discount;
            }
        },
        catagory: {
            type: GraphQLString,
            resolve: (product) => {
                return product.catagory
            }
        },
        productType: {
            type: ProductTypeType,
            resolve: (product) => {
                return product.getProductType();
            }
        },
        stock: {
            type: new GraphQLList(StockType),
            resolve: (product) => {
                return product.getStocks();
            }
        },
        propertyValues: {
            type: new GraphQLList(PropertyValueType),
            resolve: (product) => {
                return product.getPropertyValues();
            }
        }
    })
});

const StockType = new GraphQLObjectType({
    name: 'Stock',
    description: 'The stock of a variant of product',
    fields: () => ({
        id: {
            type: GraphQLInt,
            resolve: (product) => {
                return product.id;
            }
        },
        quantity: {
            type: GraphQLInt,
            resolve: (stock) => {
                return stock.quantity;
            }
        },
        propertyValues: {
            type: new GraphQLList(PropertyValueType),
            resolve: (stock) => {
                return stock.getPropertyValues();
            }
        },
        product: {
            type: ProductType,
            resolve: (stock) => {
                return stock.getProduct();
            }
        }
    })
});

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'The root query',
    fields: () => ({
        productTypes: {
            type: new GraphQLList(ProductTypeType),
            args: {
                id: { type: GraphQLInt },
                name: { type: GraphQLString }
            },
            resolve: (root, args) => {
                return db.models.productType.findAll({where: args})
            }
        },
        propertyNames: {
            type: new GraphQLList(PropertyNameType),
            args: {
                id: { type: GraphQLInt },
                name: { type: GraphQLString }
            },
            resolve: (root, args) => {
                return db.models.propertyName.findAll({where: args})
            }
        },
        propertyValues: {
            type: new GraphQLList(PropertyValueType),
            args: {
                id: { type: GraphQLInt },
                name: { type: GraphQLString }
            },
            resolve: (root, args) => {
                return db.models.propertyValue.findAll({where: args})
            }
        },
        products: {
            type: new GraphQLList(ProductType),
            args: {
                id: { type: GraphQLInt },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                price: { type: GraphQLFloat },
                discount: { type: GraphQLFloat },
                catagory: { type: GraphQLString }
            },
            resolve: (root, args) => {
                return db.models.product.findAll({where: args})
            }
        },
        stock: {
            type: new GraphQLList(StockType),
            args: {
                id: { type: GraphQLInt },
                quantity: { type: GraphQLInt },
                propertyValues: { type: new GraphQLList(GraphQLInt) }
            },
            resolve: (root, args) => {
                return db.models.stock.findAll({where: args})
            }
        }
    })
});

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root mutation',
    fields: () => ({
        addProductType: {
            type: ProductTypeType,
            args: {
                name: { type: GraphQLString }
            },
            resolve: (_, args) => {
                return productType.create({
                    name: args.name
                })
            }
        },
        addPropertyName: {
            type: PropertyNameType,
            args: {
                productTypeId: { type: GraphQLInt },
                name: { type: GraphQLString }
            },
            resolve: (_, args) => {
                return propertyName.create({
                    productType: args.productTypeId,
                    name: args.name
                })
            }
        },
        addPropertyValue: {
            type: PropertyValueType,
            args: {
                propertyNameId: { type: GraphQLInt },
                value: { type: GraphQLString }
            },
            resolve: (_, args) => {
                return propertyValue.create({
                    propertyName: args.propertyNameId,
                    value: args.value
                })
            }
        },
        addProduct: {
            type: ProductType,
            args: {
                name: { type: GraphQLString },
                description: { type: new GraphQLNonNull(GraphQLString) },
                price: { type: new GraphQLNonNull(GraphQLFloat) },
                propertyValues: { type: new GraphQLList(GraphQLInt) }
            },
            resolve: (_, args) => {
                return product.create({
                    name: args.name,
                    description: args.description,
                    price: args.price,
                    discount: 0,
                    propertyValues: args.propertyValues
                }).then((product) => {
                    product.setPropertyValues(args.propertyValues)
                    return product
                })
            }
        },
        addStock: {
            type: StockType,
            args: {
                productId: { type: new GraphQLNonNull(GraphQLInt) },
                quantity: { type: new GraphQLNonNull(GraphQLInt) },
                propertyValues: { type: new GraphQLList(GraphQLInt) }
            },
            resolve: (_, args) => {
                return stock.create({
                    productId: args.productId,
                    quantity: args.quantity
                }).then((stock) => {
                    stock.setPropertyValues(args.propertyValues)
                    return stock
                })
            }
        }
    })
});

const Schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
});

export default Schema