const typeDef = `
type Stock {
    id: ID!
    quantity: Int!
    productPropertyValues: [ProductPropertyValue]
    typePropertyValues: [TypePropertyValue]
    product: [ProductType]
}
`;

const resolvers = {
    Stock: {
        productPropertyValues: (stock) => {
            return stock.getProductPropertyValues();
        },
        typePropertyValues: (stock) => {
            return stock.getTypePropertyValues();
        },
        product: (stock) => {
            return stock.getProduct();
        }
    }
};

export {typeDef, resolvers};