const typeDef = `
type ProductPropertyValue {
    id: ID!
    value: String!
    propertyName: ProductPropertyName!
}
`;

const resolvers = {
    ProductPropertyValue: {
        propertyName: (productPropertyValue) => {
            return productPropertyValue.getPropertyName();
        }
    }
};

export {typeDef, resolvers};