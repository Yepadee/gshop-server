db = require('./database.js');

const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLFloat,
    GraphQLNonNull
} = require('graphql')

const Product = new GraphQLObjectType({
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
        }
    })
});

const Stock = new GraphQLObjectType({
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
    })
});

const StockProperty = new GraphQLObjectType({
    name: 'StockProperty',
    description: 'The properties assigned to an item of stock',
    fields: () => ({
        id: {
            type: GraphQLInt,
            resolve: (product) => {
                return product.id;
            }
        },
        key: {
            type: GraphQLString,
            resolve: (stockProperty) => {
                return stockProperty.key;
            }
        },
        value: {
            type: GraphQLString,
            resolve: (stockProperty) => {
                return stockProperty.value;
            }
        },
    })
});

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'The root query',
    fields: () => ({
        product: {
            type: new GraphQLList(Product),
            args: {
                id: { type: GraphQLInt },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                price: { type: GraphQLFloat }
            },
            resolve: (root, args) => {
                return db.models.product.findAll({where: args})
            }
        }
    })
});

const Schema = new GraphQLSchema({
    query: RootQueryType
});

module.exports = Schema;