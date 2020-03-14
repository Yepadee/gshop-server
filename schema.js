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
        stock: {
            type: new GraphQLList(StockType),
            resolve: (product) => {
                return product.getStocks();
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
        stockProperties: {
            type: new GraphQLList(StockPropertyType),
            resolve: (stock) => {
                return stock.getStockProperties();
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

const StockPropertyType = new GraphQLObjectType({
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
        stock: {
            type: StockType,
            resolve: (stockProperty) => {
                return stockProperty.getStock();
            }
        }
    })
});

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'The root query',
    fields: () => ({
        products: {
            type: new GraphQLList(ProductType),
            args: {
                id: { type: GraphQLInt },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                price: { type: GraphQLFloat }
            },
            resolve: (root, args) => {
                return db.models.product.findAll({where: args})
            }
        },
        stock: {
            type: new GraphQLList(StockType),
            args: {
                id: { type: GraphQLInt },
                quantity: { type: GraphQLInt }
            },
            resolve: (root, args) => {
                return db.models.stock.findAll({where: args})
            }
        },
        stockProperties: {
            type: new GraphQLList(StockPropertyType),
            args: {
                id: { type: GraphQLInt },
                key: { type: GraphQLString},
                value: { type: GraphQLString}
            },
            resolve: (root, args) => {
                return db.models.stockProperty.findAll({where: args})
            }
        }
    })
});

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root mutation',
    fields: () => ({
        addProduct: {
            type: ProductType,
            args: {
                name: { type: GraphQLString },
                description: { type: new GraphQLNonNull(GraphQLString) },
                price: { type: new GraphQLNonNull(GraphQLFloat) }
            },
            resolve: (_, args) => {
                return db.models.product.create({
                    name: args.name,
                    description: args.description,
                    price: args.price,
                    discount: 0
                })
            }
        },
        addStock: {
            type: StockType,
            args: {
                productId: { type: new GraphQLNonNull(GraphQLInt) },
                quantity: { type: new GraphQLNonNull(GraphQLInt) } 
            },
            resolve: (_, args) => {
                return db.models.stock.create({
                    productId: args.productId,
                    quantity: args.quantity
                })
            }
        },
        addStockProperty: {
            type: StockPropertyType,
            args: {
                stockId: { type: new GraphQLNonNull(GraphQLInt) },
                key: { type: new GraphQLNonNull(GraphQLString) },
                value: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (_, args) => {
                return db.models.stockProperty.create({
                    stockId: args.stockId,
                    key: args.key,
                    value: args.value
                })
            }
        }
    })

});

const Schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
});

module.exports = Schema;