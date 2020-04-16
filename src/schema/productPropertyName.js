const typeDef = `
type ProductPropertyName {
    id: ID!
    name: String!
    values: [ProductPropertyValue]
    productType: ProductType
}
`;

const resolvers = {
    ProductPropertyName: {
        values: (productPropertyName) => {
            return productPropertyName.getProductPropertyValues();
        },
    }
};

export {typeDef, resolvers};