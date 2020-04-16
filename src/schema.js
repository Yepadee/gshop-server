import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLFloat,
    GraphQLNonNull,
    GraphQLID
} from 'graphql';

import db from './models';
import {checkPermsAndResolve} from './security'


const ProductTypeType = new GraphQLObjectType({
    name: 'ProductType',
    description: 'A type of product',
    fields: () => ({
        id: {
            type: GraphQLID,
            resolve: (productType) => {
                return productType.id;
            }
        },
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
        productPropertyNames: {
            type: new GraphQLList(ProductPropertyNameType),
            resolve: (productType) => {
                return productType.getProductPropertyNames();
            } 
        },
        typePropertyNames: {
            type: new GraphQLList(TypePropertyNameType),
            resolve: (productType) => {
                return productType.getTypePropertyNames();
            } 
        }
    })
});

const TypePropertyNameType = new GraphQLObjectType({
    name: 'TypePropertyName',
    description: 'A property of a type of product',
    fields: () => ({
        id: {
            type: GraphQLID,
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
            type: new GraphQLList(TypePropertyValueType),
            resolve: (propertyName) => {
                return propertyName.getTypePropertyValues();
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

const TypePropertyValueType = new GraphQLObjectType({
    name: 'TypePropertyValue',
    description: 'A value a product type property may take',
    fields: () => ({
        id: {
            type: GraphQLID,
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
            type: ProductPropertyNameType,
            resolve: (propertyValue) => {
                return propertyValue.getTypePropertyName();
            }
        }
    })   
});

const ProductPropertyNameType = new GraphQLObjectType({
    name: 'ProductPropertyName',
    description: 'A property of a product',
    fields: () => ({
        id: {
            type: GraphQLID,
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
            type: new GraphQLList(ProductPropertyValueType),
            resolve: (propertyName) => {
                return propertyName.getProductPropertyValues();
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

const ProductPropertyValueType = new GraphQLObjectType({
    name: 'ProductPropertyValue',
    description: 'A value a product property may take',
    fields: () => ({
        id: {
            type: GraphQLID,
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
            type: ProductPropertyNameType,
            resolve: (propertyValue) => {
                return propertyValue.getProductPropertyName();
            }
        }
    })   
});

const ProductType = new GraphQLObjectType({
    name: 'Product',
    description: 'A product for sale in the shop',
    fields: () => ({
        id: {
            type: GraphQLID,
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
        productPropertyValues: {
            type: new GraphQLList(ProductPropertyValueType),
            resolve: (product) => {
                return product.getProductPropertyValues();
            }
        }
    })
});

const StockType = new GraphQLObjectType({
    name: 'Stock',
    description: 'The stock of a variant of product',
    fields: () => ({
        id: {
            type: GraphQLID,
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
        productPropertyValues: {
            type: new GraphQLList(ProductPropertyValueType),
            resolve: (stock) => {
                return stock.getProductPropertyValues();
            }
        },
        typePropertyValues: {
            type: new GraphQLList(TypePropertyValueType),
            resolve: (stock) => {
                return stock.getTypePropertyValues();
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
                id: { type: GraphQLID },
                name: { type: GraphQLString }
            },
            resolve: (_, args) => {
                return db.models.productType.findAll({where: args})
            }
        },
        productPropertyNames: {
            type: new GraphQLList(ProductPropertyNameType),
            args: {
                id: { type: GraphQLID },
                name: { type: GraphQLString }
            },
            resolve: (_, args) => {
                return db.models.productPropertyName.findAll({where: args})
            }
        },
        productPropertyValues: {
            type: new GraphQLList(ProductPropertyValueType),
            args: {
                id: { type: GraphQLID },
                name: { type: GraphQLString }
            },
            resolve: (_, args) => {
                return db.models.productPropertyValue.findAll({where: args})
            }
        },
        typePropertyNames: {
            type: new GraphQLList(TypePropertyNameType),
            args: {
                id: { type: GraphQLID },
                name: { type: GraphQLString }
            },
            resolve: (_, args) => {
                return db.models.typePropertyName.findAll({where: args})
            }
        },
        typePropertyValues: {
            type: new GraphQLList(TypePropertyValueType),
            args: {
                id: { type: GraphQLID },
                name: { type: GraphQLString }
            },
            resolve: (_, args) => {
                return db.models.typePropertyValue.findAll({where: args})
            }
        },
        products: {
            type: new GraphQLList(ProductType),
            args: {
                id: { type: GraphQLID },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                price: { type: GraphQLFloat },
                discount: { type: GraphQLFloat },
                catagory: { type: GraphQLString }
            },
            resolve: (_, args) => {
                return db.models.product.findAll({where: args})
            }
        },
        stock: {
            type: new GraphQLList(StockType),
            args: {
                id: { type: GraphQLID },
                quantity: { type: GraphQLInt },
                propertyValues: { type: new GraphQLList(GraphQLInt) }
            },
            resolve: (_, args) => {
                return db.models.stock.findAll({where: args})
            }
        }
    })
});

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root mutation',
    fields: () => ({
        //ADD
        addProductType: {
            type: ProductTypeType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (_, args) => {
                return db.models.productType.create({
                    name: args.name
                })
            }
        },

        addTypePropertyName: {
            type: TypePropertyNameType,
            args: {
                productTypeId: { type: new GraphQLNonNull(GraphQLID) },
                name: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (_, args) => {
                return db.models.typePropertyName.create({
                    productType: args.productTypeId,
                    name: args.name
                })
            }
        },

        addTypePropertyValue: {
            type: TypePropertyValueType,
            args: {
                propertyNameId: { type: new GraphQLNonNull(GraphQLID) },
                value: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (_, args) => {
                return db.models.typePropertyValue.create({
                    typePropertyNameId: args.propertyNameId,
                    value: args.value
                })
            }
        },

        addProductPropertyName: {
            type: ProductPropertyNameType,
            args: {
                productTypeId: { type: new GraphQLNonNull(GraphQLID) },
                name: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (_, args) => {
                return db.models.productPropertyName.create({
                    productType: args.productTypeId,
                    name: args.name
                })
            }
        },

        addProduct: {
            type: ProductType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: new GraphQLNonNull(GraphQLString) },
                price: { type: new GraphQLNonNull(GraphQLFloat) },
                catagory: { type: new GraphQLNonNull(GraphQLString) },
                productTypeId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: (_, args) => {
                return db.models.product.create({
                    name: args.name,
                    description: args.description,
                    price: args.price,
                    discount: 0,
                    productType: args.productTypeId
                });
            }
        },

        addProductPropertyValue: {
            type: ProductPropertyValueType,
            args: {
                productId: { type: new GraphQLNonNull(GraphQLID) },
                propertyNameId: { type: new GraphQLNonNull(GraphQLID) },
                value: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (_, args) => {
                return db.models.propertyValue.create({
                    productId: args.productId,
                    propertyNameId: args.propertyNameId,
                    value: valueName
                });
            }
        },

        addStock: {
            type: StockType,
            args: {
                productId: { type: new GraphQLNonNull(GraphQLID) },
                quantity: { type: new GraphQLNonNull(GraphQLInt) },
                productPropertyValues: { type: new GraphQLList(GraphQLID) },
                typePropertyValues: { type: new GraphQLList(GraphQLID) }
            },
            resolve: (_, args) => {
                return db.models.stock.create({
                    productId: args.productId,
                    quantity: args.quantity
                }).then((stock) => {
                    stock.setProductPropertyValues(args.productPropertyValues)
                    stock.setTypePropertyValues(args.typePropertyValues)
                    return stock
                })
            }
        },

        //DELETE
        removeProductType: {
            type: ProductTypeType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: (_, args) => {
                return db.models.productType.destroy({ where: args });
            }
        },

        removeTypePropertyName: {
            type: TypePropertyNameType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: (_, args) => {
                return db.models.typePropertyName.destroy({ where: args });
            }
        },

        removeTypePropertyValue: {
            type: TypePropertyValueType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: (_, args) => {
                return db.models.typePropertyValue.destroy({ where: args });
            }
        },

        removeProductPropertyName: {
            type: ProductPropertyNameType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: (_, args) => {
                return db.models.productPropertyName.destroy({ where: args });
            }
        },

        removeProduct: {
            type: ProductType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: (_, args) => {
                return db.models.product.destroy({ where: args });
            }
        },

        removeProductPropertyValue: {
            type: ProductPropertyValueType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: (_, args) => {
                return db.models.productPropertyValue.destroy({ where: args });
            }
        },

        removeStock: {
            type: StockType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: (_, args) => {
                return db.models.stock.destroy({ where: args });
            }
        },
    })
});

const Schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
});

export default Schema