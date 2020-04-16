const typeDef = `
type Product {
    id: ID!
    name: String!
    description: String
    price: Float
    discount: Float
    catagory: String!
    productType: ProductType!
    stock: [Stock]
    productPropertyValues: [ProductPropertyValue]
}
`;

const resolvers = {
    Product: {
        stock: (product) => {
            return product.getStocks();
        },
    }
};

export {typeDef, resolvers};